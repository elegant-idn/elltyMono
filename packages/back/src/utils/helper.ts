import { UserDocument } from '../schemas/user.schema';
import { UserTemplateDocument } from '../schemas/userTemplates.schema';
import { generate } from 'shortid';
import * as fs from 'fs';
import * as path from 'path';
import { pipeline } from 'stream';
import { promisify } from 'util';
import { HttpException, HttpStatus } from '@nestjs/common';
import { remove } from './localstorage';
import { UploadDocument } from '../schemas/upload.schema';

const ROOT_DIR = '../store';

const trashDir = 'trash';
const previewsDir = 'previews';
const latestDesignsDir = 'latest-designs';

export const USER_RESERVED_DIRS = [trashDir, previewsDir, latestDesignsDir];

export const AWS_USER_TEMPLATE_BUCKET = (
  user: UserDocument,
  template: UserTemplateDocument,
) => {
  return `user-templates/user-${user.uuid}-templates/user-${user.uuid}-template-${template._id}`;
};

export const USER_TEMPLATE_DEFAULT_DIR = (
  user: UserDocument | undefined,
  fallbackUserUuid?: string,
) => {
  return `user-templates/user-${user?.uuid ?? fallbackUserUuid}-templates`;
};

export const USER_UPLOAD_DEFAULT_DIR = (
  user: UserDocument | undefined,
  uploadDoc: UploadDocument,
) => {
  return `user-upload/user-${user?.uuid}-uploads/upload-${uploadDoc._id}`;
};

export const USER_UPLOAD_PREVIEWS_DIR = (
  user: UserDocument | undefined,
  uploadDoc: UploadDocument,
) => {
  return [USER_UPLOAD_DEFAULT_DIR(user, uploadDoc), 'previews'].join('/');
};

export const USER_TEMPLATE_REFACTOR = (user: UserDocument, folder: string) => {
  if (!/^[\w\- ]+$/.test(folder)) {
    throw new HttpException('Access denied', HttpStatus.METHOD_NOT_ALLOWED);
  }

  return [USER_TEMPLATE_DEFAULT_DIR(user), folder]
    .join('/')
    .replace(/\/{2;}/g, '/');
};

export const USER_TEMPLATE_PREVIEWS_DIR = (
  user: UserDocument | undefined,
  fallbackUserUuid?: string,
) => {
  return [USER_TEMPLATE_DEFAULT_DIR(user, fallbackUserUuid), previewsDir].join(
    '/',
  );
};

export const USER_TEMPLATE_TRASH_DIR = (user: UserDocument) => {
  return [USER_TEMPLATE_DEFAULT_DIR(user), trashDir].join('/');
};

//
// latest designs dir is used only in local storage
export const USER_TEMPLATE_LATEST_DIR = (user: UserDocument) => {
  return [USER_TEMPLATE_DEFAULT_DIR(user), latestDesignsDir].join('/');
};

export const editUserTemplateFolderLatest = (req, file, cb) => {
  const userUuid = req.user?.uuid ?? req.body.temporaryUserToken;

  if (!fs.existsSync(ROOT_DIR)) {
    fs.mkdirSync(ROOT_DIR, { recursive: true });
  }
  const dir = `${ROOT_DIR}/user-templates/user-${userUuid}-templates/latest-designs`;

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  cb(null, dir);
};

export const editUserTemplateFileName = (req, file, callback) => {
  const userUuid = req.user?.uuid ?? req.body.temporaryUserToken;

  const name = file.originalname.split('.')[0];
  const fileExtName = file.originalname.split('.')[1];
  const randomName = Array(4)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString(16))
    .join('');
  callback(null, `${userUuid}-${Date.now()}.${fileExtName}`);
};

export const generateFileName = (name: string = '') => {
  return [generate(), ...name.match(/[a-zA-Z0-9-_\.]+/g)].join('');
};

export const pipeAsync = promisify(pipeline);

export const errHandler =
  (message: string, errCode = HttpStatus.INTERNAL_SERVER_ERROR) =>
  (err) => {
    console.error(err);

    throw new HttpException(message, errCode);
  };

export const removeUploaded = (files: Express.Multer.File[]) => async () => {
  if (files) {
    for (let file of files) {
      await remove(file.path);
    }
  }
};
