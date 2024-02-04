import React from "react";

import s from "./HowTo.module.scss";
import BtnPrimary from "../../BtnPrimary";
import Image from "next/image";

interface FeatureHowToProps {
  translations: Record<string, any>;
  pageData: any;
}

export const FeatureHowTo: React.FC<FeatureHowToProps> = ({ translations }) => {
  const howToTrans = translations.content.howTo;

  return (
    <section className={s.section}>
      <h2>{howToTrans.title}</h2>

      <div className={s.imgContainer}>
        <Image
          src={`/how-to.png`}
          width={740}
          height={436}
          layout="responsive"
          alt="block image"
        />
      </div>

      <div className={s.items}>
        {howToTrans.steps.map((step: any, index: number) => {
          return (
            <div key={index} className={s.item}>
              <h4>{step.title}</h4>
              <p>{step.subtitle}</p>
            </div>
          );
        })}
      </div>

      <BtnPrimary className={s.btn} onClickRedirect="/design">
        {howToTrans.CTA}
      </BtnPrimary>
    </section>
  );
};
