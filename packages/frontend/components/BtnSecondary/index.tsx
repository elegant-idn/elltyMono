import clsx from "clsx";
import { MouseEventHandler } from "react";
import styles from "./BtnSecondary.module.scss";
import Router from "next/router";

interface BtnSecondaryProps {
  onClick?: MouseEventHandler | undefined;
  onClickRedirect?: string;
  disabled?: boolean;
  className?: string;
}

const BtnSecondary: React.FC<React.PropsWithChildren<BtnSecondaryProps>> = ({
  children,
  onClick,
  onClickRedirect,
  disabled,
  className,
}) => {
  if (onClickRedirect) {
    onClick = () => {
      Router.push(onClickRedirect);
    };
  }

  return (
    <button
      onClick={onClick}
      className={clsx(styles.root, disabled && styles.disabled, className)}
    >
      {children}
    </button>
  );
};

export default BtnSecondary;
