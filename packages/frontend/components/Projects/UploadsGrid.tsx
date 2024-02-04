import React, { ComponentProps, Dispatch, SetStateAction } from "react";
import s from "./Empty.module.scss";
import { BaseGrid } from "./BaseGrid";
import { UploadGridElement } from "../Dashboard/UploadElements/UploadGridElement";
import { useDropdown } from "../../utils/useDropdown";
import Dropdown from "../Dropdown";
import { UploadElementDropdownContent } from "../Dashboard/UploadElements/UploadElementDropdownContent";
import { Trans, useTranslation } from "next-i18next";
import { BaseUploadButton } from "./BaseUploadButton";
import { Api } from "../../api";
import { useCookies } from "react-cookie";
import { UploadElementTrashDropdownContent } from "../Dashboard/UploadElements/UploadElementTrashDropdownContent";
import { NotificationIsland } from "../NotificationIsland";
import { Backdrop, Box } from "@mui/material";
import { ImageStack } from "../ImageStack";
import { DeletingIsland } from "./DeletingIsland";
import { KEEP_TRASH_DAYS } from "../../utils/constants";
import {
  StorageMetaData,
  useUploadToUserStorage,
} from "../../utils/useUploadToUserStorage";

interface UploadsGridProps
  extends Omit<ComponentProps<typeof BaseGrid>, "children"> {
  uploads: any[];
  isEmpty: boolean;
  setUploads: Dispatch<SetStateAction<any[]>>;
  onUpload?: ComponentProps<typeof BaseUploadButton>["onUpload"];
  uploadingFiles?: File[];
  finishingUploadFiles?: File[];
  trash?: boolean;
  selectedIds?: string[];
  setSelectedIds?: Dispatch<SetStateAction<string[]>>;
  onMoveToTrash?: (upload: any) => unknown;
}

