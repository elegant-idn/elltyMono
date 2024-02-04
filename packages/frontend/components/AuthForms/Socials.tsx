import React from "react";
import BtnSocial from "../BtnSocial";
import FormDivider from "../FormDivider";

const onClickRedirect = (goto: string) => () => {
  window.location.href = goto;
};

const SocialButton: React.FC<
  React.PropsWithChildren<{
    loginUrl: string;
    label: string;
    logo: string;
  }>
> = ({ loginUrl, label, logo }) => {
  return (
    <BtnSocial onClick={onClickRedirect(loginUrl)} src={logo}>
      {label}
    </BtnSocial>
  );
};

const SocialButtons: React.FC<
  React.PropsWithChildren<{ locale?: string; dividerLabel: string }>
> = ({ locale, dividerLabel }) => {
  return (
    <>
      {locale === "en" && (
        <>
          <FormDivider or={dividerLabel} />
          <SocialButton
            label="Google"
            logo="/auth/google.svg"
            loginUrl={`https://www.ellty.com/api/auth/google/login?from=${window.location.href}`}
          />
        </>
      )}

      {/* <SocialButton
        label="Facebook"
        logo="/auth/fb.svg"
        loginUrl="https://www.ellty.com/api/auth/facebook/login"
      />
      
      <SocialButton
        label="Apple"
        logo="/auth/apple.svg"
        loginUrl="https://www.ellty.com/api/auth/apple/login"
      /> */}
    </>
  );
};

export default SocialButtons;
