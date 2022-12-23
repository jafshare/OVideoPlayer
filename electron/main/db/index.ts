import * as file from "./model/file";
import * as movie from "./model/movie";
import * as series from "./model/series";
import * as media from "./model/media";
export * from "./db";
export const model = {
  ...file,
  ...series,
  ...movie,
  ...media
};
