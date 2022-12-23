const baseURL = "http://127.0.0.1:19898";

const request = async (
  input: RequestInfo | URL,
  init?: RequestInit | undefined
) => {
  const defaultInit = {
    headers: { "content-type": "application/json" }
  };
  return fetch(baseURL + input, { ...defaultInit, ...init });
};
export async function getDir(path: string) {
  const res = await request("/getDirectoryContents", {
    method: "POST",
    body: JSON.stringify({ path })
  });
  return res.json();
}
export async function getFileStreamURL(path: string) {
  return `${baseURL}/stream?path=${path}`;
}
export async function scan() {
  const res = await request("/scan", { method: "GET" });
  return res.json();
}
export async function getMedia() {
  const res = await request("/media", { method: "GET" });
  return res.json();
}
export async function getMediaDetail(id: string) {
  const res = await request(`/media/${id}`, { method: "GET" });
  return res.json();
}
