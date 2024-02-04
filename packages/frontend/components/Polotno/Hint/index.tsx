import React from "react";
import s from "./Hint.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { SetHintStageAction } from "../../../redux/actions";
import { RootState } from "../../../redux/store";
import { useTranslation } from "next-i18next";
import Popper from "@mui/material/Popper";
import BtnText from "../../BtnText";
import clsx from "clsx";
import { useCookies } from "react-cookie";

interface HintProps {
  placement: "right-start" | "top-end";
  arrowPosition: "top" | "right" | "bottom" | "left";
  anchorEl: any;
  offsetX?: number;
  offsetY?: number;
  firstStage: 1 | 2;
}

const Hint: React.FC<React.PropsWithChildren<HintProps>> = ({
  placement,
  anchorEl,
  offsetX = 0,
  offsetY = 0,
  firstStage,
}) => {
  const { t }: any = useTranslation("design");
  const i18n = t("hints", { returnObjects: true });
  const [cookie, setCookie] = useCookies();

  const dispatch = useDispatch();
  const hintStage = useSelector(
    (state: RootState) => state.designReducer.hintStage
  );
  const [isClosingAnimation, setIsClosingAnimation] =
    React.useState<boolean>(false);
  const [isClosed, setIsClosed] = React.useState<boolean>(false);
  // console.log(hintStage);

  const handleClose = () => {
    setIsClosingAnimation(true);
    setTimeout(() => {
      setIsClosingAnimation(false);
      dispatch(SetHintStageAction(5));
      setCookie("hintsPassed", true, { path: "/" });
    }, 390);
  };

  if (cookie.hintsPassed || cookie.user) return <div></div>;

  return (
    <Popper
      id="popper"
      open={!!anchorEl}
      anchorEl={anchorEl.current}
      placement={placement}
    >
      <div
        className={clsx(
          s.root,
          isClosingAnimation && s.isClosing,
          isClosed && s.closed,
          placement == "right-start" ? s.animationX : s.animationY
        )}
        style={{ top: `${offsetY}px`, left: `${offsetX}px` }}
      >
        <div
          className={clsx(
            s.triangle,
            placement == "right-start" ? s.left : s.top
          )}
        ></div>

        <div className={s.header}>
          <div className={s.step}>
            {i18n.step} {hintStage} {i18n.of} {5 - firstStage}
          </div>
          <div className={s.btnClose} onClick={handleClose}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4.0022 3.74512L12.1622 11.9051M4.0022 11.9051L12.1622 3.74512"
                stroke="#36373C"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
        {hintStage == 1 - firstStage + 1 && (
          <>
            <div className={s.title}>{i18n.step1.title}</div>
            <div className={s.text}>{i18n.step1.text}</div>
          </>
        )}
        {hintStage == 2 - firstStage + 1 && (
          <>
            <div className={s.title}>{i18n.step2.title}</div>
            <div className={s.text}>{i18n.step2.text}</div>
          </>
        )}
        {hintStage == 3 - firstStage + 1 && (
          <>
            <div className={s.title}>{i18n.step3.title}</div>
            <div className={s.text}>{i18n.step3.text}</div>
          </>
        )}
        {hintStage == 4 - firstStage + 1 && (
          <>
            <div className={s.title}>{i18n.step4.title}</div>
            <div className={s.text}>{i18n.step4.text}</div>
          </>
        )}

        <div className={s.btnWrapper}>
          {hintStage !== 4 - firstStage + 1 && (
            <div className={s.btnText}>
              <BtnText onClick={handleClose}>{i18n.skip}</BtnText>
            </div>
          )}

          {hintStage == 4 - firstStage + 1 ? (
            <button
              onClick={() => {
                setIsClosingAnimation(true);
                setTimeout(() => {
                  setIsClosingAnimation(false);
                  setIsClosed(true);
                }, 380);
                setTimeout(() => {
                  setIsClosed(false);
                  setCookie("hintsPassed", true, { path: "/" });
                }, 600);
              }}
            >
              {i18n.done}
            </button>
          ) : (
            <button
              onClick={() => {
                setIsClosingAnimation(true);
                setTimeout(() => {
                  setIsClosingAnimation(false);
                  setIsClosed(true);
                }, 380);
                setTimeout(() => {
                  setIsClosed(false);
                  dispatch(SetHintStageAction(hintStage + 1));
                }, 600);
              }}
            >
              {i18n.next}
            </button>
          )}
        </div>
      </div>
    </Popper>
  );
};

export default Hint;
