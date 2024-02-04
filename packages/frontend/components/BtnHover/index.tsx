import clsx from "clsx";
import { useRouter } from "next/router";
import React, { forwardRef, MouseEventHandler } from "react";
import s from "./BtnHover.module.scss";
import Link from "next/link";

interface BtnHoverProps {
  onClick?: MouseEventHandler | undefined;
  onClickRedirect?: string;
  disabled?: boolean;
  type?: any;
  className?: string;
  focus?: boolean;
  asLink?: boolean;
  href?: string;
}

const BtnHover = forwardRef<
  HTMLButtonElement,
  React.PropsWithChildren<BtnHoverProps>
>(
  (
    {
      children,
      onClick,
      onClickRedirect,
      disabled,
      type,
      className,
      focus,
      asLink,
    },
    ref
  ) => {
    const router = useRouter();
    if (onClickRedirect) {
      onClick = () => {
        router.push(onClickRedirect);
      };
    }

    const props = {
      ref: ref as any,
      onClick,
      className: clsx(s.root, disabled && s.disabled, className, {
        [s.focus]: focus,
      }),
      disabled,
      children,
    };

    if (asLink && onClickRedirect) {
      return (
        <Link href={onClickRedirect}>
          <a className={props.className}>{props.children}</a>
        </Link>
      );
    }

    return <button type={type || "button"} {...props} />;
  }
);

BtnHover.displayName = "BtnHover";

export default BtnHover;
