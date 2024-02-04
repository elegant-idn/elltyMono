import s from "./BtnOutline.module.scss";
import clsx from "clsx";
import { MouseEventHandler } from "react";
import Router from "next/router";

interface BtnOutlineProps {
  onClick?: MouseEventHandler | undefined;
  onClickRedirect?: string;
  disabled?: boolean;
  type?: any;
  variant: string;
  reff?: any;
  className?: string;
}

const BtnOutline: React.FC<React.PropsWithChildren<BtnOutlineProps>> = ({
  children,
  onClick,
  onClickRedirect,
  disabled,
  type,
  variant,
  reff,
  className,
}) => {
  if (onClickRedirect) {
    onClick = () => {
      Router.push(onClickRedirect);
    };
  }

  return (
    <button
      ref={reff}
      onClick={onClick}
      className={clsx(s.root, s[variant], disabled && s.disabled, className)}
      type={type || "button"}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default BtnOutline;
