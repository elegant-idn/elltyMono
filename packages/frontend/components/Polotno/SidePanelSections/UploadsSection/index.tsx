import clsx from "clsx";
import { observer } from "mobx-react-lite";
import { useTranslation } from "next-i18next";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useCookies } from "react-cookie";
import { Api } from "../../../../api";
import useTypedSelector from "../../../../utils/useTypedSelector";
import { MovingToTrashImagesOverlay } from "./MovingToTrashImagesOverlay";
import { UploadSectionBtn } from "./UploadSectionBtn";
import { UploadSectionGridActions } from "./UploadSectionGridActions";
import { UploadSectionImagesGrid } from "./UploadSectionImagesGrid";
import { UploadSectionStorage } from "./UploadSectionStorage";
import s from "./UploadsSection.module.scss";
import { useUploadToUserStorage } from "../../../../utils/useUploadToUserStorage";

interface UploadsSectionProps {
  store: any;
}

type Images = {
  total: null | number;
  data: (UploadedImage | File)[];
};

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

const UPLOAD_CHUNK_SIZE = 2;
const ELEMENTS_PER_PAGE = 34;

export const UploadsSection: React.FC<UploadsSectionProps> = observer(
  ({ store }) => {
    const { t }: any = useTranslation("design", {
      keyPrefix: "content.polotno.sidePanel",
    });
    const fetched = useRef(false);

    const [cookie] = useCookies();

    const user = useTypedSelector((state) => state.mainReducer.user);

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    const [isLoading, setIsLoading] = useState(false);

    const [images, setImages] = useState<Images>({
      total: null,
      data: [],
    });

    const [deletingImages, setDeletingImages] = useState<UploadedImage[]>([]);
    const [isDeleted, setIsDeleted] = useState(false);

    const handleUploadedImages = useCallback(
      (images: (UploadedImage | null)[]) => {
        setImages((value) => {
          const copy = [...value.data];

          const clearImages = images.filter(
            (image) => !!image
          ) as UploadedImage[];

          copy.unshift(...clearImages);
          return {
            total: value.total,
            data: copy,
          };
        });
      },
      []
    );

    const {
      enqueueFilesForUpload,
      finishingUploadFiles,
      storageData,
      uploadingFiles,
      setStorageMetaData,
      imagesToUpload,
    } = useUploadToUserStorage({ onUploaded: handleUploadedImages });

    const progressValue = storageData
      ? Math.min(
          Math.floor(
            (storageData?.storageUsed / storageData?.totalStorage) * 100
          ),
          100
        )
      : null;

    const [selectedImageIds, setSelectedImageIds] = useState<
      UploadedImage["_id"][]
    >([]);

    const fetchUploads = useCallback(async () => {
      if (isLoading || !user.uuid) return;

      setIsLoading(true);
      const response = await Api.get(
        `/uploads?page=${page}&amount=${ELEMENTS_PER_PAGE}`,
        {
          headers: {
            Authorization: cookie.user.accessToken,
          },
        }
      );

      const uploadsResult = response.data;

      setImages((v) => {
        const copy = [...v.data];
        copy.splice(
          uploadsResult.page * ELEMENTS_PER_PAGE,
          ELEMENTS_PER_PAGE,
          ...uploadsResult.uploads
        );
        return {
          total: uploadsResult.totalDocs,
          data: copy,
        };
      });

      setPage((p) => p + 1);
      setTotalPages(uploadsResult.pages);
      setIsLoading(false);

      return response.data;
    }, [cookie, page, isLoading, user]);

    useEffect(() => {
      if (fetched.current) return;

      fetchUploads();

      fetched.current = true;
    }, [fetchUploads]);

    const deselect = () => {
      setSelectedImageIds([]);
    };

    const deleteSelected = async () => {
      const deleteImageIds = [...selectedImageIds];
      setSelectedImageIds([]);

      setDeletingImages(
        images.data.filter((image) => {
          if (image instanceof File) return false;

          return deleteImageIds.includes(image._id);
        }) as UploadedImage[]
      );

      const response = await Api.patch(
        "/uploads/trash",
        {
          ids: deleteImageIds,
        },
        {
          headers: {
            Authorization: cookie.user.accessToken,
          },
        }
      );

      setStorageMetaData(response.data);

      setIsDeleted(true);

      setImages((images) => {
        return {
          ...images,
          data: images.data.filter((image) => {
            if (image instanceof File) return true;

            return !deleteImageIds.includes(image._id);
          }),
        };
      });

      await new Promise((r) => setTimeout(r, 1000));

      setDeletingImages([]);
      setIsDeleted(false);
    };

    async function toDataURL(url: string) {
      const blob = await fetch(url).then((res) => res.blob());
      return URL.createObjectURL(blob);
    }

    const downloadSelected = () => {
      const imagesToDownload = images.data.filter(
        (image) =>
          !(image instanceof File) && selectedImageIds.includes(image._id)
      ) as UploadedImage[];

      imagesToDownload.forEach(async (image) => {
        const a = document.createElement("a");
        a.href = await toDataURL(image.src);
        a.download = image.title;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      });
    };

    const removeDeletedImageAndUpdateMeta = async (
      imageToRemove: UploadedImage,
      response: any
    ) => {
      setIsDeleted(true);

      setStorageMetaData(response.data);
      setImages((images) => {
        return {
          ...images,
          data: images.data.filter((image) => {
            if (image instanceof File) return true;

            return image._id !== imageToRemove._id;
          }),
        };
      });

      setSelectedImageIds((imageIds) =>
        imageIds.filter((id) => id !== imageToRemove._id)
      );

      await new Promise((r) => setTimeout(r, 1000));

      setDeletingImages([]);
      setIsDeleted(false);
    };

    const updateImage = (imageId: string, image: UploadedImage) => {
      setImages((images) => {
        const imageIndex = images.data.findIndex((img) => {
          if (img instanceof File) return false;

          return img._id === imageId;
        });

        const copy = [...images.data];

        copy.splice(imageIndex, 1, image);

        return {
          ...images,
          data: copy,
        };
      });
    };

    const showActions = selectedImageIds.length > 0;

    return (
      <>
        <div
          className={clsx(s.root, { [s.actionsShown]: showActions })}
          style={{
            padding: "0",
          }}
        >
          <p className={s.hint}>{t("uploadHint")}</p>

          {user.uuid && <UploadSectionStorage progress={progressValue} />}

          <UploadSectionBtn
            progress={progressValue}
            onUpload={enqueueFilesForUpload}
          />

          {showActions && (
            <UploadSectionGridActions
              selectedCount={selectedImageIds.length}
              onDeselect={deselect}
              onDelete={deleteSelected}
              onDownload={downloadSelected}
            />
          )}

          <UploadSectionImagesGrid
            store={store}
            images={[...imagesToUpload, ...images.data]}
            total={images.total}
            uploadingFiles={uploadingFiles}
            finishingUploadFiles={finishingUploadFiles}
            selectedImageIds={selectedImageIds}
            onSelectedImageIdsChange={(newIds) => setSelectedImageIds(newIds)}
            fetchData={fetchUploads}
            hasMore={totalPages >= page && images.data.length !== 0}
            onDelete={removeDeletedImageAndUpdateMeta}
            onDeleteStart={(image) => setDeletingImages([image])}
            onUpdate={updateImage}
          />
        </div>

        <MovingToTrashImagesOverlay
          images={deletingImages}
          isDeleted={isDeleted}
        />
      </>
    );
  }
);
