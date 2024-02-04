import s from "./BtnSocial.module.scss";
import { MouseEventHandler } from "react";

interface BtnSocialProps {
  src: string;
  onClick?: MouseEventHandler | undefined;
}

const BtnSocial: React.FC<React.PropsWithChildren<BtnSocialProps>> = ({
  src,
  onClick,
  children,
}) => {
  return (
    <button type="button" onClick={onClick} className={s.root}>
      <img src={src} />
      {children}
    </button>
  );
};

export default BtnSocial;
