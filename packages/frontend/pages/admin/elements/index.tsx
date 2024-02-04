import React from "react";
import Head from "next/head";
import { NextPage } from "next";
import { nanoid } from "nanoid";
import clsx from "clsx";
import s from "./ElementsPage.module.scss";
import { useDispatch, useSelector } from "react-redux";
import {
  SetInitialSizesAction,
  SetInitialSectionAction,
} from "../../../redux/actions";
import { RootState } from "../../../redux/store";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import data from "../../../data/main";

import DashboardLayout from "../../../components/Layouts/DashboardLayout";
import AuthPage from "../../../components/AuthPage";
import AuthPageAdmin from "../../../components/AuthPageAdmin";
import PageLayout from "../../../components/Layouts/PageLayout";
import LinkBack from "../../../components/LinkBack";
import { useCookies } from "react-cookie";
import { Api } from "../../../api";
import Box from "@mui/material/Box";
import {
  DesignListElement,
  DesignListHeader,
} from "../../../components/Dashboard/DesignElements";
import Alert from "../../../components/Alert";
import BtnSecondary from "../../../components/BtnSecondary";
import SelectedHeader from "../../../components/Dashboard/SelectedHeader";
import ConfirmationModal from "../../../components/ConfirmationModal";
import { Formik } from "formik";
import axios from "axios";
import SelectAdmin from "../../../components/SelectAdmin";
import { InputCheckbox } from "../../../components/Inputs";
import BtnOutline from "../../../components/BtnOutline";
import { ISidePanelData } from "../../../components/Dashboard/SidePanel";
import useTypedSelector from "../../../utils/useTypedSelector";

interface ElementsPageProps {
  cookieUser: any;
  userToken: string;
}

