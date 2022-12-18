import type { CreateReadStreamOptions } from "webdav";
import { createClient } from "webdav";
const client = createClient("http://192.168.1.222:12345/dav", {
  username: "admin",
  password: "admin"
});
export async function getDir(path: string) {
  const res = await client.getDirectoryContents(path);
  return res;
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
