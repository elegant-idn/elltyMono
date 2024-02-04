import { HttpException, HttpStatus } from '@nestjs/common';
import * as path from 'path';

import { readStream, isExists } from '../../../utils/localstorage';
import * as graphics from '../../../utils/graphics';
import { errHandler, pipeAsync, generateFileName } from '../../../utils/helper';
import * as s3 from '../../../vendor/s3';

async function comboUpload(filePath: string, origName: string) {
  try {
    if ((await isExists(filePath)) !== true) {
      throw new HttpException(
        'element file does not exist',
        HttpStatus.NOT_FOUND,
      );
    }

    const { width, format } = await graphics
      .getMetaLocal(filePath)
      .catch(errHandler('metadata extract issue'));

    if (format !== 'svg' && format !== 'png') {
      throw new HttpException(
        `file must be svg or png`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const source = await readStream(filePath);

    const elementName = generateFileName(origName);

    const elementUploader = s3.pushStream({
      key: elementName,
      folder: 'data',
      mimeType: format === 'svg' ? 'image/svg+xml' : `image/${format}`,
    });

    const [uploadResult] = await Promise.all([
      elementUploader.upload,
      pipeAsync(source, elementUploader.dest),
    ]).catch(errHandler('element not uploaded', HttpStatus.BAD_REQUEST));

    const { full, middle, mini } = await graphics
      .uploadPreviewSet(
        filePath,
        {
          folder: 'template_images',
          baseName: elementName,
        },
        'png',
      )
      .catch(errHandler('preview set not uploaded', HttpStatus.BAD_REQUEST));

    const previewLocations = [full, middle, mini].map(
      (image) => image.Location,
    );

    return {
      element: uploadResult,
      preview: previewLocations,
    };
  } catch (e) {
    if (e instanceof HttpException) {
      throw e;
    } else {
      console.error(e);

      throw new HttpException(
        'something gone wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

export default comboUpload;