const ElementsPage: NextPage<ElementsPageProps> = ({
  cookieUser,
  userToken,
}) => {
  const { t }: any = useTranslation("index");
  const { t: adminPageI18n }: any = useTranslation("adminPage");
  const i18nTemplatesPage = adminPageI18n("templatesPage", {
    returnObjects: true,
  });
  const i18nSidePanel = adminPageI18n("sidePanel", { returnObjects: true });
  const i18nElementsPage = adminPageI18n("elementsPage", {
    returnObjects: true,
  });
  const user = useTypedSelector((state) => state.mainReducer.user);

  const sidePanelData = React.useRef<ISidePanelData[]>([]);
  for (let i = 0; i < data.adminSidePanel.length; i++) {
    if (sidePanelData.current.length === data.adminSidePanel.length) break;

    sidePanelData.current.push({
      text: i18nSidePanel[i].text,
      value: data.adminSidePanel[i].value,
      svg: data.adminSidePanel[i].svg,
    });
  }

  const [cookie] = useCookies();
  const [isLoadingDelete, setIsLoadingDelete] = React.useState(false);
  const [confirmDeleteModalIsOpen, setConfirmDeleteModalIsOpen] =
    React.useState<boolean>(false);
  // shows the add new template window
  const [addingElem, setAddingElem] = React.useState(false);
  // element editing mode
  const [editingElem, setEditingElem] = React.useState(false);
  // shows the text of the successful template addition
  const [elemAdded, setElemAdded] = React.useState(false);
  // this data comes from the database
  const [templates, setTemplates] = React.useState<any>([]);
  const [tags, setTags] = React.useState<any>([]);
  const [categories, setCategories] = React.useState<any>([]);
  const [colors, setColors] = React.useState<any>([]);
  // lists that are displayed on the page
  const [designElementsList, setDesignElementsList] = React.useState<any>();
  // this array stores the _id of each element that is selected using the checkbox
  const [selectedElements, setSelectedElements] = React.useState<any>([]);

  // used to display red text when saving a template (create/edit)
  const [saveElemErrorText, setSaveElemErrorText] = React.useState("");

  const [templateTitle, setTemplateTitle] = React.useState("");
  const [categoriesSelectValue, setCategoriesSelectValue] = React.useState([]);
  const [categoriesSearchTerm, setCategoriesSearchTerm] = React.useState("");
  const [tagSelectValue, setTagSelectValue] = React.useState([]);
  const [tagSearchTerm, setTagSearchTerm] = React.useState("");
  // several colors can be selected in this palette at the same time
  const [paletteValue, setPaletteValue] = React.useState([]);

  const inputJsonRef = React.useRef<any>();
  const [jsonValue, setJsonValue] = React.useState({});
  const [jsonValueName, setJsonValueName] = React.useState("");
  const [jsonSizes, setJsonSizes] = React.useState({
    width: 100,
    height: 100,
  });

  const [typeCheckbox, setTypeCheckbox] = React.useState<string>("free"); // free/pro

  // used to determine which fields have been changed and send them to api/templates/edit
  const [titleFieldIsDirty, setTitleFieldIsDirty] = React.useState(false);
  const [categoriesFieldIsDirty, setCategoriesFieldIsDirty] =
    React.useState(false);
  const [tagFieldIsDirty, setTagFieldIsDirty] = React.useState(false);
  const [colorsFieldIsDirty, setColorsFieldIsDirty] = React.useState(false);
  const [jsonFieldIsDirty, setJsonFieldIsDirty] = React.useState(false);
  const [imageFieldIsDirty, setImageFieldIsDirty] = React.useState(false);
  const [typeCheckboxIsDirty, setTypeCheckboxIsDirty] = React.useState(false);

  const handleChangeTemplatesField = (value: any) => {
    setCategoriesSelectValue(value);
    setCategoriesFieldIsDirty(true);
  };

  const handleChangeTagField = (value: any) => {
    setTagSelectValue(value);
    setTagFieldIsDirty(true);
  };

  const elementsOnPage = 34;
  const [paginationPageTotal, setPaginationPageTotal] =
    React.useState<number>(1);
  const [templatesTotal, setTemplatesTotal] = React.useState<number>(0);
  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const [paginationElemets, setPaginationElements] = React.useState<any>();

  React.useEffect(() => {
    const arr = [];
    for (let i = 1; i <= paginationPageTotal; i++) {
      arr.push(i);
    }

    let elements = [];

    const paginationItem = (item: any) => {
      return (
        <div
          key={nanoid(5)}
          className={clsx(s.paginationItem, currentPage == item && s.active)}
          onClick={() => {
            setCurrentPage(item);
          }}
        >
          {item}
        </div>
      );
    };

    // if ((currentPage - 1) > 2) {
    //   elements.push (
    //     <div
    //       key={nanoid(5)}
    //       className={s.paginationItem}
    //       onClick={() => {setCurrentPage(1)}}
    //     >
    //       {1}
    //     </div>
    //   )
    // }

    // if ((currentPage - 1) > 3) {
    //   elements.push (
    //     <div className={s.paginationItem}>
    //       ...
    //     </div>
    //   )
    // }

    // if the first page
    if (currentPage == 1) {
      // show page 1 to 5 (1 is active)
      elements.push(
        arr.slice(currentPage - 1, currentPage + 4).map((item: any) => {
          return paginationItem(item);
        })
      );

      if (arr.length - currentPage > 5) {
        elements.push(<div className={s.paginationItem}>...</div>);
      }

      if (arr.length - currentPage > 4) {
        elements.push(paginationItem(arr.length));
      }

      // if the second page
    } else if (currentPage == 2) {
      // show page 1 to 5 (2 is active)
      elements.push(
        arr.slice(currentPage - 2, currentPage + 3).map((item: any) => {
          return paginationItem(item);
        })
      );

      if (arr.length - currentPage > 4) {
        elements.push(<div className={s.paginationItem}>...</div>);
      }

      if (arr.length - currentPage > 3) {
        elements.push(paginationItem(arr.length));
      }

      // if the last page
    } else if (currentPage == arr.length && paginationPageTotal > 4) {
      elements.push(
        arr.slice(currentPage - 5, currentPage + 1).map((item: any) => {
          return paginationItem(item);
        })
      );

      if (currentPage - 1 > 5) {
        elements.unshift(<div className={s.paginationItem}>...</div>);
      }

      if (currentPage - 1 > 4) {
        elements.unshift(paginationItem(1));
      }

      // if the second-to-last page
    } else if (currentPage == arr.length - 1 && paginationPageTotal > 4) {
      elements.push(
        arr.slice(currentPage - 4, currentPage + 2).map((item: any) => {
          return paginationItem(item);
        })
      );

      if (currentPage - 1 > 4) {
        elements.unshift(<div className={s.paginationItem}>...</div>);
      }

      if (currentPage - 1 > 3) {
        elements.unshift(paginationItem(1));
      }
    } else {
      elements.push(
        arr.slice(currentPage - 3, currentPage + 2).map((item: any) => {
          return paginationItem(item);
        })
      );

      if (currentPage - 1 > 3) {
        elements.unshift(<div className={s.paginationItem}>...</div>);
      }

      if (currentPage - 1 > 2) {
        elements.unshift(paginationItem(1));
      }

      if (arr.length - currentPage > 3) {
        elements.push(<div className={s.paginationItem}>...</div>);
      }

      if (arr.length - currentPage > 2) {
        elements.push(paginationItem(arr.length));
      }
    }

    setPaginationElements(elements);
  }, [currentPage, paginationPageTotal]);

  React.useEffect(() => {
    Api.get(`/elements?amount=${elementsOnPage}&offset=${currentPage}`)
      .then((result) => {
        console.log(result.data);
        setTemplates(result.data.elements);
        setTemplatesTotal(result.data.totalItems);
        setPaginationPageTotal(result.data.pages);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [currentPage]);

  const setInputValues = (
    templateTitle: string,
    errorText: string,
    categoriesSelectValue: [],
    CategoriesSearchTerm: string,
    TagSelectValue: [],
    TagSearchTerm: string,
    PaletteValue: [],
    TypeValue: string,
    JsonValue: {},
    JsonValueName: string
  ) => {
    setTemplateTitle(templateTitle);
    setSaveElemErrorText(errorText);
    setCategoriesSelectValue(categoriesSelectValue);
    // setCategoriesSearchTerm(CategoriesSearchTerm)
    setTagSelectValue(TagSelectValue);
    // setTagSearchTerm(TagSearchTerm)
    setPaletteValue(PaletteValue);
    setTypeCheckbox(TypeValue);
    setJsonValue(JsonValue);
    setJsonValueName(JsonValueName);

    setTitleFieldIsDirty(false);
    setCategoriesFieldIsDirty(false);
    setTagFieldIsDirty(false);
    setColorsFieldIsDirty(false);
    setTagFieldIsDirty(false);
    setJsonFieldIsDirty(false);
    setImageFieldIsDirty(false);
  };

  const togglePaletteValue = (item: any) => {
    const idx = paletteValue.findIndex((s: any) => s.value == item.value);

    paletteValue.find((s: any) => s.value == item.value)
      ? setPaletteValue([
          ...paletteValue.slice(0, idx),
          ...paletteValue.slice(idx + 1),
        ])
      : // @ts-ignore
        setPaletteValue([...paletteValue, item]);
  };

  const palette = colors.map((item: any) => {
    return (
      <Box
        key={item._id}
        className={clsx(
          s.paletteColor,
          paletteValue.find((s: any) => s.value == item.value) && s.active
        )}
        sx={{ backgroundColor: item.hex }}
        onClick={() => {
          togglePaletteValue(item), setColorsFieldIsDirty(true);
        }}
      >
        {/* check svg */}
        <svg
          width="14"
          height="10"
          viewBox="0 0 14 10"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M5.86539 9.96399L12.7624 2.77956C13.2871 2.23306 13.2694 1.36472 12.7229 0.840069C12.1763 0.315423 11.308 0.333144 10.7834 0.87965L5.5249 6.35721L2.43759 4.16452C1.81994 3.72585 0.963627 3.87094 0.524956 4.48859C0.0862845 5.10624 0.231375 5.96256 0.849024 6.40123L5.86539 9.96399Z"
          />
        </svg>
      </Box>
    );
  });

  React.useEffect(() => {
    Api.get(`/elements?amount=${elementsOnPage}&offset=0`)
      .then((result) => {
        // console.log(result.data);
        setTemplates(result.data.elements);
        setTemplatesTotal(result.data.totalItems);
        setPaginationPageTotal(result.data.pages);
        setCurrentPage(1);
      })
      .catch((err) => {
        console.log(err);
      });

    Api.get("/categories")
      .then((result) => {
        // console.log(result.data);
        setCategories(result.data);
      })
      .catch((err) => {
        console.log(err);
      });

    Api.get("/tags")
      .then((result) => {
        console.log(result);
        setTags(result.data);
      })
      .catch((err) => {
        console.log(err);
      });

    Api.get("/colors")
      .then((result) => {
        // console.log(result);
        setColors(result.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const onToggleSelect = (item?: any, selectAll?: boolean) => {
    if (selectAll) {
      !selectedElements.length
        ? setSelectedElements(
            templates.map((item: any) => {
              return item._id;
            })
          )
        : setSelectedElements([]);
      return;
    }

    const idx = selectedElements.findIndex((s: any) => s == item._id);
    selectedElements.find((s: any) => s == item._id)
      ? setSelectedElements([
          ...selectedElements.slice(0, idx),
          ...selectedElements.slice(idx + 1),
        ])
      : // @ts-ignore
        setSelectedElements([...selectedElements, item._id]);
  };

  // the templates state changes when a new template is added
  React.useEffect(() => {
    let elems = templates.map((item: any) => {
      const isActive = selectedElements.find((s: any) => s == item._id);

      return item ? (
        <DesignListElement
          userTemplate={false}
          key={item._id}
          item={item}
          selectable
          isSelected={isActive}
          onChangeCheckbox={() => {
            onToggleSelect(item);
          }}
          buttonMore={false}
        />
      ) : null;
    });
    setDesignElementsList(elems);
  }, [templates, selectedElements]);

  if (user.role !== "admin")
    return (
      <PageLayout userToken={userToken}>
        <AuthPageAdmin local={t} />
      </PageLayout>
    );

  return (
    <PageLayout userToken={userToken}>
      <Head>
        <title>{t("globalTitle")}</title>
      </Head>
      <DashboardLayout
        userToken={userToken}
        cookieUser={cookieUser}
        authorized={cookieUser ? true : false}
        adminPage
        sidePanelData={sidePanelData.current}
        sidePanelBaseUrl="/admin"
        local={t}
      >
        <div className={s.root}>
          <div className={s.blockTitle}>{i18nElementsPage.title}</div>

          {!addingElem && !editingElem ? (
            <>
              {elemAdded && (
                <Alert variant="success">{i18nElementsPage.elementAdded}</Alert>
              )}

              <div className={s.addBtn}>
                <BtnSecondary
                  onClick={() => {
                    setAddingElem(true);
                  }}
                >
                  {i18nElementsPage.addElement}
                </BtnSecondary>
              </div>

              <div className={s.blockSubtitle}>
                {i18nElementsPage.allElements} ({templatesTotal})
              </div>

              <SelectedHeader
                local={i18nTemplatesPage.selectTable}
                selectedCount={selectedElements.length}
                onClickEdit={() => {
                  const elem = templates.find(
                    (s: any) => s._id == selectedElements[0]
                  );
                  console.log(elem);
                  // console.log(elem);
                  setInputValues(
                    elem.title,
                    "", // errorText
                    elem.categories, // categoriesSelectValue
                    "", // CategoriesSearchTerm
                    elem.tags, // TagSelectValue
                    "", // TagSearchTerm
                    elem.colors, // PaletteValue
                    elem.status, // TypeValue
                    {}, // JsonValue
                    "" // JsonValueName
                  );
                  setEditingElem(true);
                }}
                onClickDelete={() => {
                  setConfirmDeleteModalIsOpen(true);
                }}
              />

              <ConfirmationModal
                isOpen={confirmDeleteModalIsOpen}
                isLoading={isLoadingDelete}
                onClose={() => {
                  setConfirmDeleteModalIsOpen(false);
                }}
                onConfirm={() => {
                  setIsLoadingDelete(true);
                  const body = {
                    data: {
                      ids: selectedElements,
                    },
                    headers: {
                      Authorization: cookie.user.accessToken,
                    },
                  };

                  Api.delete("/elements/delete", body)
                    .then((result) => {
                      setSelectedElements([]);

                      Api.get(`/elements?amount=${elementsOnPage}&offset=0`)
                        .then((result) => {
                          // console.log(result);
                          setTemplates(result.data.elements);
                          setTemplatesTotal(result.data.totalItems);
                          setPaginationPageTotal(result.data.pages);
                          setCurrentPage(1);
                        })
                        .catch((err) => {
                          console.log(err);
                        })
                        .finally(() => {
                          setIsLoadingDelete(false);
                          setConfirmDeleteModalIsOpen(false);
                        });
                    })
                    .catch((err) => {
                      console.log(err);
                    })
                    .finally(() => {});
                }}
                count={selectedElements.length}
              />

              <DesignListHeader
                selectable
                isActive={templates?.length == selectedElements.length}
                onChangeCheckbox={() => {
                  onToggleSelect(null, true);
                }}
              />
              <div className={s.list}>{designElementsList}</div>

              <div className={s.pagination}>
                <div
                  className={clsx(
                    s.paginationArrow,
                    s.left,
                    currentPage == 1 && s.disabled
                  )}
                  onClick={() => {
                    currentPage !== 1 && setCurrentPage(currentPage - 1);
                  }}
                >
                  <svg width="6" height="10" viewBox="0 0 6 10" fill="none">
                    <path
                      d="M4.99309 1L1.04297 4.95013L5.05069 8.95785"
                      stroke="#36373C"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                {paginationElemets}

                <div
                  className={clsx(
                    s.paginationArrow,
                    s.right,
                    currentPage == paginationPageTotal && s.disabled
                  )}
                  onClick={() => {
                    currentPage !== paginationPageTotal &&
                      setCurrentPage(currentPage + 1);
                  }}
                >
                  <svg width="6" height="10" viewBox="0 0 6 10" fill="none">
                    <path
                      d="M4.99309 1L1.04297 4.95013L5.05069 8.95785"
                      stroke="#36373C"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className={s.blockSubtitle}>
                {i18nElementsPage.addNewElement}
              </div>

              {saveElemErrorText && (
                <div className={s.saveElemErrorText}>{saveElemErrorText}</div>
              )}

              <Formik
                initialValues={{
                  title: "",
                  categories: "",
                  colors: "",
                  tags: "",
                  data: [],
                  status: "",
                }}
                onSubmit={(values, actions) => {
                  const config = {
                    headers: {
                      Authorization: cookie.user.accessToken,
                    },
                  };

                  // const categories = categoriesSelectValue;
                  const categories = categoriesSelectValue
                    .map((item: any) => {
                      return item.value.trim();
                    })
                    .join(",");
                  // const tags = tagSelectValue;
                  const tags = tagSelectValue
                    .map((item: any) => {
                      return item.value.trim();
                    })
                    .join(",");
                  // const colors = paletteValue.join(',')
                  const colors = paletteValue
                    .map((item: any) => {
                      return item.value;
                    })
                    .join(",");

                  // console.log(colors);

                  let formData = new FormData();
                  formData.append("title", templateTitle);
                  formData.append("categories", categories);
                  formData.append("tags", tags);
                  formData.append("colors", colors);
                  formData.append("status", typeCheckbox);
                  // @ts-ignore
                  formData.append("data", jsonValue);
                  // @ts-ignore
                  // formData.append("width", String(jsonSizes.width));
                  // @ts-ignore
                  // formData.append("height", String(jsonSizes.height));

                  let editFormData = new FormData();
                  titleFieldIsDirty &&
                    editFormData.append("title", templateTitle);
                  categoriesFieldIsDirty &&
                    editFormData.append("categories", categories);
                  tagFieldIsDirty && editFormData.append("tags", tags);
                  colorsFieldIsDirty && editFormData.append("colors", colors);
                  typeCheckboxIsDirty &&
                    editFormData.append("status", typeCheckbox);
                  // @ts-ignore
                  jsonFieldIsDirty && editFormData.append("data", jsonValue);
                  // console.log(jsonSizes);
                  // @ts-ignore
                  // jsonFieldIsDirty && editFormData.append("width", String(jsonSizes.width));
                  // @ts-ignore
                  // jsonFieldIsDirty && editFormData.append("height", String(jsonSizes.height));
                  // @ts-ignore
                  // editFormData.append("json", jsonValue);

                  // console.log(jsonValue);

                  // if(!Object.keys(jsonValue).length) {
                  //   // console.log('here');
                  //   actions.setSubmitting(false);
                  //   return setSaveElemErrorText("You forgot to attach json")
                  // }

                  // if(!Object.keys(jsonValue).length) {
                  //   // console.log('here');
                  //   actions.setSubmitting(false);
                  //   return setSaveElemErrorText("You forgot to attach json")
                  // }

                  // !jsonValue ? return setSaveElemErrorText("I NEED JSON")
                  // console.log(editingElem);

                  editingElem
                    ? Api.put(
                        `/elements/edit/${selectedElements[0]}`,
                        editFormData,
                        config
                      )
                        .then((result) => {
                          // console.log(result);
                          setElemAdded(true);
                          setAddingElem(false);
                          setEditingElem(false);

                          setInputValues(
                            "", // templateTitle
                            "", // errorText
                            [], // categoriesSelectValue
                            "", // CategoriesSearchTerm
                            [], // TagSelectValue
                            "", // TagSearchTerm
                            [], // PaletteValue
                            "free", // TypeValue
                            {}, // JsonValue
                            "" // JsonValueName
                          );

                          Api.get(`/elements?amount=${elementsOnPage}&offset=0`)
                            .then((result) => {
                              // console.log(result);
                              setTemplates(result.data.elements);
                              setTemplatesTotal(result.data.totalItems);
                              setPaginationPageTotal(result.data.pages);
                              setCurrentPage(1);
                            })
                            .catch((err) => {
                              console.log(err);
                            });
                        })
                        .catch((err) => {
                          if (axios.isAxiosError(err)) {
                            console.log(err?.response?.data.message);
                            // alert(reason)
                            err?.response?.data.message
                              ? setSaveElemErrorText(
                                  err?.response?.data.message
                                )
                              : setSaveElemErrorText(
                                  "Something went wrong, please try again."
                                );
                          }

                          console.log(err.response);
                          setElemAdded(false);
                        })
                        .finally(() => {
                          actions.setSubmitting(false);
                        })
                    : Api.post("/elements/create", formData, config)
                        .then((result) => {
                          console.log(result);
                          if (result.status === 201) {
                            setElemAdded(true);
                            setAddingElem(false);
                            // setEditingElem(false)
                            setSaveElemErrorText("");

                            setInputValues(
                              "", // templateTitle
                              "", // errorText
                              [], // categoriesSelectValue
                              "", // CategoriesSearchTerm
                              [], // TagSelectValue
                              "", // TagSearchTerm
                              [], // PaletteValue
                              "free", // TypeValue
                              {}, // JsonValue
                              "" // JsonValueName
                            );

                            Api.get(
                              `/elements?amount=${elementsOnPage}&offset=0`
                            )
                              .then((result) => {
                                console.log(result);
                                setTemplates(result.data.elements);
                                setTemplatesTotal(result.data.totalItems);
                                setPaginationPageTotal(result.data.pages);
                                setCurrentPage(1);
                              })
                              .catch((err) => {
                                console.log(err);
                              });
                          }
                        })
                        .catch((err) => {
                          if (axios.isAxiosError(err)) {
                            console.log(err?.response?.data.message);
                            // alert(reason)
                            err?.response?.data.message
                              ? setSaveElemErrorText(
                                  err?.response?.data.message
                                )
                              : setSaveElemErrorText(
                                  "Something went wrong, please try again."
                                );
                          }

                          console.log(err.response);
                          setElemAdded(false);
                          // setSaveElemErrorText('Something went wrong, please try again');
                        })
                        .finally(() => {
                          actions.setSubmitting(false);
                        });

                  // axios({
                  //   method: "post",
                  //   url: "https://www.ellty.com/api/templates/create",
                  //   data: formData,
                  //   headers: { "Content-Type": "multipart/form-data" },
                  // })
                  //   .then(function (response) {
                  //     //handle success
                  //     console.log(response);
                  //   })
                  //   .catch(function (response) {
                  //     //handle error
                  //     console.log(response.response);
                  //   }).finally(() => {
                  //     actions.setSubmitting(false);
                  //   });
                }}
              >
                {(props) => (
                  <div className={s.wrapper}>
                    <form onSubmit={props.handleSubmit} className={s.form}>
                      <div className={s.inputGroup}>
                        <label>{i18nTemplatesPage.nameTemplate}</label>
                        <input
                          type="text"
                          name="title"
                          onChange={(e) => {
                            setTemplateTitle(e.target.value);
                            setTitleFieldIsDirty(true);
                          }}
                          value={templateTitle}
                        />
                      </div>

                      <div className={s.inputGroup}>
                        <label>{i18nTemplatesPage.categoriesTemplate}</label>
                        <div className={s.select}>
                          <SelectAdmin
                            elemName="categories"
                            getElemName="categories"
                            updateElements={setCategories}
                            elements={categories}
                            selectedElements={categoriesSelectValue}
                            changeSelectedElements={handleChangeTemplatesField}
                            searchTerm={categoriesSearchTerm}
                            changeSearchTerm={setCategoriesSearchTerm}
                          />
                        </div>
                      </div>

                      <div className={s.inputGroup}>
                        <label>{i18nTemplatesPage.tagsTemplate}</label>
                        <div className={s.select}>
                          <SelectAdmin
                            elemName="tags"
                            getElemName="tags"
                            updateElements={setTags}
                            elements={tags}
                            selectedElements={tagSelectValue}
                            changeSelectedElements={handleChangeTagField}
                            searchTerm={tagSearchTerm}
                            changeSearchTerm={setTagSearchTerm}
                          />
                        </div>
                      </div>

                      <div className={s.inputGroup}>
                        <label>{i18nTemplatesPage.colorsTemplate}</label>
                        <div className={s.palette}>{palette}</div>
                      </div>

                      <div className={s.inputGroup}>
                        <label>{i18nTemplatesPage.typeTemplate}</label>
                        <div className={s.typeCheckboxWrapper}>
                          <span>{i18nTemplatesPage.proTemplate}</span>
                          <InputCheckbox
                            onChange={() => {
                              setTypeCheckbox("pro");
                              setTypeCheckboxIsDirty(true);
                            }}
                            value={"type"}
                            checked={!!(typeCheckbox == "pro")}
                            variant="bw"
                          />
                          <span>{i18nTemplatesPage.freeTemplate}</span>
                          <InputCheckbox
                            onChange={() => {
                              setTypeCheckbox("free");
                              setTypeCheckboxIsDirty(true);
                            }}
                            value={"type"}
                            checked={!!(typeCheckbox == "free")}
                            variant="bw"
                          />
                        </div>
                      </div>

                      <div className={s.uploadFileGroup}>
                        <div className={s.labelText}>
                          {i18nElementsPage.fileTitle}
                        </div>

                        <div className={s.uploadGroup}>
                          {jsonValueName && (
                            <div className={s.fileName}>{jsonValueName}</div>
                          )}

                          <label htmlFor="uploadJson">
                            {i18nTemplatesPage.chooseTemplateImg}
                          </label>
                          <input
                            ref={inputJsonRef}
                            type="file"
                            name="json"
                            id="uploadJson"
                            onChange={(event) => {
                              setJsonFieldIsDirty(true);
                              // @ts-ignore
                              setJsonValue(event.currentTarget.files[0]);
                              setJsonValueName(
                                // @ts-ignore
                                String(event.currentTarget.files[0].name)
                              );
                              // @ts-ignore
                              // new Response(event.currentTarget.files[0]).json().then(json => {
                              //   // setSaveElemErrorText('')
                              //   // setJsonValue(json)
                              //   setJsonSizes({ width: json.width, height: json.height })
                              // }, err => {
                              //   console.log(err);
                              //   setSaveElemErrorText('Select the correct json')
                              //   // setJsonValue({})
                              //   // setJsonValueName('')
                              // })
                            }}
                          />

                          <button
                            type="button"
                            onClick={() => {
                              (inputJsonRef.current.value = ""),
                                setJsonValue({}),
                                setJsonValueName("");
                            }}
                          >
                            {i18nTemplatesPage.removeTemplateImg}
                          </button>
                        </div>
                        {/* ./uploadGroup */}
                      </div>

                      {/* <input
                        type="file"
                        name="file"
                        id="file"
                        className="input-file"
                        onChange={(event) => {
                          console.log(event?.currentTarget.files[0].name);
                          new Response(event?.currentTarget.files[0]).json().then(json => {
                            setSaveElemErrorText('')
                            setJsonValue(json)
                          }, err => {
                            setSaveElemErrorText('Select the correct json')
                          })
                        }}
                      /> */}

                      <div className={s.btnWrap}>
                        <BtnOutline
                          type="submit"
                          variant="blue"
                          disabled={props.isSubmitting}
                        >
                          {i18nTemplatesPage.saveTemplate}
                        </BtnOutline>
                        <BtnOutline
                          variant="red"
                          onClick={() => {
                            // complete reset of all forms when closing the window with the addition of elements
                            setInputValues(
                              "", // templateTitle
                              "", // errorText
                              [], // categoriesSelectValue
                              "", // CategoriesSearchTerm
                              [], // TagSelectValue
                              "", // TagSearchTerm
                              [], // PaletteValue
                              "free", // TypeValue
                              {}, // JsonValue
                              "" // JsonValueName
                            );
                            setAddingElem(false);
                            setEditingElem(false);
                          }}
                        >
                          {i18nTemplatesPage.cancelTemplate}
                        </BtnOutline>
                      </div>
                    </form>
                  </div>
                )}
              </Formik>
            </>
          )}
        </div>
      </DashboardLayout>
    </PageLayout>
  );
};

// @ts-ignore
export async function getServerSideProps({ req, res, locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale || req.cookies.locale || "en", [
        "common",
        "index",
        "AuthModal",
        "Checkout",
        "AdminPageAuth",
        "adminPage",
        "Dashboard",
      ])),
      cookieUser: !!req.cookies.user && (JSON.parse(req.cookies.user) || ""),
      userToken: !!req.cookies.user_token && (req.cookies.user_token || null),
    },
  };
}

export default ElementsPage;
