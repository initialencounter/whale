// 运行在 Electron 主进程 下的插件入口
import { ipcMain } from "electron";
import fs from "fs";
// Fork from https://github.com/cnuebred/qrcode.ts
import { QRcode } from "./qrcode.ts/src/qr_code";
import { decodeQR } from "./decodeQR";
import { resolve } from "path";
import os from "os";

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

logMessage("info", "LoginAtTerminal", "Running...");

ipcMain.handle("LiteLoader.LoginAtTerminal.logInfo", (_, data) => {
  logMessage(data.level, data.title, data.message);
});

ipcMain.handle("LiteLoader.LoginAtTerminal.pushQRCode", async (_, data) => {
  const res = await decodeQR(data);
  new QRcode(res, { minErrorLevel: "L" }).render();
  const buf = Buffer.from(data.slice(22), "base64");
  const QRCodeStorePath = resolve(os.homedir(), "qqLoginQRCode.png");
  fs.writeFileSync(QRCodeStorePath, buf);
  logMessage(
    "success",
    "LoginAtTerminal",
    "登录二维码已保存到 " + QRCodeStorePath,
  );
});
