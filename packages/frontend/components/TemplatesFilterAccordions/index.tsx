import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import clsx from "clsx";
import { nanoid } from "nanoid";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  SetActiveTemplatesCategory,
  ToggleFilterAction,
} from "../../redux/actions";
import { RootState } from "../../redux/store";
import s from "./TemplatesFilterAccordion.module.scss";

interface TemplatesFilterAccordionsProps {
  local: any;
}

const TemplatesFilterAccordions: React.FC<
  React.PropsWithChildren<TemplatesFilterAccordionsProps>
> = ({ local }) => {
  const { t } = useTranslation("categoriesSections");
  const categories = t("sections", {
    returnObjects: true,
    defaultValue: [],
  }) as any[];

  const dispatch = useDispatch();
  const activeTemplatesCategory = useSelector(
    (state: RootState) => state.mainReducer.activeTemplatesCategory
  );
  const router = useRouter();

  const [expanded, setExpanded] = React.useState<string | false>(false);
  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  const handleClickAccordion = (value: string) => {
    dispatch(SetActiveTemplatesCategory(value));
  };

  const Accordions = categories.map((item: any, index: any) => {
    // console.log(item.name);

    let accordionDetails;

    accordionDetails = item.sections.map((item: any) => {
      // console.log(item.name);
      return (
        <div
          key={nanoid(5)}
          onClick={() => {
            router.push(`/templates${item.value}`);
            dispatch(ToggleFilterAction(false));
          }}
          className={clsx(
            s.accordionItem,
            `/${router.query.id}` == item.value && 1 == 1 && s.active
          )}
        >
          <svg className={s[item.svg]}>
            <use href={`#${item.svg}`} />
          </svg>
          {item.name}
        </div>
      );
    });

    if (item.value == "popular") {
      accordionDetails = accordionDetails.slice(0, 12);
    }

    return (
      <Accordion
        key={index}
        // defaultExpanded={activeTemplatesCategory.find((s: any) => s == item.value)}
        expanded={activeTemplatesCategory.find((s: any) => s == item.value)}
        // expanded={expanded === `panel${index}`}
        defaultExpanded={item.value == "popular"}
        disableGutters
        className={s.accordion}
      >
        <AccordionSummary
          onClick={() => {
            handleClickAccordion(item.value);
          }}
          className={clsx(s.accordionTitle, "templatesAccordionTitle")}
        >
          {item.name}
          <svg viewBox="0 0 6 10">
            <path
              d="M1.45222 0.644603L5.40234 4.59473L1.39462 8.60245"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </AccordionSummary>
        <AccordionDetails className={clsx(s.accordionDetails)}>
          {/* limiting the number of elements in the accordion (for the "popular" accordion) */}
          {/* { accordionDetails.slice(0, 8) } */}
          {accordionDetails}
        </AccordionDetails>
      </Accordion>
    );
  });

  return <>{Accordions}</>;
};

export default TemplatesFilterAccordions;
