// 長辺を1024pxに収める。元が1024以下ならそのまま。
// JPEG品質0.85で圧縮。
// 戻り値はdataURLのbase64部分のみ（プレフィックス除去）。
export async function resizeImageToBase64(blob: Blob | File): Promise<string> {
  // ブラウザでのみ動作
  const bitmap = await createImageBitmap(blob);
  const { width, height } = bitmap;

  // スケール計算
  const maxDim = Math.max(width, height);
  const scale = maxDim > 1024 ? 1024 / maxDim : 1;
  const newWidth = Math.floor(width * scale);
  const newHeight = Math.floor(height * scale);

  // Canvas に描画
  const canvas = new OffscreenCanvas(newWidth, newHeight);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas context unavailable");
  ctx.drawImage(bitmap, 0, 0, newWidth, newHeight);

  // JPEG で圧縮
  const compressedBlob = await canvas.convertToBlob({
    type: "image/jpeg",
    quality: 0.85,
  });

  // Base64 化
  const arrayBuffer = await compressedBlob.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);
  const binaryString = Array.from(bytes)
    .map((byte) => String.fromCharCode(byte))
    .join("");
  const base64 = btoa(binaryString);

  // プレフィックス除去
  return base64;
}
