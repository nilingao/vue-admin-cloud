import { dataURLtoBlob, urlToBase64 } from './base64Conver';

declare type TargetContext = '_blank' | '_self';
export function openWindow(
  url: string,
  opt?: {
    noopener?: boolean;
    noreferrer?: boolean;
    target?: string | TargetContext;
  },
) {
  const { target = '__blank', noopener = true, noreferrer = true } = opt || {};
  const feature: string[] = [];

  noopener && feature.push('noopener=yes');
  noreferrer && feature.push('noreferrer=yes');

  window.open(url, target, feature.join(','));
}
/**
 * Download online pictures
 * @param url
 * @param filename
 * @param mime
 * @param bom
 */
export function downloadByOnlineUrl(
  url: string,
  filename: string,
  mime?: string,
  bom?: BlobPart,
) {
  urlToBase64(url).then((base64) => {
    downloadByBase64(base64, filename, mime, bom);
  });
}

/**
 * Download pictures based on base64
 * @param buf
 * @param filename
 * @param mime
 * @param bom
 */
export function downloadByBase64(
  buf: string,
  filename: string,
  mime?: string,
  bom?: BlobPart,
) {
  const base64Buf = dataURLtoBlob(buf);
  downloadByData(base64Buf, filename, mime, bom);
}

/**
 * Download according to the background interface file stream
 * @param {*} data
 * @param {*} filename
 * @param {*} mime
 * @param {*} bom
 */
export function downloadByData(
  data: BlobPart,
  filename: string,
  mime?: string,
  bom?: BlobPart,
) {
  const blobData = bom === undefined ? [data] : [bom, data];
  const blob = new Blob(blobData, { type: mime || 'application/octet-stream' });

  const blobURL = window.URL.createObjectURL(blob);
  const tempLink = document.createElement('a');
  tempLink.style.display = 'none';
  tempLink.href = blobURL;
  if (filename) {
    tempLink.setAttribute('download', filename);
  }
  if (tempLink.download === undefined) {
    tempLink.setAttribute('target', '_blank');
  }
  document.body.append(tempLink);
  tempLink.click();
  tempLink.remove();
  window.URL.revokeObjectURL(blobURL);
}

/**
 * Download file according to file address
 * @param {*} sUrl
 */
export function downloadByUrl({
  url,
  target = '_blank',
  fileName,
}: {
  fileName?: string;
  target?: TargetContext;
  url: string;
}): boolean {
  const isChrome = window.navigator.userAgent.toLowerCase().includes('chrome');
  const isSafari = window.navigator.userAgent.toLowerCase().includes('safari');

  if (/iP/.test(window.navigator.userAgent)) {
    console.error('Your browser does not support download!');
    return false;
  }
  if (isChrome || isSafari) {
    const link = document.createElement('a');
    link.href = url;
    link.target = target;

    if (link.download !== undefined) {
      link.download = fileName || url.slice(url.lastIndexOf('/') + 1);
    }

    if (document.createEvent) {
      const e = document.createEvent('MouseEvents');
      e.initEvent('click', true, true);
      link.dispatchEvent(e);
      return true;
    }
  }
  if (!url.includes('?')) {
    url += '?download';
  }

  openWindow(url, { target });
  return true;
}

export const dataURLtoFile = (base64: string, filename: string) => {
  const arr = base64.split(',');

  // 安全检查：确保数组有足够的元素
  if (arr.length < 2) {
    throw new Error('Invalid base64 data URL format');
  }

  // 安全检查：确保第一个元素存在并且能匹配到 MIME 类型
  const firstElement = arr[0];
  if (!firstElement) {
    throw new Error('Invalid base64 data URL format - missing MIME type');
  }

  const mimeMatch = firstElement.match(/:(.*?);/);
  if (!mimeMatch) {
    throw new Error('Could not extract MIME type from base64 data URL');
  }

  const secondElement = arr[1];
  if (!secondElement) {
    throw new Error('Invalid base64 data URL format - missing data');
  }

  const mime = mimeMatch[1];
  const bstr = atob(secondElement);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.codePointAt(n) || 0;
  }
  return new File([u8arr], filename, {
    type: mime,
  });
};

export const findFileName = (res: { headers: { [key: string]: string } }) => {
  const dis = res.headers['content-disposition'];
  if (!dis) {
    throw new Error('Content-Disposition header not found');
  }

  const regEx = /^attachment; filename="(.*?)";/;
  const match = dis.match(regEx);
  if (!match || !match[1]) {
    throw new Error(
      'Could not extract filename from Content-Disposition header',
    );
  }

  return decodeURIComponent(match[1]);
};
