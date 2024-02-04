import React from "react";
import s from "./Accordion.module.scss";
import clsx from "clsx";

import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";

interface AccordionProps {
  title: string;
  content: string;
}

const Accordion: React.FC<React.PropsWithChildren<AccordionProps>> = ({
  title,
  content,
}) => {
  // manual control of the accordion state has been done, because
  // it opens only by clicking on the MuiAccordionSummary element,
  // and it needs to open/close by clicking on the entire accordion area
  const [expanded, setExpanded] = React.useState(false);

  return (
    <MuiAccordion
      onClick={() => {
        setExpanded(!expanded);
      }}
      expanded={expanded}
      disableGutters
      className={clsx(s.accordion, "componentAccordion")}
    >
      <MuiAccordionSummary
        className={clsx(s.accordionTitle, "componentAccordionTitle")}
      >
        {title}
        <svg viewBox="0 0 6 10">
          <path
            d="M1.45222 0.644603L5.40234 4.59473L1.39462 8.60245"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </MuiAccordionSummary>
      <MuiAccordionDetails className={clsx(s.accordionDetails)}>
        <div className={s.accordionItem}>{content}</div>
      </MuiAccordionDetails>
    </MuiAccordion>
  );
};

export default Accordion;
