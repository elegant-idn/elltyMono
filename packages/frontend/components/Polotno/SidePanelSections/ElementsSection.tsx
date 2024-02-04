import { observer } from "mobx-react-lite";
import { nanoid } from "nanoid";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import "swiper/css";
import { SetElementsPanelCategoryAction } from "../../../redux/actions";
import { RootState } from "../../../redux/store";
import s from "./SidePanelSections.module.scss";

import { Api } from "../../../api";
import Slider from "../Slider";
import IconFinderSection from "./IconFinderSection";
import InfinityScrollSection from "./InfinityScrollSection";
import TitleContainer from "./TitleContainer";
import SearchInput from "./SearchInput";

const elementsCategories = [
  {
    value: "Shapes",
    _id: "62b5da7b6eaa3bf06a0f76eb",
  },
  {
    value: "Stars",
    _id: "62bd873dcb30c110ccac4fff",
  },
  {
    value: "Abstract-Forms",
    _id: "64bb74012d5237ddac41e86c",
  },
  {
    value: "Arrows",
    _id: "64b241a24ff29748593d8138",
  },
  {
    value: "Photo Frames",
    _id: "63a675c6600dbb67896fdb75",
  },
  {
    value: "Lines",
    _id: "62baccf5a2b3912ba88aead7",
  },
  {
    value: "Print-and-Paper",
    _id: "637f640cfdc5fdb9e2e6590d",
  },
  {
    value: "Line-Shapes",
    _id: "62c14a912bf5e6650f4b9161",
  },
  {
    value: "Stickers",
    _id: "62c4710f80ecee20302a35fc",
  },
  {
    value: "Letterings",
    _id: "62c4710380ecee20302a35f0",
  },
  {
    value: "Brushes",
    _id: "62c470fe80ecee20302a35e8",
  },
  {
    value: "Labels",
    _id: "62c4710c80ecee20302a35f8",
  },
  {
    value: "Speech-bubble",
    _id: "62c4710980ecee20302a35f4",
  },
  {
    value: "Boho",
    _id: "62c4711280ecee20302a3600",
  },
  {
    value: "Gradients",
    _id: "62c470f580ecee20302a35dc",
  },
  {
    value: "Buttons",
    _id: "62c470f880ecee20302a35e0",
  },
  {
    value: "Botanicals",
    _id: "62c470fc80ecee20302a35e4",
  },
  {
    value: "People",
    _id: "62c4710180ecee20302a35ec",
  },
  {
    value: "Line-Drawings",
    _id: "62c4711580ecee20302a3604",
  },
  {
    value: "Shadows",
    _id: "62c470f080ecee20302a35d8",
  },
  {
    value: "Animals",
    _id: "62c4711b80ecee20302a360c",
  },
  {
    value: "Patterns",
    _id: "62c4711d80ecee20302a3610",
  },
  {
    value: "Web-Elements",
    _id: "62c4711880ecee20302a3608",
  },
  {
    value: "Frames",
    _id: "62c2d034fcb5d5d746c5801e",
  },
  {
    value: "Winter",
    _id: "6394880a412d0e40f0515c58",
  },
];

const ELEMENTS_PER_REQUEST = 50;

// @ts-ignore
const ElementsSection = observer(({ store }) => {
  const dispatch = useDispatch();

  const elementsPanelCategory = useSelector(
    (state: RootState) => state.designReducer.elementsPanelCategory
  );

  const [elements, setElements] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isReachingEnd, setIsReachingEnd] = React.useState(false);

  const requestTimeout = React.useRef<any>();
  const [query, setQuery] = React.useState("");
  const [delayedQuery, setDelayedQuery] = React.useState(query);
  const hasSearch = !!query;

  React.useEffect(() => {
    requestTimeout.current = setTimeout(() => {
      setDelayedQuery(query);
    }, 500);
    return () => {
      clearTimeout(requestTimeout.current);
    };
  }, [query]);

  React.useEffect(() => {
    return () => {
      dispatch(SetElementsPanelCategoryAction(""));
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  React.useEffect(() => {
    if (elementsPanelCategory) return;

    setElements([]);
    setIsLoading(false);
    setIsReachingEnd(false);
  }, [elementsPanelCategory]);

  const fetchData = (refresh: boolean) => {
    if (isLoading) return;
    setIsLoading(true);

    const page = refresh ? 1 : elements.length / ELEMENTS_PER_REQUEST + 1;

    Api.get(
      `/elements?categories=${elementsPanelCategory._id}&amount=${ELEMENTS_PER_REQUEST}&offset=${page}`
    )
      .then((result) => {
        // console.log(result.data);
        const { elements: elementsResult, page, pages } = result.data;
        setElements(refresh ? elementsResult : elements.concat(elementsResult));
        if (page === pages) setIsReachingEnd(true);
      })
      .catch((err) => {
        console.log(err.response);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // dont delete below
  // console.log(store.width, store.height);
  // console.log(store.toJSON());
  // console.log(store.activePage.toJSON().children);
  // store.activePage.toJSON().children.forEach((elem: any) => {
  //   console.log(elem);
  //   const propElement = elem.width / elem.height
  //   const elementWidth = store.width * MAX_ELEMENT_SIZE
  //   const elementHeight = elementWidth / propElement

  //   if((store.width / 2 - elementWidth / 2) == elem.x &&
  //     store.height / 2 - elementHeight / 2 == elem.y) {
  //     console.log('Элемент по центру!!!');
  //   }

  return (
    <div className={s.root}>
      {!elementsPanelCategory && (
        <SearchInput query={query} setQuery={setQuery} />
      )}

      {hasSearch && <IconFinderSection store={store} query={delayedQuery} />}

      {!hasSearch && !elementsPanelCategory && (
        <div style={{ padding: "0 14px", overflowY: "auto" }}>
          {elementsCategories.map((item, i) => {
            return <Slider key={i} store={store} category={item} />;
          })}
        </div>
      )}

      {!hasSearch && elementsPanelCategory && (
        <>
          <TitleContainer />
          <InfinityScrollSection
            store={store}
            gridElements={elements}
            columns={3}
            fetchData={fetchData}
            isReachingEnd={isReachingEnd}
            mode="elements"
          />
        </>
      )}
    </div>
  );
});

export default ElementsSection;
