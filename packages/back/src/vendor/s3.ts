import { S3 } from 'aws-sdk';
import * as stream from 'stream';
import { configuration } from '../config/configuration';

//
// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html

const s3 = new S3({
  accessKeyId: configuration().s3.access_key,
  secretAccessKey: configuration().s3.secret_key,
});

const defaultBucket = configuration().s3.bucket;
const defaultRegion = 'us-east-1';

const makePublicUrl = (
  key: string,
  bucket = defaultBucket,
  region = defaultRegion,
) => {
  return `https://${bucket}.s3${
    region !== defaultRegion ? `.${region}` : ''
  }.amazonaws.com/${key}`;
};

function makeKey(key: string, folder: string) {
  return folder ? [folder, key].join('/').replace(/\/{2;}/g, '/') : key;
}

export async function pull(src: {
  bucket?: string;
  key: string;
  folder?: string;
}) {
  const { bucket: Bucket = defaultBucket, key, folder } = src;
  const Key = makeKey(key, folder);

  const readHandler = s3.getObject({ Bucket, Key });

  const { Body } = await readHandler.promise();

  return Body;
}

export async function head(src: {
  bucket?: string;
  key: string;
  folder?: string;
}) {
  const { bucket: Bucket = defaultBucket, key, folder } = src;
  const Key = makeKey(key, folder);

  const readHandler = s3.headObject({ Bucket, Key });

  return await readHandler.promise();
}

