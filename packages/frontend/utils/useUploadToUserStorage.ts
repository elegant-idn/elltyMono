import { useEffect, useState } from "react";
import useTypedSelector from "./useTypedSelector";
import { useCookies } from "react-cookie";
import { Api } from "../api";

export type UploadedImage = {
  _id: string;
  src: string;
  preview: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  size: number;
  height: number;
  width: number;
};

interface UseUploadToUserStorageProps {
  chunkSize?: number;
  onUploaded?: (uploadedImages: (UploadedImage | null)[]) => void;
  skip?: boolean;
}

const DEFAULT_UPLOAD_CHUNK_SIZE = 2;

export interface StorageMetaData {
  storageUsed: number;
  totalStorage: number;
}

export const useUploadToUserStorage = ({
  chunkSize = DEFAULT_UPLOAD_CHUNK_SIZE,
  onUploaded,
  skip = false,
}: UseUploadToUserStorageProps) => {
  const [imagesToUpload, setImagesToUpload] = useState<File[]>([]);
  const [uploadingFiles, setUploadingFiles] = useState<File[]>([]);
  const [finishingUploadFiles, setFinishingUploadFiles] = useState<File[]>([]);

  const [storageData, setStorageMetaData] = useState<StorageMetaData | null>(
    null
  );

  const [cookie] = useCookies();

  const [isUploading, setIsUploading] = useState(false);
  const user = useTypedSelector((state) => state.mainReducer.user);

  const enqueueFilesForUpload = (files: File[]) => {
    setImagesToUpload((existingFiles) => [...files, ...existingFiles]);
  };

  useEffect(() => {
    if (!user.uuid || skip) return;

    (async () => {
      const storageMetaDataResponse = await Api.get("/uploads/storage/meta", {
        headers: {
          Authorization: cookie.user.accessToken,
        },
      });

      setStorageMetaData(storageMetaDataResponse.data);
    })();
  }, [cookie, user, skip]);

  useEffect(() => {
    if (!user.uuid) return;

    (async () => {
      if (imagesToUpload.length === 0 || isUploading) return;

      setIsUploading(true);

      const formData = new FormData();

      const currentChunk = imagesToUpload.slice(
        imagesToUpload.length - chunkSize,
        imagesToUpload.length
      );

      setUploadingFiles(currentChunk);

      currentChunk.forEach((chunkFile) => {
        formData.append("images", chunkFile);
        formData.append("names", chunkFile.name);
      });

      const filesUploadResponse = await Api.post<{
        storageUsed: number;
        totalStorage: number;
        result: (UploadedImage | null)[];
      }>("/uploads", formData, {
        headers: {
          Authorization: cookie.user.accessToken,
        },
      });

      setFinishingUploadFiles(currentChunk);

      await new Promise((r) => setTimeout(r, 1000));

      const { result, ...meta } = filesUploadResponse.data;

      setStorageMetaData(meta);

      setImagesToUpload((value) => {
        const copy = [...value];
        copy.splice(imagesToUpload.length - chunkSize, chunkSize);
        return copy;
      });

      onUploaded?.(result);

      setIsUploading(false);
    })();
  }, [imagesToUpload, cookie, isUploading, user, chunkSize, onUploaded]);

  return {
    enqueueFilesForUpload,
    uploadingFiles,
    finishingUploadFiles,
    storageData,
    isUploading,
    setStorageMetaData,
    imagesToUpload,
  };
};
