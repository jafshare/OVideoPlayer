import express from "express";
import { getDir, getFileStat, getFileStream, scan } from "../webdav";
import { init, model } from "../db";
import { logError } from "../log";
const getMediaInfo = async (media: any) => {
  return {
    title: media.basename,
    type: "movie",
    etag: media.etag,
    description: "",
    poster: "",
    isCheck: true
  };
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
    // TODO
    const data = require(`${process.cwd()}/data.json`).slice(0, 10);
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
        console.log("info:", info);
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
            await file.update({ movieId: movie.id });
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
