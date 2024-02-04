import React from "react";
import s from "./SidePanelSections.module.scss";
import InfiniteScroll from "react-infinite-scroller";
import GridImg from "../GridImg";
import { Api } from "../../../api";
import useDebouncedEffect from "../../../utils/useDebouncedEffect";
import Masonry from "react-masonry-css";
import clsx from "clsx";

interface IconFinderSectionProps {
  store: any;
  query: string;
}

const ELEMENTS_PER_REQUEST = 160;

const IconFinderSection: React.FC<
  React.PropsWithChildren<IconFinderSectionProps>
> = ({ store, query }) => {
  const [elements, setElements] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [isReachingEnd, setIsReachingEnd] = React.useState<boolean>(false);
  const scrollWrapperRef = React.useRef(null);

  // useDebouncedEffect(() => fetchData(true), [query], 2000)

  React.useEffect(() => {
    // fetchData(false)
  }, []);

  React.useEffect(() => {
    setIsLoading(false);
    fetchData(true);
  }, [query]);

  const fetchData = (refresh: boolean) => {
    if (isLoading || !query) return;

    setIsLoading(true);

    // const page = refresh ? 1 : elements.length / ELEMENTS_PER_REQUEST + 1;

    Api.get(
      `/iconfinder/v4/icons/search?query=${query}&count=${ELEMENTS_PER_REQUEST}&vector=1&premium=0`
    )
      .then((result) => {
        const data = result.data.icons;

        setElements(refresh ? data : elements.concat(data));
        //setElements( data );
        setIsReachingEnd(true);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className={s.infiniteScrollWrapper} ref={scrollWrapperRef}>
      <InfiniteScroll
        pageStart={0}
        loadMore={() => {
          fetchData(false);
        }}
        hasMore={!isReachingEnd}
        loader={
          <div className={s.loader} key={0}>
            Loading ...
          </div>
        }
        useWindow={false}
        getScrollParent={() => scrollWrapperRef.current}
        className={s.grid}
      >
        {/* {elements.map((item: any, index) => {
          return (
            <div key={item.uuid} className={s.gridItem}>
              <div className={s.content}>
                <GridImg
                  store={store}
                  src={item.urls.png_128}
                  uuid={item.uuid}
                />
              </div>
            </div>
          );
        })} */}
        <Masonry
          breakpointCols={{
            default: 3,
          }}
          className={`my-masonry-grid ${s.masonryGrid}`}
          columnClassName={`my-masonry-grid_column ${s.masonryGridColumn}`}
        >
          {elements.map((item: any, index) => {
            return (
              <div key={index} className={clsx(s.gridItem, s.element)}>
                <div className={s.content}>
                  <GridImg
                    store={store}
                    src={item.raster_sizes[6]?.formats[0].preview_url}
                    // preview={item.preview[0]}
                    // status={item.status}
                    uuid={item.icon_id}
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

export default IconFinderSection;