export const UploadsGrid: React.FC<UploadsGridProps> = ({
  isEmpty,
  uploads,
  setUploads,
  onUpload = () => {},
  finishingUploadFiles,
  uploadingFiles,
  trash,
  selectedIds = [],
  setSelectedIds,
  onMoveToTrash,
  ...baseProps
}) => {
  const { t } = useTranslation("Dashboard");
  const { closeDropdown, openDropdown, anchor, popperRef, activeItem } =
    useDropdown();
  const [cookie] = useCookies();
  const [deletingUpload, setDeletingUpload] = React.useState<any>(null);
  const [uploadDeleted, setUploadDeleted] = React.useState(false);
  const [isConfirmingDeletion, setIsConfirmingDeletion] = React.useState(false);

  const handleUpdateUpload = (
    id: string,
    newProperties: Record<string, any>
  ) => {
    setUploads((upload) => {
      const uploadToUpdateIndex = upload.findIndex(
        (template) => template._id === id
      );
      if (uploadToUpdateIndex === -1) return upload;
      const uploadToUpdate = upload[uploadToUpdateIndex];
      const newUpload = {
        ...uploadToUpdate,
        ...newProperties,
        updatedAt: new Date(),
      };
      const newUploads = [...upload];
      newUploads.splice(uploadToUpdateIndex, 1, newUpload);
      return newUploads;
    });
  };

  const removeUpload = (id: string) => {
    setUploads((upload) => {
      const uploadToRemoveIndex = upload.findIndex(
        (template) => template._id === id
      );
      if (uploadToRemoveIndex === -1) return upload;
      const newUploads = [...upload];
      newUploads.splice(uploadToRemoveIndex, 1);
      return newUploads;
    });
  };

  const withRemoval =
    (cb: (upload: any) => Promise<unknown>, instantRemoval = true) =>
    async (upload: any) => {
      closeDropdown();

      if (instantRemoval) {
        removeUpload(upload._id);
      }

      await cb(upload);

      if (!instantRemoval) {
        removeUpload(upload._id);
      }
    };

  const handleMoveUploadToTrash = withRemoval(async (upload: any) => {
    onMoveToTrash?.(upload);

    await Api.patch(
      "/uploads/trash",
      { ids: [upload._id] },
      {
        headers: {
          Authorization: cookie.user_token,
        },
      }
    );
  });

  const handleRestore = withRemoval(async (upload: any) => {
    const response = await Api.patch<StorageMetaData>(
      "/uploads/restore",
      { ids: [upload._id] },
      {
        headers: {
          Authorization: cookie.user_token,
        },
      }
    );

    setStorageMetaData(response.data);
  });

  const handleUploadDelete = withRemoval(async (upload: any) => {
    setDeletingUpload(upload);

    await Api.delete(`/uploads/bulk`, {
      data: {
        ids: [upload._id],
      },
      headers: {
        Authorization: cookie.user_token,
      },
    });

    setUploadDeleted(true);

    setTimeout(() => {
      setDeletingUpload(null);
      setUploadDeleted(false);
    }, 2000);
  }, false);

  const ns = trash ? "uploadTrash" : "upload";
  const imgNs = trash ? "uploadsTrash-blank" : "uploads-blank";

  const { storageData, setStorageMetaData } = useUploadToUserStorage({});

  return (
    <>
      {isEmpty ? (
        <div className={s.emptyContainer}>
          <img src={`/dashboard/${imgNs}.svg`} alt="Empty illustration" />
          <p className={s.title}>
            <Trans t={t} i18nKey={`empty.${ns}.title`} />
          </p>
          <p className={s.subtitle}>
            <Trans
              t={t}
              i18nKey={`empty.${ns}.subtitle`}
              components={
                {
                  action: <BaseUploadButton onUpload={onUpload} unstyled />,
                  days: KEEP_TRASH_DAYS,
                } as any
              }
            />
          </p>
        </div>
      ) : (
        <BaseGrid {...baseProps}>
          {uploads.map((item: any, i: number) => {
            if (item instanceof File) {
              return (
                <UploadGridElement
                  key={i}
                  item={item}
                  showUpload={uploadingFiles?.includes(item)}
                  hasLoaded={finishingUploadFiles?.includes(item)}
                />
              );
            }

            const isSelected = selectedIds.includes(item._id);
            return (
              <UploadGridElement
                key={item?._id ?? i}
                item={item}
                threeDots
                threeDotsAction={openDropdown}
                activeItem={activeItem}
                selectable={!!setSelectedIds}
                isSelected={isSelected}
                trash={trash}
                onChangeCheckbox={() => {
                  if (isSelected) {
                    setSelectedIds?.((ids) =>
                      ids.filter((id) => id !== item._id)
                    );
                  } else {
                    setSelectedIds?.((ids) => [...ids, item._id]);
                  }
                }}
                alwaysShowSelection={selectedIds.length > 0}
              />
            );
          })}
        </BaseGrid>
      )}

      <Dropdown
        anchor={anchor}
        onClose={closeDropdown}
        popperRef={popperRef}
        minHeight={isConfirmingDeletion ? 0 : 320}
      >
        {trash ? (
          <UploadElementTrashDropdownContent
            upload={activeItem}
            onUploadUpdate={handleUpdateUpload}
            onUploadDelete={handleUploadDelete}
            onRestore={handleRestore}
            storageData={storageData}
            onDeletingChange={setIsConfirmingDeletion}
          />
        ) : (
          <>
            {activeItem && (
              <UploadElementDropdownContent
                upload={activeItem}
                onUploadUpdate={handleUpdateUpload}
                onUploadDownload={closeDropdown}
                onUploadToTrash={handleMoveUploadToTrash}
              />
            )}
          </>
        )}
      </Dropdown>

      <DeletingIsland
        deletedItem={deletingUpload}
        isItemDeleted={uploadDeleted}
      />
    </>
  );
};
