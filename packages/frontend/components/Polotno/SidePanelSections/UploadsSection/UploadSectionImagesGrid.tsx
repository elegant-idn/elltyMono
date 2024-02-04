import { observer } from "mobx-react-lite";
import React, { useRef } from "react";
import InfiniteScroll from "react-infinite-scroller";
import Masonry from "react-masonry-css";
import { UploadedImage } from ".";
import { ImageItem } from "./ImageItem";
import s from "./UploadsSection.module.scss";
import useTypedSelector from "../../../../utils/useTypedSelector";

interface UploadSectionItemsGridProps {
  images: (UploadedImage | File)[];
  total: null | number;
  uploadingFiles: File[];
  finishingUploadFiles: File[];
  selectedImageIds: string[];
  onSelectedImageIdsChange: (newIds: string[]) => unknown;
  store: any;
  fetchData: () => unknown;
  onDelete: (image: UploadedImage, response: any) => unknown;
  onUpdate: (imageId: string, image: UploadedImage) => unknown;
  onDeleteStart?: (image: UploadedImage) => unknown;
  hasMore: boolean;
}

export const UploadSectionImagesGrid: React.FC<UploadSectionItemsGridProps> =
  observer(
    ({
      images,
      total,
      onSelectedImageIdsChange,
      selectedImageIds,
      store,
      hasMore,
      fetchData,
      uploadingFiles,
      finishingUploadFiles,
      onDelete,
      onDeleteStart,
      onUpdate,
    }) => {
      const scrollParentRef = useRef(null);
      const user = useTypedSelector((state) => state.mainReducer.user);
      const makeHandleImageSelect = (image: UploadedImage) => () => {
        if (selectedImageIds.includes(image._id)) {
          onSelectedImageIdsChange(
            selectedImageIds.filter((imageId) => imageId !== image._id)
          );
        } else {
          onSelectedImageIdsChange([...selectedImageIds, image._id]);
        }
      };

      return (
        <>
          <div ref={scrollParentRef} className={s.gridRoot}>
            <InfiniteScroll
              pageStart={0}
              loadMore={() => {
                fetchData();
              }}
              hasMore={hasMore}
              useWindow={false}
              getScrollParent={() => scrollParentRef.current}
            >
              <Masonry
                breakpointCols={{
                  default: 2,
                }}
                className={`my-masonry-grid ${s.masonryGrid}`}
                columnClassName={`my-masonry-grid_column ${s.masonryGridColumn}`}
              >
                {total == null &&
                  user.uuid &&
                  new Array(13).fill(null).map((_, i) => {
                    return <div key={i} className="skeleton"></div>;
                  })}
                {images.map((image) => {
                  if (image instanceof File) {
                    return (
                      <ImageItem
                        store={null}
                        showUpload={uploadingFiles.includes(image)}
                        hasLoaded={finishingUploadFiles.includes(image)}
                        image={image}
                        key={image.lastModified}
                        alwaysHideActions
                      />
                    );
                  }

                  return (
                    <ImageItem
                      image={image}
                      store={store}
                      key={image._id}
                      isSelected={selectedImageIds.includes(image._id)}
                      onSelect={makeHandleImageSelect(image)}
                      showActions={selectedImageIds.length !== 0}
                      onDelete={(response) => onDelete(image, response)}
                      onDeleteStart={() => onDeleteStart?.(image)}
                      onUpdate={onUpdate}
                    />
                  );
                })}
              </Masonry>
            </InfiniteScroll>
          </div>
        </>
      );
    }
  );
