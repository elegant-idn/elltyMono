import React from "react";

import s from "./FeatureHero.module.scss";
import BtnPrimary from "../../BtnPrimary";
import Image from "next/image";
import { useMediaQuery } from "@mui/material";

interface FeatureHeroProps {
  translations: Record<string, any>;
  pageData: any;
}

export const FeatureHero: React.FC<FeatureHeroProps> = ({
  translations,
  pageData,
}) => {
  const imageHasBackground = useMediaQuery("(min-width: 1440px)");

  const heroTrans = translations.content.hero;

  return (
    <section className={s.section}>
      <div className={s.content}>
        <div className={s.text}>
          <h1 className={s.title}>{heroTrans.title}</h1>
          <p className={s.subtitle}>{heroTrans.subtitle}</p>

          <BtnPrimary className={s.CTA} onClickRedirect="/design">
            {heroTrans.CTA}
          </BtnPrimary>
        </div>

        <div
          className={s.img}
          style={{
            background: imageHasBackground ? pageData.imageGradient : undefined,
          }}
        >
          <Image
            src={`/feature/${pageData.slug}/${pageData.images.heroSection.src}`}
            width={pageData.images.heroSection.imageWidth}
            height={pageData.images.heroSection.imageHeight}
            layout="responsive"
            alt="block image"
            priority
          />
        </div>
      </div>
    </section>
  );
};
