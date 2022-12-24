import express from "express";
import { getDir, getFileStat, getFileStream, scan } from "../webdav";
import { init, model } from "../db";
import { logError } from "../log";
import { moviedb } from "../tmdb";
const normalizeTitle = (title: string) => {
  if (!title) return title;
  let normalizedTitle = title;
  // 处理有后缀的情况 例如: testmovie.mkv
  const extRE = /\.\w{3}?$/;
  const extIndex = extRE.exec(normalizedTitle)?.index || -1;
  if (extIndex >= 0) {
    normalizedTitle = normalizedTitle.slice(0, extIndex);
  }
  const yearRE = / +[(（]\d{4}[)）]/;
  // TODO 处理年份的情况, 例如 testmovie(2007).mkv,testmovie（2008）.mkv
  const yearIndex = yearRE.exec(normalizedTitle)?.index || -1;
  if (yearIndex >= 0) {
    normalizedTitle = normalizedTitle.slice(0, yearIndex);
  }
  // TODO 处理有画质字符串的情况, 例如 testmovie 1080p.mkv, testmovie(1080p).mkv, testmovie（1080p）
  const qualityRE = / +[(（]?\d{4}[pP][)）]?/;
  const qualityIndex = qualityRE.exec(normalizedTitle)?.index || -1;
  if (qualityIndex >= 0) {
    normalizedTitle = normalizedTitle.slice(0, qualityIndex);
  }
  return normalizedTitle;
};
const getMediaInfo = async (media: any) => {
  const title = normalizeTitle(media.basename) || media.basename;
  const baseInfo = {
    title,
    type: "movie",
    etag: media.etag,
    description: "",
    poster: "",
    isCheck: false
  };
  // TODO 校验是否已有apiKey
  const res = await moviedb.searchMulti({
    query: title,
    language: "zh-cn"
  });
  // 默认取第一个
  const mediaInfo = res.results?.[0];
  console.log("videoInfo:", media.basename, res.results);
  // TODO 处理名称，目前的名称不符合搜索的规范
  if (mediaInfo) {
    // TODO判断是否是movie
    baseInfo.poster = `https://image.tmdb.org/t/p/original${mediaInfo.poster_path}`;
    baseInfo.description = mediaInfo.overview;
    baseInfo.title =
      mediaInfo.media_type === "tv" ? mediaInfo.name : mediaInfo.title;
  }
  return baseInfo;
};
export async function startServer() {
  init();
  // 连接服务器
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(function errorHandler(err, req, res, next) {
    if (res.headersSent) {
      return next(err);
    }
    res.status(500);
    res.render("error", { error: err });
  });
  app.post("/getDirectoryContents", async function (req, res) {
    const body = req.body;
    res.send(await getDir(body.path));
  });
  // 流地址 /stream?path=/filename/fileid
  app.get("/stream", async function (req, res) {
    const body = req.query;
    // 获取文件信息
    const fileStat = await getFileStat(body.path as string);
    const size = (fileStat as any)?.size || 0;
    const range = req.header("range");
    let start = 0;
    let chunkSize = size;
    let end = size;
    if (range) {
      const bytes = range?.split("=")?.[1]; // 开始和结束的位置，如 '17956864-32795686'
      start = Number.parseInt(bytes?.split("-")?.[0] || "0") || start; // 开始位置
      // 结束位置 存在end为空的清空，所以，默认是文件末尾-1
      end =
        Number.parseInt((bytes?.split("-")?.[1] || size - 1) as string) || end;
      // 限制最大的比特大小
      if (end >= size) {
        end = size - 1;
      }
      chunkSize = end - start + 1;
    }
    const stream = await getFileStream(body.path as any, {
      range: { start }
    });
    // 支持range参数
    res.setHeader("Accept-Ranges", "bytes");
    res.setHeader("Content-Range", `bytes ${start}-${end}/${size}`);
    res.setHeader("Content-Length", chunkSize);
    res.statusCode = 206;
    stream.pipe(res);
  });
  // 扫描资源库
  app.get("/scan", async function (req, res) {
    // console.log("scan");
    // const result = await scan("/");
    // console.log("result:", result);
    // await writeFile("./data.json", JSON.stringify(result, null, 2));
    // TODO tmdb是否有apikey
    // TODO
    const data = require(`${process.cwd()}/data.json`).slice(0, 50);
    model.File.bulkCreate(
      data.map((item) => ({
        etag: item.etag,
        title: item.basename,
        url: item.filename,
        mime: item.mime,
        size: item.size
      })),
      {
        // 如果etag冲突则更新
        // updateOnDuplicate: ["etag"],
        // 忽略重复冲突
        ignoreDuplicates: true
      }
    );
    for await (const item of data) {
      // media
      if (/video/.test(item.mime)) {
        const info = await getMediaInfo(item);
        // TODO 构建Movie、Series、Media
        if (info.type === "movie") {
          try {
            const file = await model.File.findOne({
              where: { etag: item.etag }
            });
            const [media] = await model.Media.findOrCreate({
              where: { etag: item.etag },
              defaults: {
                title: info.title,
                type: "movie",
                description: info.description,
                poster: info.poster,
                isCheck: info.isCheck
              }
            });
            const [movie] = await model.Movie.findOrCreate({
              where: { etag: item.etag },
              defaults: {
                title: info.title,
                url: item.filename,
                mime: item.mime,
                size: item.size,
                subtitles: "",
                duration: "00:10:00",
                mediaId: media.id
              }
            });
            if (file && file.movieId !== movie.id) {
              await file.update({ movieId: movie.id });
            }
          } catch (error) {
            console.log(error);
            logError(error);
            throw error;
          }
        } else {
        }
      }
    }
  });
  // 影音(电影、电视)
  app.get("/media", async function (req, res) {
    // return res.send({ data: [], code: 1 });
    const queryResult = await model.Media.findAll();
    res.send({
      data: queryResult,
      code: 1
    });
  });
  // 影音(电影、电视)
  app.get("/media/:id", async function (req, res) {
    const params = req.params;
    const media = await model.Media.findOne({ where: { id: params.id } });
    if (media.type === "movie") {
      const data = await model.Movie.findOne({
        where: { mediaId: params.id }
      });
      res.send({
        data,
        code: 1
      });
    } else {
    }
  });
  app.listen(19898);
}
