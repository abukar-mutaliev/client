import { createImage } from "./utils";

export default async function getCroppedImg(imageSrc, crop, width, height) {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("No 2d context");
  }

  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;

  canvas.width = width;
  canvas.height = height;

  const newWidth = crop.width * scaleX;
  const newHeight = newWidth * (height / width);

  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    newWidth,
    newHeight,
    0,
    0,
    width,
    height
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob((file) => {
      if (file) {
        resolve(file);
      } else {
        reject(new Error("Canvas is empty"));
      }
    }, "image/jpeg");
  });
}
