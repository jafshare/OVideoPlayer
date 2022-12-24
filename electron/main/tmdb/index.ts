import { MovieDb } from "moviedb-promise";
import { getSetting } from "../store";
const setting = getSetting();
export const moviedb = new MovieDb(setting?.tmdbKey);
