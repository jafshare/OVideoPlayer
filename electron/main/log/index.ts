import path from "path";
import log from "electron-log";
import { dataDir } from "../constant";
// 设置路径
log.transports.file.resolvePath = () =>
  path.join(dataDir, `logs/${new Date().toLocaleDateString()}.log`);
export const logger = log;
export const logError = (error) => {
  // 处理 sequelize的报错
  if (error?.message) {
    logger.error(error.message ?? error.toString());
  } else {
    logger.error(error);
  }
};
