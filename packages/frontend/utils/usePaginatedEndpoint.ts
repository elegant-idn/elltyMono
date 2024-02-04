import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { Api } from "../api";

interface UsePaginatedEndpointProps {
  elementsPerRequest: number;
  url: string;
  pageParamName?: string;
  itemsExtractor?: (response: any) => any[];
}

export const usePaginatedEndpoint = ({
  elementsPerRequest = 10,
  url,
  pageParamName = "offset",
  itemsExtractor = (data) => data.docs,
}: UsePaginatedEndpointProps) => {
  const [cookie] = useCookies();

  const [isLoading, setIsLoading] = useState(false);
  const [isReachingEnd, setIsReachingEnd] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);

  const [totalItems, setTotalItems] = useState(elementsPerRequest);
  const [items, setItems] = useState<any[]>([]);
  const [nextPage, setNextPage] = useState<null | number>(1);

  const fetchItems = (refresh: boolean) => {
    if (!cookie.user_token || isLoading || (!nextPage && !refresh)) return;

    const axiosHeader = {
      headers: {
        Authorization: cookie.user_token,
      },
    };
    setIsLoading(true);

    Api.get(
      `${url}?amount=${elementsPerRequest}&${pageParamName}=${nextPage}`,
      axiosHeader
    )
      .then((result) => {
        const { page, totalPages, totalDocs, nextPage } = result.data;

        const docs = itemsExtractor(result.data);

        setTotalItems(totalDocs);
        setItems(refresh ? docs : items.concat(docs));
        setNextPage(nextPage);
        setIsEmpty(totalDocs === 0);

        if (page === totalPages) setIsReachingEnd(true);

        setHasFetched(true);
      })
      .catch((err) => {
        console.log("error msg", err.response);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const numberOfSkeletonElements = Math.max(
    Math.min(totalItems - items.length, elementsPerRequest),
    0
  );

  useEffect(() => {
    if (hasFetched) setIsEmpty(items.length === 0);
  }, [items, hasFetched]);

  return {
    fetchItems,
    isLoading,
    isReachingEnd,
    isEmpty,
    totalItems,
    items,
    setItems,
    numberOfSkeletonElements,
    setIsEmpty,
  };
};
