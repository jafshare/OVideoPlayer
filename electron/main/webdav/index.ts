import type { CreateReadStreamOptions } from "webdav";
import { createClient } from "webdav";
const extName = require("ext-name");
const client = createClient("http://192.168.1.222:12345/dav", {
  username: "admin",
  password: "admin"
});
export async function getDir(path: string) {
  const res = await client.getDirectoryContents(path, { details: true });
  return ((res as any)?.data || []).map((item) => {
    // 如果没有提供mine，则需要根据文件名生成一个
    item.mime = item.mime || extName(item.basename)?.[0]?.mime;
    return item;
  });
}
export async function getFile(path: string) {
  const res = await client.getFileContents(path, { format: "binary" });
  return res;
}
export async function getFileStream(
  path: string,
  options?: CreateReadStreamOptions
) {
  const stream = client.createReadStream(path, options);
  return stream;
}
export async function getFileStat(path: string) {
  return client.stat(path);
}
