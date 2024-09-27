// Fork from https://github.com/xh321/LiteLoaderQQNT-QR-Decode/blob/master/src/decodeQR.js

export async function decodeQR(image: string) {
  // 调用草料二维码API
  return await fetch("https://qrdetector-api.cli.im/v1/detect_binary", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36 Edg/115.0.1901.183",
    },
    body: `image_data=${image}&remove_background=0`,
  })
    .then((res) => res.json())
    .then((json) => {
      if (json.status == 1) {
        return json.data.qrcode_content;
      } else {
        throw Error(json.message);
      }
    });
}
