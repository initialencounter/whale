// 运行在 Electron 主进程 下的插件入口
import { BrowserWindow, ipcMain, webContents } from "electron";
import fs from "fs";
// Fork from https://github.com/cnuebred/qrcode.ts
import { QRcode } from "./qrcode.ts/src/qr_code";
import { decodeQR } from "./decodeQR";
const logStyles = {
  info: "\x1b[34m", // 蓝色
  warning: "\x1b[33m", // 黄色
  error: "\x1b[31m", // 红色
  success: "\x1b[32m", // 绿色
  reset: "\x1b[0m", // 重置颜色
};

function getCurrentTime() {
  const now = new Date();
  return now.toISOString().replace("T", " ").substring(0, 19);
}

function logMessage(
  level: keyof typeof logStyles,
  title: string,
  message: string,
) {
  const style = logStyles[level] || logStyles.reset;
  const timestamp = getCurrentTime();
  console.log(`${style}[${timestamp}] [${title}] ${message}${logStyles.reset}`);
}

let mainWindow: BrowserWindow;
let isLogin = false;

logMessage("info", "LoginAtTerminal", "Running...");

ipcMain.handle("LiteLoader.LoginAtTerminal.getLoginState", () => {
  return isLogin;
});

ipcMain.handle("LiteLoader.LoginAtTerminal.logInfo", (_, data) => {
  logMessage(data.level, data.title, data.message);
});

ipcMain.handle("LiteLoader.LoginAtTerminal.pushQRCode", async (_, data) => {
  const res = await decodeQR(data);
  new QRcode(res, { minErrorLevel: "L" }).render();
  const buf = Buffer.from(data.slice(22), "base64");
  fs.writeFileSync("/LiteLoader/plugins/qrcode.png", buf);
  logMessage(
    "success",
    "LoginAtTerminal",
    "登录二维码已保存到 /LiteLoader/plugins/qrcode.png",
  );
});

// 创建窗口时触发
exports.onBrowserWindowCreated = (window: BrowserWindow) => {
  // window 为 Electron 的 BrowserWindow 实例
  mainWindow = window;
  mainWindow.webContents.send(
    "LiteLoader.LoginAtTerminal.stopPushQRCode",
    "结束 LoginInterval11111111111111",
  );
};

// 用户登录时触发
exports.onLogin = (uid: string) => {
  // uid 为 账号 的 字符串 标识
  logMessage("success", "LoginAtTerminal", "Login UID: " + uid);
  // 停止推送二维码
  isLogin = true;
  webContents.getAllWebContents().forEach((webContent) => {
    webContent.send("LiteLoader.LoginAtTerminal.stopPushQRCode");
  });
};
