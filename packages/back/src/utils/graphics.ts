import * as sharp from 'sharp';
import { parse } from 'path';
import * as s3 from '../vendor/s3';
import { pipeAsync } from './helper';
import { readStream } from './localstorage';

export async function getMetaS3(key: string, folder?: string) {
  const data = await s3.pull({ key });

  const { width, height } = await sharp(data as any).metadata();

  return { width, height };
}

export async function getMetaLocal(path: string) {
  return sharp(path).metadata();
}

export async function resizeStream(
  width: number,
  format: 'auto' | 'png' | 'jpg' = 'auto',
) {
  const options = { fit: sharp.fit.contain, width };

  const handler = sharp().resize(options);

  switch (format) {
    case 'png':
      return await handler.png({ pngquant: true } as any);
    case 'jpg':
      return await handler.jpeg({ mozjpeg: true });
    default:
      return await handler;
  }
}

export async function uploadPreviewSet(
  path: string,
  { folder, baseName },
  format: 'auto' | 'png' | 'jpg' = 'auto',
) {
  const previewScaleList = [1, 0.7, 0.4];
  const previewNameList = ['full', 'middle', 'mini'];

  const { width, format: srcFormat } = await getMetaLocal(path);

  const keyNoExt = parse(baseName).name;

  const outputExt =
    format !== 'auto' ? format : srcFormat === 'svg' ? 'png' : srcFormat;

  const [full, middle, mini] = await Promise.all(
    previewScaleList.map(async (scale, idx) => {
      const source = await readStream(path);

      if (!source) {
        throw new Error('no file found!');
      }

      const resize = await resizeStream(Math.floor(width * scale), format);

      const { upload, dest } = s3.pushStream({
        folder,
        key: `${keyNoExt}-${previewNameList[idx]}.${outputExt}`,
      });

      const [uploaded] = await Promise.all([
        upload,
        pipeAsync(source, resize, dest),
      ]);

      return uploaded;
    }),
  );

  return { full, middle, mini };
}

export async function uploadResize({ key, width, folder }, keyName?: string) {
  const newKey = keyName
    ? `${key.split('.')[0]}-${keyName}.${key.split('.')[1]}`
    : key;
  const readStream = s3.pullStream({ folder, key });

  const resize = await resizeStream(width);

  const { dest, upload } = s3.pushStream({
    folder,
    key: newKey,
  });

  const [result] = await Promise.all([
    upload,
    pipeAsync(readStream, resize, dest),
  ]);

  return result;
}
