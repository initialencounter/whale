// 运行在 Electron 渲染进程 下的页面脚本
declare global {
    interface Window {
      LoginAtTerminal: {
        logInfo: (content: {
          level: string;
          title: string;
          message: string;
        }) => Promise<void>;
        pushQRCode: (content: string) => Promise<void>;
        stopPushQRCode: (callback) => Promise<void>;
        getLoginState: () => Promise<boolean>;
      };
    }
  }

export function getQRcode() {
  if (location.pathname !== "/renderer/login.html") {
    return "";
  }
  const qrcodeErrorExpiredLabel = document.querySelector(
    ".qrcode-error.expired-label",
  ) as HTMLElement;
  if (qrcodeErrorExpiredLabel?.innerText === "当前二维码已过期") {
    const secondaryQbutton = document.querySelector(
      ".q-button.q-button--secondary.q-button--default",
    ) as HTMLButtonElement;
    if (secondaryQbutton) secondaryQbutton.click();
  }
  const qrCodeImg = document.querySelector(
    ".qr-code-img > img",
  ) as HTMLImageElement;
  if (qrCodeImg) return qrCodeImg?.src;
  return "";
}

let lastQRCode: string;
const LoginInterval = setInterval(async () => {
  const isLogin = await window.LoginAtTerminal.getLoginState();
  if (isLogin) {
    clearInterval(LoginInterval);
  }
  await window.LoginAtTerminal.logInfo({
    level: "info",
    title: "LoginAtTerminal",
    message: "登录二维码推送中...",
  });
  const url = getQRcode();
  if (!url) return;
  if (url === lastQRCode) return;
  lastQRCode = url;
  window.LoginAtTerminal.pushQRCode(url);
}, 5000);

window.LoginAtTerminal.stopPushQRCode(async () => {
  await window.LoginAtTerminal.logInfo({
    level: "success",
    title: "SUCCESS",
    message: "登录成功！",
  });
});
