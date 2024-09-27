// Electron 主进程 与 渲染进程 交互的桥梁
import { contextBridge, ipcRenderer } from "electron";

// 在window对象下导出只读对象
contextBridge.exposeInMainWorld("LoginAtTerminal", {
  // 框架中 IPC 通信标识格式为 "组织名.项目名.方法名"
  // 格式不重要，只需要确保标识唯一即可，定义成什么都行
  logInfo: (content: { level: string; title: string; message: string }) =>
    ipcRenderer.invoke("LiteLoader.LoginAtTerminal.logInfo", content),
  pushQRCode: (content: string) =>
    ipcRenderer.invoke("LiteLoader.LoginAtTerminal.pushQRCode", content),
  stopPushQRCode: (callback) =>
    ipcRenderer.on("LiteLoader.LoginAtTerminal.stopPushQRCode", callback),
  getLoginState: () =>
    ipcRenderer.invoke("LiteLoader.LoginAtTerminal.getLoginState"),
});
