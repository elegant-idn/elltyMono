import { Skeleton } from "@mui/material";
import React from "react";
import InfiniteScroll from "react-infinite-scroller";
import Masonry from "react-masonry-css";
import s from "./BaseGrid.module.scss";

interface BaseGridProps {
  children: React.ReactNode;
  numberOfSkeletonElements: number;
  fetchData: (refresh: boolean) => unknown;
  isReachingEnd: boolean;
  isLoading: boolean;
}

export const BaseGrid: React.FC<BaseGridProps> = ({
  children,
  fetchData,
  isReachingEnd,
  numberOfSkeletonElements,
  isLoading,
}) => {
  const ref = React.useRef(null);

  return (
    <div ref={ref}>
      <InfiniteScroll
        pageStart={0}
        loadMore={() => {
          fetchData(false);
        }}
        hasMore={!isReachingEnd}
        useWindow={true}
        getScrollParent={() => ref.current}
        // className={s.grid}
      >
        <Masonry
          breakpointCols={{
            default: 6,
            1440: 5,
            1280: 4,
            1024: 3,
            480: 2,
          }}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column"
        >
          {children}

          {!isLoading
            ? undefined
            : new Array(Math.min(numberOfSkeletonElements))
                .fill(true)
                .map((_, i) => {
                  return (
                    <Skeleton
                      key={i}
                      variant="rectangular"
                      className={s.skeleton}
                    />
                  );
                })}
        </Masonry>
      </InfiniteScroll>
    </div>
  );
};
