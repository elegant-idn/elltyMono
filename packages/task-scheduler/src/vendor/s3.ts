import { Injectable, Module } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import * as stream from 'stream';
import { configuration } from '../config/configuration';

//
// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html
@Injectable()
export class S3Service {
  s3: S3;
  defaultBucket: string;
  defaultRegion: string;

  constructor() {
    this.s3 = new S3({
      accessKeyId: configuration().s3.access_key,
      secretAccessKey: configuration().s3.secret_key,
    });

    this.defaultBucket = configuration().s3.bucket;
    this.defaultRegion = 'us-east-1';
  }

  makePublicUrl(
    key: string,
    bucket = this.defaultBucket,
    region = this.defaultRegion,
  ) {
    return `https://${bucket}.s3${region !== this.defaultRegion ? `.${region}` : ''
      }.amazonaws.com/${key}`;
  }

  makeKey(key: string, folder: string) {
    return folder ? [folder, key].join('/').replace(/\/{2;}/g, '/') : key;
  }

  async pull(src: { bucket?: string; key: string; folder?: string }) {
    const { bucket: Bucket = this.defaultBucket, key, folder } = src;
    const Key = this.makeKey(key, folder);

    const readHandler = this.s3.getObject({ Bucket, Key });

    const { Body } = await readHandler.promise();

    return Body;
  }

  async head(src: { bucket?: string; key: string; folder?: string }) {
    const { bucket: Bucket = this.defaultBucket, key, folder } = src;
    const Key = this.makeKey(key, folder);

    const readHandler = this.s3.headObject({ Bucket, Key });

    return await readHandler.promise();
  }

  //
  // non top-level scan
  async list(src: { bucket?: string; folder: string; foldersOnly?: boolean }) {
    const { bucket = this.defaultBucket, folder, foldersOnly } = src;
    const Prefix = folder.endsWith('/') ? folder : folder + '/';

    const objects = await this.s3
      .listObjects({
        Bucket: bucket,
        Prefix,
        Delimiter: '/',
      })
      .promise();

    const folders = objects.CommonPrefixes.map((obj) =>
      obj.Prefix.replace(Prefix, ''),
    );

    return foldersOnly
      ? folders
      : [
        ...folders,
        ...objects.Contents.map((obj) => obj.Key.replace(Prefix, '')),
      ];
  }

  async mkDir(src: { bucket?: string; folder: string; baseFolder?: string }) {
    const { bucket = this.defaultBucket, folder, baseFolder } = src;

    return await this.push('', {
      bucket: bucket,
      folder: baseFolder,
      key: folder.endsWith('/') ? folder : folder + '/',
    });
  }

  pullStream(src: { bucket?: string; key: string; folder?: string }) {
    const { bucket: Bucket = this.defaultBucket, key, folder } = src;
    const Key = this.makeKey(key, folder);

    const readHandler = this.s3.getObject({ Bucket, Key });

    const stream = readHandler.createReadStream();

    return stream;
  }

  async push(
    Body: any,
    dest: { bucket?: string; key: string; folder?: string; mimeType?: string },
  ) {
    const { bucket = this.defaultBucket, key, mimeType, folder } = dest;
    const Key = this.makeKey(key, folder);

    const res = await this.s3
      .upload({
        Bucket: bucket,
        Body,
        Key,
        ...(mimeType ? { ContentType: mimeType } : {}),
      })
      .promise();

    return res;
  }

  pushStream(dest: {
    bucket?: string;
    key: string;
    folder?: string;
    mimeType?: string;
  }) {
    const pass = new stream.PassThrough();

    return {
      dest: pass,
      upload: this.push(pass, dest),
    };
  }

  async dropInChunks(src: {
    bucket?: string;
    keys: string[];
    chunkSize?: number;
  }) {
    const { bucket = this.defaultBucket, keys, chunkSize = 1000 } = src;

    for (let i = 0; i < keys.length; i += chunkSize) {
      const chunk = keys.slice(i, i + chunkSize);

      await this.dropMany({ bucket, keys: chunk });
    }
  }

  async getFolderKeys(src: { bucket?: string; Prefix: string }) {
    const { bucket = this.defaultBucket, Prefix } = src;

    let someMoreItems: boolean = false;
    let folderKeys: string[] = [];
    console.log(bucket, 'bucket to list form');
    do {
      const objects = await this.s3
        .listObjects({
          Bucket: bucket,
          Prefix,
        })
        .promise();

      folderKeys = [...folderKeys, ...objects.Contents.map((obj) => obj.Key)];

      someMoreItems = objects.IsTruncated;
    } while (someMoreItems === true);

    return folderKeys;
  }

