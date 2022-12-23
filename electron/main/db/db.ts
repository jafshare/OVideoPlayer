import { Sequelize } from "sequelize";
import { logger } from "../log";
// 连接服务器
export const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./database.db",
  logging: (sql) => logger.info(sql),
  define: {
    // 禁用复数形式
    freezeTableName: true
  }
});
export const init = () => {
  console.log("init");
};
