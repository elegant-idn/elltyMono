import { Model, Types } from 'mongoose';
import { UploadDocument } from '../../../schemas/upload.schema';
import { UserDocument } from '../../../schemas/user.schema';

// 1GB
const FREE_USER_MAX_UPLOAD = 1024 * 1024 * 1024 * 0.1;
// 5GB
const PRO_USER_MAX_UPLOAD = 1024 * 1024 * 1024 * 5;

export const getUserStorageMeta = async (
  uploadModel: Model<UploadDocument>,
  user: UserDocument,
) => {
  const aggregateResult = await uploadModel.aggregate([
    {
      $match: { user: new Types.ObjectId(user.id), deleted: { $ne: true } },
    },
    {
      $group: {
        _id: null,
        totalSize: { $sum: '$size' },
      },
    },
  ]);

  const totalStorage =
    user.plan === 'free' ? FREE_USER_MAX_UPLOAD : PRO_USER_MAX_UPLOAD;

  return { storageUsed: aggregateResult?.[0]?.totalSize ?? 0, totalStorage };
};
