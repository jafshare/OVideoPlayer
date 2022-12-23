import type { BrowserWindow } from "electron";
import { globalShortcut } from "electron";
export function registerShortcut(ctx: { win: BrowserWindow | null }) {
  globalShortcut.register("ctrl+f12", () => {
    const isOpened = ctx.win?.webContents.isDevToolsOpened();
    if (isOpened) {
      ctx.win?.webContents?.closeDevTools();
      // session.defaultSession.removeExtension(whichDevtools("VUE"));
    } else {
      ctx.win?.webContents?.openDevTools({ mode: "right" });
    }
  });
}
