import React from "react";
import s from "./TextPicture.module.scss";
import Image from "next/image";
import { useMediaQuery } from "@mui/material";

interface FeatureTextPictureProps {
  translations: Record<string, any>;
  pageData: any;
}

export const FeatureTextPicture: React.FC<FeatureTextPictureProps> = ({
  translations,
  pageData,
}) => {
  const isMobile = useMediaQuery("(max-width: 1100px)");
  const textPictureSections = translations.content.textPicture.sections;

  return (
    <section className={s.section}>
      {textPictureSections.map((section: any, index: number) => {
        const image = pageData.images.textPictureSection[index];

        const imageFirst = index % 2 === 0 && !isMobile;

        const imageElement = (
          <Image
            src={`/feature/${pageData.slug}/${image.src}`}
            width={image.imageWidth}
            height={image.imageHeight}
            layout="responsive"
            alt="block image"
          />
        );

        return (
          <div key={index} className={s.item}>
            {imageFirst && imageElement}

            <div className={s.textContainer}>
              <h2>{section.title}</h2>
              <p>{section.subtitle}</p>
            </div>

            {!imageFirst && imageElement}
          </div>
        );
      })}
    </section>
  );
};
