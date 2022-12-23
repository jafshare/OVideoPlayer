import path from "path";
import log from "electron-log";
import { app } from "electron";
// 设置路径
log.transports.file.resolvePath = () =>
  path.join(
    process.env.VITE_DEV_SERVER_URL
      ? `${process.cwd()}/AppData`
      : app.getPath("userData"),
    `logs/${new Date().toLocaleDateString()}.log`
  );
export const logger = log;
export const logError = (error) => {
  // 处理 sequelize的报错
  if (error?.message) {
    logger.error(error.message ?? error.toString());
  } else {
    logger.error(error);
  }
};
