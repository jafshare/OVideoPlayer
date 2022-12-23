import { DataTypes, Model } from "sequelize";
import { sequelize } from "../db";
import { Movie } from "./movie";
import { Series } from "./series";
export class File extends Model {}
File.init(
  {
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: "文件名称"
    },
    url: {
      type: DataTypes.STRING(1000),
      allowNull: false,
      comment: "文件路径"
    },
    mime: {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: "文件类型"
    },
    etag: {
      type: DataTypes.STRING(64),
      allowNull: false,
      comment: "文件的唯一标识",
      unique: true
    },
    size: {
      type: DataTypes.NUMBER,
      allowNull: false,
      comment: "文件大小"
    }
  },
  { sequelize, modelName: "file" }
);
// 外键File，一对一
Movie.hasOne(File);
// 外键movie 一对一
File.belongsTo(Movie, { foreignKey: { allowNull: true } });
// 外键File，一对一
Series.hasOne(File);
// 外键series 一对一
File.belongsTo(Series, { foreignKey: { allowNull: true } });
File.sync();
// 如果不存在则新建,且会同步column
// File.sync({ alter: true });
