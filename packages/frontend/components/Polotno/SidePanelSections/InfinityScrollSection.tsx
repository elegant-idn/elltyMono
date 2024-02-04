import React from "react";
import s from "./SidePanelSections.module.scss";
import InfiniteScroll from "react-infinite-scroller";
import GridImg from "../GridImg";
import clsx from "clsx";
import Masonry from "react-masonry-css";

interface InfinityScrollSectionProps {
  store: any;
  columns: number;
  gridElements: any[];
  fetchData: any;
  isReachingEnd: boolean;
  mode: "templates" | "elements";
  loadWrapper?: (loadCallback: () => unknown) => unknown;
}

const InfinityScrollSection: React.FC<
  React.PropsWithChildren<InfinityScrollSectionProps>
> = ({
  store,
  columns = 3,
  gridElements,
  fetchData,
  isReachingEnd,
  mode,
  loadWrapper,
}) => {
  const scrollWrapperRef = React.useRef(null);

  return (
    <div
      className={clsx(
        s.infiniteScrollWrapper,
        mode == "templates" && s.wrapperForTemplate
      )}
      ref={scrollWrapperRef}
    >
      {gridElements.length == 0 && (
        <div className={s.grid}>
          <Masonry
            breakpointCols={{ default: columns }}
            className={`my-masonry-grid ${s.masonryGrid}`}
            columnClassName={`my-masonry-grid_column ${s.masonryGridColumn}`}
          >
            {new Array(mode === "elements" ? 24 : 13).fill(null).map((_, i) => {
              return <div key={i} className="skeleton"></div>;
            })}
          </Masonry>
        </div>
      )}
      <InfiniteScroll
        pageStart={0}
        loadMore={() => {
          fetchData(false);
        }}
        hasMore={!isReachingEnd}
        useWindow={false}
        getScrollParent={() => scrollWrapperRef.current}
        className={s.grid}
      >
        <Masonry
          breakpointCols={{
            default: columns,
          }}
          className={`my-masonry-grid ${s.masonryGrid}`}
          columnClassName={`my-masonry-grid_column ${s.masonryGridColumn}`}
        >
          {gridElements.map((item: any, index) => {
            return (
              <div
                key={index}
                className={clsx(
                  s.gridItem,
                  mode == "templates" && s.template,
                  mode == "elements" && s.element
                )}
              >
                <div className={s.content}>
                  <GridImg
                    store={store}
                    src={item.data}
                    preview={item.preview[0]}
                    status={item.status}
                    loadWrapper={loadWrapper}
                    width={item.width}
                    height={item.height}
                  />
                </div>
              </div>
            );
          })}
        </Masonry>
      </InfiniteScroll>
    </div>
  );
};

export default InfinityScrollSection;
