import clsx from "clsx";
import { MouseEventHandler } from "react";
import styles from "./BtnText.module.scss";
import Router from "next/router";

interface BtnTextProps {
  onClick?: MouseEventHandler | undefined;
  onClickRedirect?: string;
  disabled?: boolean;
}

const BtnText: React.FC<React.PropsWithChildren<BtnTextProps>> = ({
  children,
  onClick,
  onClickRedirect,
  disabled,
}) => {
  if (onClickRedirect) {
    onClick = () => {
      Router.push(onClickRedirect);
    };
  }

  return (
    <button
      className={clsx(styles.root, disabled && styles.disabled)}
      onClick={onClick}
      // type="button"
    >
      {children}
    </button>
  );
};

export default BtnText;
