import React from "react";
import s from "./StripeSections.module.scss";
import ContainerFluid from "../ContainerFluid";
import BtnPrimary from "../BtnPrimary";

interface StripeCTAProps {
  onClickBtn: any;
  titleText?: string;
  subtitleText?: string;
  btnText?: string;
  hasOval: boolean;
  local: any;
}

export const StripeCTA: React.FC<React.PropsWithChildren<StripeCTAProps>> = ({
  onClickBtn,
  titleText,
  subtitleText,
  btnText,
  hasOval,
  local,
}) => {
  const i18n = local("StripeCTA", { returnObjects: true });

  return (
    <section className={s.stripeCTA}>
      <ContainerFluid>
        <div className={s.content}>
          <div className={s.title}>
            <span>
              {titleText || i18n.title} <br />
              {/* <span className={s.titleOval}>
                {hasOval && <img src="/oval2.svg" />}
                {i18n.title2} <br />
              </span> */}
            </span>
          </div>
          <div className={s.subtitle}>{subtitleText || i18n.subtitle}</div>
          <div className={s.btnPrimary}>
            {/* <BtnPrimary onClick={onClickBtn}>{btnText}</BtnPrimary> */}
            <BtnPrimary onClick={onClickBtn}>{btnText || i18n.btn}</BtnPrimary>
          </div>
        </div>
      </ContainerFluid>
    </section>
  );
};

interface StripeTemplatesProps {
  data: any;
}

export const StripeTemplates: React.FC<
  React.PropsWithChildren<StripeTemplatesProps>
> = ({ data }) => {
  return (
    <section className={s.stripeTemplates}>
      <ContainerFluid>
        <div className={s.content}>
          <div className={s.text}>
            <h1 className={s.title}>{data.nameLocal}</h1>
            <h2 className={s.subtitle}>{data.text}</h2>
          </div>
          {/* <div className={s[data.imgClassName]}>
            <img src={data.src} alt={data.title} />
          </div>   */}
        </div>
      </ContainerFluid>
    </section>
  );
};

// export default StripeSection;
