import { nanoid } from "nanoid";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import React from "react";
import s from "./Tags.module.scss";

interface FeatureTagsProps {
  translations: Record<string, any>;
  pageData: any;
}

export const FeatureTags: React.FC<FeatureTagsProps> = ({ pageData }) => {
  const { t, i18n } = useTranslation("feature-page/common");

  const tagsToRender = pageData.tagLinks.filter((tag: any) => {
    return !tag?.excludeFromLocales.includes(i18n.language);
  });

  return (
    <div className={s.section}>
      <h2>{t("explore")}</h2>

      <div className={s.tagsWrapper}>
        {tagsToRender.map((tag: any) => {
          const text = t(`tags.${tag.href}`) ?? tag.value;
          return (
            <Link key={nanoid(5)} href={`/features/${tag.href}`} passHref>
              <a className={s.tagItem}>{text}</a>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
