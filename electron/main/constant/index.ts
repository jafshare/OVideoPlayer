import { app } from "electron";

export const dataDir = process.env.VITE_DEV_SERVER_URL
  ? `${process.cwd()}/AppData`
  : app.getPath("userData");
