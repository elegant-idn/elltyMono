import React from "react";
import s from "./TextIcons.module.scss";

interface FeatureTextIconsProps {
  translations: Record<string, any>;
  pageData: any;
}

const UploadIcon = () => (
  <svg
    width="20"
    height="19"
    viewBox="0 0 20 19"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M2.8 13.0907C1.71461 12.3537 1 11.0984 1 9.67391C1 7.53413 2.61236 5.7764 4.67177 5.5829C5.09303 2.98325 7.31822 1 10 1C12.6818 1 14.907 2.98325 15.3282 5.5829C17.3876 5.7764 19 7.53413 19 9.67391C19 11.0985 18.2854 12.3537 17.2 13.0907M6.4 12.8696L10 9.21739M10 9.21739L13.6 12.8696M10 9.21739V17.4348"
      stroke="#1F2128"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ActionIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 22 22"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M5.5 12L6.28446 13.5689C6.54995 14.0999 6.68269 14.3654 6.86003 14.5954C7.01739 14.7996 7.20041 14.9826 7.40455 15.14C7.63462 15.3173 7.9001 15.4501 8.43108 15.7155L10 16.5L8.43108 17.2845C7.9001 17.5499 7.63462 17.6827 7.40455 17.86C7.20041 18.0174 7.01739 18.2004 6.86003 18.4046C6.68269 18.6346 6.54995 18.9001 6.28446 19.4311L5.5 21L4.71554 19.4311C4.45005 18.9001 4.31731 18.6346 4.13997 18.4046C3.98261 18.2004 3.79959 18.0174 3.59545 17.86C3.36538 17.6827 3.0999 17.5499 2.56892 17.2845L1 16.5L2.56892 15.7155C3.0999 15.4501 3.36538 15.3173 3.59545 15.14C3.79959 14.9826 3.98261 14.7996 4.13997 14.5954C4.31731 14.3654 4.45005 14.0999 4.71554 13.5689L5.5 12Z"
      stroke="#1F2128"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M14 1L15.1786 4.06442C15.4606 4.79765 15.6016 5.16426 15.8209 5.47264C16.0153 5.74595 16.254 5.98475 16.5274 6.17909C16.8357 6.39836 17.2024 6.53937 17.9356 6.82138L21 8L17.9356 9.17862C17.2024 9.46063 16.8357 9.60164 16.5274 9.82091C16.254 10.0153 16.0153 10.254 15.8209 10.5274C15.6016 10.8357 15.4606 11.2024 15.1786 11.9356L14 15L12.8214 11.9356C12.5394 11.2024 12.3984 10.8357 12.1791 10.5274C11.9847 10.254 11.746 10.0153 11.4726 9.82091C11.1643 9.60164 10.7976 9.46063 10.0644 9.17862L7 8L10.0644 6.82138C10.7976 6.53937 11.1643 6.39836 11.4726 6.17909C11.746 5.98475 11.9847 5.74595 12.1791 5.47264C12.3984 5.16426 12.5394 4.79765 12.8214 4.06442L14 1Z"
      stroke="#1F2128"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const DownloadIcon = () => (
  <svg
    width="20"
    height="19"
    viewBox="0 0 20 19"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M15 8L10 13M10 13L5 8M10 13L10 0.999999"
      stroke="#1F2128"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M0.999998 12V13.2C0.999998 14.8802 0.999998 15.7202 1.32698 16.362C1.6146 16.9265 2.07354 17.3854 2.63803 17.673C3.27976 18 4.11984 18 5.8 18L14.2 18C15.8802 18 16.7202 18 17.362 17.673C17.9265 17.3854 18.3854 16.9265 18.673 16.362C19 15.7202 19 14.8802 19 13.2V12"
      stroke="#1F2128"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const FeatureTextIcons: React.FC<FeatureTextIconsProps> = ({
  translations,
}) => {
  const textIconsTrans = translations.content.textIcons;

  const items = [
    {
      ...textIconsTrans.upload,
      Icon: UploadIcon,
    },
    {
      ...textIconsTrans.action,
      Icon: ActionIcon,
    },
    {
      ...textIconsTrans.download,
      Icon: DownloadIcon,
    },
  ];

  return (
    <section className={s.section}>
      <h2>{textIconsTrans.title}</h2>

      <div className={s.items}>
        {items.map((item, index) => {
          return (
            <div key={index} className={s.item}>
              <div className={s.iconContainer}>
                <item.Icon />
              </div>

              <div className={s.textContainer}>
                <h4>{item.title}</h4>
                <p>{item.subtitle}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
