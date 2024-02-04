import { MouseEventHandler } from "react";
import clsx from "clsx";
import s from "./HamburgerMenu.module.scss";

interface HamburgerMenuProps {
  isActive: boolean;
  onClick?: MouseEventHandler | undefined;
}

const HamburgerMenu: React.FC<React.PropsWithChildren<HamburgerMenuProps>> = ({
  isActive,
  onClick,
}) => {
  return (
    <button
      className={clsx(s.hamburger, isActive && s.active)}
      // style={auth ? {marginLeft: '5px'} : {marginLeft: '16px'}}
      aria-label="Navigation list"
      onClick={onClick}
      type="button"
    >
      <span className={clsx(s.box, isActive && s.active)}>
        {isActive ? (
          <svg
            viewBox="0 0 19 19"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 1L17.32 17.32M1 17.32L17.32 1"
              stroke="#1F2128"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        ) : (
          <svg
            viewBox="0 0 24 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 17H12H23"
              stroke="#1F2128"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M1 9H23"
              stroke="#1F2128"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M1 1H23"
              stroke="#1F2128"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          // <span className={s.inner}></span>
        )}
      </span>
    </button>
  );
};

export default HamburgerMenu;
