import axios from "axios";
import type { API } from "./typings";
const baseURL = "http://127.0.0.1:19898";

const service = axios.create({
  baseURL
});
service.interceptors.response.use((response) => {
  const data = response.data;
  if (data.code !== 1) {
    // TODO 统一报错
    return Promise.reject(new Error("系统异常"));
  }
  return data.data;
});
export async function getDir(path: string) {
  return service.post("/getDirectoryContents", { path });
}
export async function getFileStreamURL(path: string) {
  return `${baseURL}/stream?path=${path}`;
}
export async function scan() {
  return service.get("/scan");
}
export async function getMedia(): Promise<API.Media[]> {
  return service.get("/media");
}
export async function getMediaDetail(id: string): Promise<API.MediaDetail> {
  return service.get(`/media/${id}`);
}
