import { DataTypes, Model } from "sequelize";
import { sequelize } from "../db";
export class Media extends Model {
  declare id: number;
  declare type: "movie" | "series";
}
Media.init(
  {
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: "资源名称"
    },
    type: {
      type: DataTypes.ENUM("movie", "series")
    },
    etag: {
      type: DataTypes.STRING(64),
      allowNull: false,
      comment: "资源的唯一标识，如果是剧集，则第一集作为etag",
      unique: true
    },
    description: {
      type: DataTypes.STRING(500),
      comment: "资源描述"
    },
    poster: {
      type: DataTypes.STRING(500),
      comment: "资源封面"
    },
    isCheck: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: "是否校验完成"
    }
  },
  { sequelize, modelName: "media" }
);
Media.sync();
// 如果不存在则新建,且会同步column
// Media.sync({ alter: true });
