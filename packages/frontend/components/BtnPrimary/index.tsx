import clsx from "clsx";
import Router from "next/router";
import { MouseEventHandler } from "react";
import s from "./BtnPrimary.module.scss";

export interface BtnPrimatyProps {
  onClick?: MouseEventHandler | undefined;
  onClickRedirect?: string;
  disabled?: boolean;
  loading?: boolean;
  type?: any;
  className?: string;
  style?: any;
}

const BtnPrimary: React.FC<React.PropsWithChildren<BtnPrimatyProps>> = ({
  children,
  onClick,
  onClickRedirect,
  disabled,
  loading,
  type,
  className,
  style,
}) => {
  if (onClickRedirect) {
    onClick = () => {
      Router.push(onClickRedirect);
    };
  }

  return (
    <button
      // loading={loading}
      style={style}
      onClick={onClick}
      className={clsx(s.root, disabled && s.disabled, className)}
      type={type || "submit"}
      disabled={loading || disabled}
    >
      {!loading ? (
        children
      ) : (
        <svg viewBox="0 0 50 50" className={s.spinner}>
          <circle className={s.ring} cx="25" cy="25" r="22.5" />
          <circle className={s.line} cx="25" cy="25" r="22.5" />
        </svg>
      )}
    </button>
  );
};

export default BtnPrimary;