  createFolderPrefix(folder: string) {
    return folder.endsWith('/') ? folder : folder + '/';
  }

  sortKeys(keys: string[]) {
    return keys.sort(
      (a, b) =>
        b.replace(/\/$/, '').split('/').length -
        a.replace(/\/$/, '').split('/').length,
    );
  }

  async dropRecursive(src: { bucket?: string; folder: string }) {
    const { bucket = this.defaultBucket, folder } = src;
    const Prefix = this.createFolderPrefix(folder);

    const keysToRemove: string[] = await this.getFolderKeys({ bucket, Prefix });

    const orderedList = this.sortKeys(keysToRemove);

    await this.dropInChunks({ bucket, keys: orderedList });
  }


  async dropManyRecursive(src: { bucket?: string; folders: string[] }) {
    const { bucket = this.defaultBucket, folders } = src;

    const keysToRemove: string[] = [];

    for (const folder of folders) {
      const Prefix = this.createFolderPrefix(folder);
      console.log('get keys');
      const folderKeys = await this.getFolderKeys({ bucket, Prefix });
      keysToRemove.push(...folderKeys);
    }

    const orderedList = this.sortKeys(keysToRemove);

    console.log('drop in chunks');
    await this.dropInChunks({ bucket, keys: orderedList });
  }

  async drop(src: { bucket?: string; key: string; folder?: string }) {
    const { bucket: Bucket = this.defaultBucket, key, folder } = src;
    const Key = this.makeKey(key, folder);

    await this.s3
      .deleteObject({
        Bucket,
        Key,
      })
      .promise();

    return true;
  }

  async dropMany(src: { bucket?: string; keys: string[]; folder?: string }) {
    const { bucket: Bucket = this.defaultBucket, keys, folder } = src;
    const Objects = keys.map((key) => ({ Key: this.makeKey(key, folder) }));

    await this.s3
      .deleteObjects({
        Bucket,
        Delete: { Objects },
      })
      .promise();

    return true;
  }

  async dropImages(src: { bucket?: string; keys: string[] }) {
    const { bucket: Bucket = this.defaultBucket, keys } = src;
    const Objects = keys.map((key) => ({ Key: key }));

    await this.s3
      .deleteObjects({
        Bucket,
        Delete: { Objects },
      })
      .promise();

    return true;
  }

  async copy(
    { fromFolder, fromKey, toFolder, bucket = this.defaultBucket },
    keyName?: string,
  ) {
    const key =
      keyName != null
        ? fromKey.split('.')[0] + '-' + keyName + '.' + fromKey.split('.')[1]
        : fromKey;

    const result = await this.s3
      .copyObject({
        Bucket: `${bucket}/${toFolder}`,
        CopySource: `${bucket}/${fromFolder}/${fromKey}`,
        Key: key,
      })
      .promise();

    return {
      ...result.CopyObjectResult,
      Location: this.makePublicUrl(this.makeKey(key, toFolder), bucket),
    };
  }

  async move(
    { fromFolder, fromKey, toFolder, bucket = this.defaultBucket },
    keyName?: string,
  ) {
    const result = await this.copy(
      { fromFolder, fromKey, toFolder, bucket },
      keyName,
    );

    await this.drop({ folder: fromFolder, key: fromKey, bucket });

    return result;
  }

  decodePublicUrl(url: string) {
    const { host, pathname } = new URL(url);

    const matched = host.match(
      /^([a-z0-9-\.]+)\.s3\.([a-z0-9-]+?\.)?amazonaws\.com/,
    );

    if (!matched) {
      return;
    }

    const [, bucket, regionRaw] = matched;

    const region = regionRaw && regionRaw.replace(/\.$/, '');

    if (region && region !== this.defaultRegion) {
      console.warn(
        `Url ${url} contains a region, file operation may fail depending on the client configuration`,
      );
    }

    return {
      bucket,
      key: pathname.replace(/^\/+/, ''),
    };
  }

  splitKey(key: string) {
    const path = key.split('/');

    const filename = path.pop();

    return {
      folder: path.join('/'),
      key: filename,
    };
  }
}

@Module({
  controllers: [],
  providers: [S3Service],
  exports: [S3Service],
})
export class S3Module { }