//
// non top-level scan
export async function list(src: {
  bucket?: string;
  folder: string;
  foldersOnly?: boolean;
}) {
  const { bucket = defaultBucket, folder, foldersOnly } = src;
  const Prefix = folder.endsWith('/') ? folder : folder + '/';

  const objects = await s3
    .listObjects({
      Bucket: bucket,
      Prefix,
      Delimiter: '/',
    })
    .promise();

  console.log(objects);

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

export async function mkDir(src: {
  bucket?: string;
  folder: string;
  baseFolder?: string;
}) {
  const { bucket = defaultBucket, folder, baseFolder } = src;

  return await push('', {
    bucket: bucket,
    folder: baseFolder,
    key: folder.endsWith('/') ? folder : folder + '/',
  });
}

export function pullStream(src: {
  bucket?: string;
  key: string;
  folder?: string;
}) {
  const { bucket: Bucket = defaultBucket, key, folder } = src;
  const Key = makeKey(key, folder);

  const readHandler = s3.getObject({ Bucket, Key });

  const stream = readHandler.createReadStream();

  return stream;
}

export async function push(
  Body: any,
  dest: { bucket?: string; key: string; folder?: string; mimeType?: string },
) {
  const { bucket = defaultBucket, key, mimeType, folder } = dest;
  const Key = makeKey(key, folder);

  const res = await s3
    .upload({
      Bucket: bucket,
      Body,
      Key,
      ...(mimeType ? { ContentType: mimeType } : {}),
    })
    .promise();

  return res;
}

export function pushStream(dest: {
  bucket?: string;
  key: string;
  folder?: string;
  mimeType?: string;
}) {
  const pass = new stream.PassThrough();

  return {
    dest: pass,
    upload: push(pass, dest),
  };
}

const dropInChunks = async (src: {
  bucket?: string;
  keys: string[];
  chunkSize?: number;
}) => {
  const { bucket = defaultBucket, keys, chunkSize = 1000 } = src;

  for (let i = 0; i < keys.length; i += chunkSize) {
    const chunk = keys.slice(i, i + chunkSize);

    await dropMany({ bucket, keys: chunk });
  }
};

const getFolderKeys = async (src: { bucket?: string; Prefix: string }) => {
  const { bucket = defaultBucket, Prefix } = src;

  let someMoreItems: boolean = false;
  let folderKeys: string[] = [];

  do {
    const objects = await s3
      .listObjects({
        Bucket: bucket,
        Prefix,
      })
      .promise();

    folderKeys = [...folderKeys, ...objects.Contents.map((obj) => obj.Key)];

    someMoreItems = objects.IsTruncated;
  } while (someMoreItems === true);

  return folderKeys;
};

const createFolderPrefix = (folder: string) => {
  return folder.endsWith('/') ? folder : folder + '/';
};

const sortKeys = (keys: string[]) => {
  return keys.sort(
    (a, b) =>
      b.replace(/\/$/, '').split('/').length -
      a.replace(/\/$/, '').split('/').length,
  );
};

export async function dropRecursive(src: { bucket?: string; folder: string }) {
  const { bucket = defaultBucket, folder } = src;
  const Prefix = createFolderPrefix(folder);

  const keysToRemove: string[] = await getFolderKeys({ bucket, Prefix });

  const orderedList = sortKeys(keysToRemove);

  await dropInChunks({ bucket, keys: orderedList });
}

export const dropManyRecursive = async (src: {
  bucket?: string;
  folders: string[];
}) => {
  const { bucket = defaultBucket, folders } = src;

  const keysToRemove: string[] = [];

  for (const folder of folders) {
    const Prefix = createFolderPrefix(folder);

    const folderKeys = await getFolderKeys({ bucket, Prefix });
    keysToRemove.push(...folderKeys);
  }

  const orderedList = sortKeys(keysToRemove);

  await dropInChunks({ bucket, keys: orderedList });
};

export async function drop(src: {
  bucket?: string;
  key: string;
  folder?: string;
}) {
  const { bucket: Bucket = defaultBucket, key, folder } = src;
  const Key = makeKey(key, folder);

  await s3
    .deleteObject({
      Bucket,
      Key,
    })
    .promise();

  return true;
}

export async function dropMany(src: {
  bucket?: string;
  keys: string[];
  folder?: string;
}) {
  const { bucket: Bucket = defaultBucket, keys, folder } = src;
  const Objects = keys.map((key) => ({ Key: makeKey(key, folder) }));

  await s3
    .deleteObjects({
      Bucket,
      Delete: { Objects },
    })
    .promise();

  return true;
}

export async function copy(
  { fromFolder, fromKey, toFolder, bucket = defaultBucket },
  keyName?: string,
  overwriteKey?: boolean,
) {
  let key;

  if (!overwriteKey) {
    key =
      keyName != null
        ? fromKey.split('.')[0] + '-' + keyName + '.' + fromKey.split('.')[1]
        : fromKey;
  } else {
    key = keyName;
  }

  const result = await s3
    .copyObject({
      Bucket: `${bucket}/${toFolder}`,
      CopySource: `${bucket}/${fromFolder}/${fromKey}`,
      Key: key,
    })
    .promise();

  return {
    ...result.CopyObjectResult,
    Location: makePublicUrl(makeKey(key, toFolder), bucket),
  };
}

export async function move(
  { fromFolder, fromKey, toFolder, bucket = defaultBucket },
  keyName?: string,
) {
  const result = await copy({ fromFolder, fromKey, toFolder, bucket }, keyName);

  await drop({ folder: fromFolder, key: fromKey, bucket });

  return result;
}

export function decodePublicUrl(url: string) {
  const { host, pathname } = new URL(url);

  const matched = host.match(
    /^([a-z0-9-\.]+)\.s3\.([a-z0-9-]+?\.)?amazonaws\.com/,
  );

  if (!matched) {
    return;
  }

  const [, bucket, regionRaw] = matched;

  const region = regionRaw && regionRaw.replace(/\.$/, '');

  if (region && region !== defaultRegion) {
    console.warn(
      `Url ${url} contains a region, file operation may fail depending on the client configuration`,
    );
  }

  return {
    bucket,
    key: pathname.replace(/^\/+/, ''),
  };
}

export function splitKey(key: string) {
  const path = key.split('/');

  const filename = path.pop();

  return {
    folder: path.join('/'),
    key: filename,
  };
}
