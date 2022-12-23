import { DataTypes, Model } from "sequelize";
import { sequelize } from "../db";
import { Media } from "./media";
export class Movie extends Model {
  declare id: number;
  declare mediaId?: number;
}
Movie.init(
  {
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: "电影名称"
    },
    url: {
      type: DataTypes.STRING(1000),
      allowNull: false,
      comment: "播放路径"
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
    },
    subtitles: {
      type: DataTypes.STRING(500),
      comment: "字幕"
    },
    duration: {
      type: DataTypes.STRING(20),
      comment: "总时长"
    }
  },
  { sequelize, modelName: "movie" }
);
// movie创建外键(一对一)
Media.hasOne(Movie, {
  foreignKey: {
    name: "mediaId"
  }
});
// 外键media 一对一
Movie.belongsTo(Media, {
  foreignKey: {
    name: "mediaId"
  }
});
Movie.sync();
// 如果不存在则新建,且会同步column
// Movie.sync({ alter: true });
