import React from "react";
import NextLink from "next/link";
import clsx from "clsx";
import styles from "./Link.module.scss";
import { MouseEventHandler } from "react";

interface LinkProps {
  chevron?: boolean;
  href?: string;
  disabled?: boolean;
  onClick?: MouseEventHandler | undefined;
}

const Link = React.forwardRef<
  HTMLAnchorElement,
  React.PropsWithChildren<LinkProps>
>(({ children, chevron, href, disabled, onClick }, ref) => {
  return (
    // @ts-ignore
    <NextLink href={href} passHref>
      <a
        href="#"
        className={clsx(styles.root, disabled && styles.disabled)}
        onClick={onClick}
      >
        {children}
        {chevron ? (
          <svg viewBox="0 0 6 10">
            <path
              d="M1.45222 0.644603L5.40234 4.59473L1.39462 8.60245"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : null}
      </a>
    </NextLink>
  );
});

Link.displayName = "Link";
export default Link;
