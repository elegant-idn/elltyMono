import axios from "axios";
import { observer } from "mobx-react-lite";
import { Trans, useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import React from "react";
import { useCookies } from "react-cookie";
import { useDispatch, useSelector } from "react-redux";
import { Api, BASE_URL } from "../../../api";
import { ResetNumberOfChangesAction } from "../../../redux/actions";
import { RootState } from "../../../redux/store";
import { ReplaceTemplateModal } from "../ReplaceTemplateModal";
import InfinityScrollSection from "./InfinityScrollSection";
import s from "./SidePanelSections.module.scss";

const ELEMENTS_PER_REQUEST = 50;
const NUMBER_OF_CHANGES_BEFORE_NEW_TEMPLATE_WARNING = 100;

// @ts-ignore
const TemplatesSection = observer(({ store }) => {
  const { t }: any = useTranslation("design");
  const i18n = t("content", { returnObjects: true });

  const numberOfChanges = useSelector(
    (root: RootState) => root.designReducer.numberOfChanges
  );
  const dispatch = useDispatch();
  const router = useRouter();
  const [cookie] = useCookies();

  const requestTimeout = React.useRef<any>();
  const [query, setQuery] = React.useState("");
  const [displayingFallbackTemplates, setDisplayingFallbackTemplates] =
    React.useState(false);
  const [delayedQuery, setDelayedQuery] = React.useState(query);

  const templatesByLanguageAreOver = React.useRef(false);
  const [templates, setTemplates] = React.useState([]);
  const templatesLanguageTotal = React.useRef<number | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isReachingEnd, setIsReachingEnd] = React.useState<boolean>(false);
  const [isDidMount, setIsDidMount] = React.useState(true);
  const [fetchedOnce, setFetchedOnce] = React.useState(false);

  const [showConfirmLoadTemplate, setShowConfirmLoadTemplate] =
    React.useState(false);
  const confirmTemplateCbRef = React.useRef<null | (() => unknown)>(null);

  let categoryId = router.query.category || router.query.category_id || "";

  React.useEffect(() => {
    requestTimeout.current = setTimeout(() => {
      setDelayedQuery(query);
    }, 500);
    return () => {
      clearTimeout(requestTimeout.current);
    };
  }, [query]);

  const fetchData = async (refresh: boolean, query: string) => {
    if (isLoading) return;
    setIsLoading(true);

    const currentPage = refresh
      ? 1
      : Math.ceil(templates.length / ELEMENTS_PER_REQUEST) + 1;

    if (templatesLanguageTotal.current === null) {
      await axios
        .get(
          `${BASE_URL}/templates?categories=${categoryId}&query=${query}&amount=1&page=1&language=${cookie.locale}`
        )
        .then((result) => {
          // console.log(result);
          templatesLanguageTotal.current = result.data.totalItems;
        })
        .catch((err) => {
          console.log(err);
        });
    }

    if (
      currentPage <=
      // @ts-ignore
      Math.ceil(templatesLanguageTotal.current / ELEMENTS_PER_REQUEST)
    ) {
      templatesByLanguageAreOver.current = false;
    } else {
      templatesByLanguageAreOver.current = true;
    }

    if (templatesByLanguageAreOver.current) {
      const pageOffset = Math.ceil(
        // @ts-ignore
        templatesLanguageTotal.current / ELEMENTS_PER_REQUEST
      );

      try {
        const result = await Api.get(
          `/templates?categories=${categoryId}&query=${query}&amount=${ELEMENTS_PER_REQUEST}&page=${
            currentPage - pageOffset
          }&language[ne]=${cookie.locale}`
        );
        // console.log(result.data);
        const { templates: templatesResult, page, pages } = result.data;
        setTemplates(
          refresh ? templatesResult : templates.concat(templatesResult)
        );
        if (page >= pages) setIsReachingEnd(true);
      } catch (err: any) {
        console.log(err.response);
      }
    } else {
      try {
        const result = await Api.get(
          `/templates?categories=${categoryId}&query=${query}&amount=${ELEMENTS_PER_REQUEST}&page=${currentPage}&language=${cookie.locale}`
        );
        // console.log(result.data);
        // setTemplatesLanguageTotal(result.data.totalItems);
        const { templates: templatesResult, page, pages } = result.data;
        setTemplates(
          refresh ? templatesResult : templates.concat(templatesResult)
        );
      } catch (err: any) {
        console.log(err.response);
      }
    }

    setFetchedOnce(true);
    setIsLoading(false);
  };

  React.useEffect(() => {
    if (isDidMount) {
      setIsDidMount(false);
      return;
    }
    setDisplayingFallbackTemplates(false);
    setTemplates([]);

    templatesByLanguageAreOver.current = false;
    templatesLanguageTotal.current = null;
    setIsLoading(false);
    setIsReachingEnd(false);
    fetchData(true, delayedQuery);
  }, [delayedQuery]);

  React.useEffect(() => {
    if (displayingFallbackTemplates) return;

    if (!fetchedOnce) return;

    if (templates.length === 0 && !isLoading) {
      setDisplayingFallbackTemplates(true);

      templatesByLanguageAreOver.current = false;
      templatesLanguageTotal.current = null;
      setIsLoading(false);
      setIsReachingEnd(false);
      fetchData(false, "");
    }
  }, [templates.length, isLoading, fetchedOnce]);

  const checkChangesAndLoad = (loadCallback: () => unknown) => {
    if (numberOfChanges < NUMBER_OF_CHANGES_BEFORE_NEW_TEMPLATE_WARNING) {
      loadCallback();
      dispatch(ResetNumberOfChangesAction());
      return;
    }

    setShowConfirmLoadTemplate(true);
    confirmTemplateCbRef.current = loadCallback;
  };

  const confirmTemplateChange = () => {
    setShowConfirmLoadTemplate(false);

    dispatch(ResetNumberOfChangesAction());

    confirmTemplateCbRef.current?.();
  };

  const resetFilter = () => setQuery("");

  return (
    <div className={s.root} style={{ top: "14px" }}>
      {/* <SearchInput query={query} setQuery={setQuery}/> */}

      {displayingFallbackTemplates && (
        <>
          <p className={s.noTemplatesFound}>
            <Trans
              t={t}
              i18nKey="content.polotno.sidePanel.noTemplatesFound"
              values={{ keyword: delayedQuery }}
              components={{
                reset: <span className={s.textLink} onClick={resetFilter} />,
              }}
            />
          </p>

          <p className={s.youMayAlsoLike}>
            {i18n.polotno.sidePanel.youMayAlsoLike}:
          </p>
        </>
      )}
      <InfinityScrollSection
        store={store}
        loadWrapper={checkChangesAndLoad}
        columns={2}
        gridElements={templates}
        fetchData={(refresh: boolean) =>
          fetchData(refresh, displayingFallbackTemplates ? "" : delayedQuery)
        }
        isReachingEnd={isReachingEnd}
        mode="templates"
      />

      <ReplaceTemplateModal
        open={showConfirmLoadTemplate}
        onClose={() => setShowConfirmLoadTemplate(false)}
        onConfirm={confirmTemplateChange}
      />
    </div>
  );
});

export default TemplatesSection;
