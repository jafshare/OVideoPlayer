import createStore from "./base";
const SETTING = "setting";
// 设置
const settingStore = createStore({ name: SETTING });
// 获取设置
export function getSetting() {
  return settingStore.get(SETTING, {}) as Setting;
}
// 保存设置
export function savePlaylist(data: Setting) {
  return settingStore.set(SETTING, data);
}
