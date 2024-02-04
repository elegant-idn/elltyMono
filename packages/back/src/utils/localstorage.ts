import * as fs from 'fs';
import * as path from 'path';
import { rm } from 'fs/promises';

import { generateFileName } from './helper';

export async function isExists(path: string): Promise<boolean | string> {
  return new Promise((resolve, reject) => {
    fs.stat(path, function (err, stat) {
      if (err == null) {
        resolve(true);
      } else if (err.code === 'ENOENT') {
        resolve(false);
      } else {
        resolve(err.code);
      }
    });
  });
}

export async function readStream(src: string) {
  if ((await isExists(src)) !== true) {
    return;
  }

  return fs.createReadStream(src);
}

export async function remove(path: string) {
  return await rm(path).catch((e) => console.warn(e.message));
}
