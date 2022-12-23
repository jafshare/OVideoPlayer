import { DataTypes, Model } from "sequelize";
import { sequelize } from "../db";
import { Media } from "./media";
export class Series extends Model {
  declare id: number;
  declare mediaId?: number;
}
Series.init(
  {
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: "剧集名称"
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
  { sequelize, modelName: "series" }
);
// series创建外键(一对多)
Media.hasMany(Series, {
  foreignKey: {
    name: "mediaId"
  }
});
// 外键Media 一对一
Series.belongsTo(Media, {
  foreignKey: {
    name: "mediaId"
  }
});
Series.sync();
// 如果不存在则新建,且会同步column
// Series.sync({ alter: true });
