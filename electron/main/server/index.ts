import express from "express";
import { getDir, getFileStat, getFileStream } from "../webdav";
export function startServer() {
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
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
  app.listen(19898);
}
