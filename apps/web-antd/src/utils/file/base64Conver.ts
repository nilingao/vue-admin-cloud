/**
 * @description: base64 to blob
 */
declare type Nullable<T> = null | T;
export function dataURLtoBlob(base64Buf: string): Blob {
  const arr = base64Buf.split(',');
  if (arr.length < 2 || !arr[0] || !arr[1]) {
    throw new Error(
      'Invalid base64 data URL format: missing comma separator or invalid data',
    );
  }
  const typeItem = arr[0];
  const mimeMatch = typeItem.match(/:(.*?);/);
  if (!mimeMatch || mimeMatch.length < 2) {
    throw new Error('Invalid base64 data URL format: cannot extract MIME type');
  }
  const mime = mimeMatch[1];
  const bstr = window.atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    // charCodeAt is correct for base64 decoding (getting 8-bit byte values)
    // eslint-disable-next-line unicorn/prefer-code-point
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

/**
 * img url to base64
 * @param url
 */
export function urlToBase64(url: string, mineType?: string): Promise<string> {
  return new Promise((resolve, reject) => {
    let canvas = document.createElement(
      'CANVAS',
    ) as Nullable<HTMLCanvasElement>;
    const ctx = canvas?.getContext('2d');

    const img = new Image();
    img.crossOrigin = '';
    img.addEventListener('load', () => {
      if (!canvas || !ctx) {
        return reject(new Error('Failed to create canvas context'));
      }
      canvas.height = img.height;
      canvas.width = img.width;
      ctx.drawImage(img, 0, 0);
      const dataURL = canvas.toDataURL(mineType || 'image/png');
      canvas = null;
      resolve(dataURL);
    });
    img.src = url;
  });
}
