import type { CreateReadStreamOptions } from "webdav";
import { createClient } from "webdav";
const extName = require("ext-name");
/**
 * 休眠时间
 * @param ms 毫秒
 * @returns
 */
const sleep = async (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
const client = createClient("http://192.168.1.222:12345/dav", {
  username: "admin",
  password: "admin"
});
export async function getDir(
  path: string,
  options?: Record<string, any>
): Promise<any[]> {
  const res = await client.getDirectoryContents(path, {
    details: true,
    ...options
  });
  return ((res as any)?.data || []).map((item) => {
    // 如果没有提供mine，则需要根据文件名生成一个
    if (item.type === "file") {
      item.mime = item.mime || extName(item.basename)?.[0]?.mime;
    }
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
export async function scan(path: string) {
  const contents = await getDir(path, { deep: true });
  return contents.filter((item) => item.type === "file");
}
