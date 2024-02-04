import React from "react";

import s from "./Text.module.scss";

interface FeatureTextProps {
  translations: Record<string, any>;
  pageData: any;
}

export const FeatureText: React.FC<FeatureTextProps> = ({ translations }) => {
  return (
    <section className={s.section}>
      {translations.content.text.steps.map((step: any, index: number) => {
        return (
          <div className={s.item} key={index}>
            <h4>{step.title}</h4>
            <p>{step.subtitle}</p>
          </div>
        );
      })}
    </section>
  );
};
