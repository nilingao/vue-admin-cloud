import { requestClient } from '#/api/request';

interface UploadFileParams {
  file: File;
  type?: number; // 图片类型 1.用户图像路径 2.模板任务视频路径 3.课程任务视频路径 4.富文本图片 5.HTML富文本地址 6.导出文件
  url?: string; // 上传接口地址
  onError?: (error: Error) => void;
  onProgress?: (progress: { percent: number }) => void;
  onSuccess?: (data: any, file: File) => void;
}
export async function upload_file({
  type = 1,
  url = '/webapi/common/up_load/upload',
  file,
  onError,
  onProgress,
  onSuccess,
}: UploadFileParams) {
  try {
    onProgress?.({ percent: 0 });

    const data = await requestClient.upload(url, {
      type,
      name: 'file',
      file,
    });
    onProgress?.({ percent: 100 });

    onSuccess?.(data, file);
  } catch (error) {
    onError?.(error instanceof Error ? error : new Error(String(error)));
  }
}
