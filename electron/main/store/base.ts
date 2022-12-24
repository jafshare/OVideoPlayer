import type { Options } from "electron-store";
import Store from "electron-store";
import { dataDir } from "../constant";

const createStore = <T extends Record<string, unknown>>(
  options?: Options<T>
) => {
  // 如果是开发或者测试，则默认以当前启动路径为基目录
  const store = new Store({
    cwd: dataDir,
    ...options
  });
  return store;
};
export default createStore;
