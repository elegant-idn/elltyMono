import React, { useState, useRef, useEffect } from "react";
import s from "./CardHolder.module.scss";
import bin from "../../public/bin.svg";
import wallet from "../../public/wallet.svg";
import Image from "next/image";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Popper from "@mui/material/Popper";
import BtnOutline from "../../components/BtnOutline";
import clsx from "clsx";
import ThreeDots from "../ThreeDots";
type IProps = {
  cardType?: string;
  changeCard: string;
  deleteCard: string;
  cardNumber?: string;
  modalMsg: string;
};
import { InputCheckbox } from "../Inputs";
const CardHolder = ({
  cardType,
  changeCard,
  deleteCard,
  cardNumber,
  modalMsg,
}: IProps) => {
  const exampleCard = "1234 1234 1234 1234";
  const [clicked, setClicked] = useState(false);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const popperRef = React.useRef<any>();
  const helpTooltipRef = useRef<any>(null);
  const [toolTip, setToolTip] = useState<any>(null);
  const [isActive, setIsActive] = useState(false);
  const handleClickOutside = (event: any) => {
    if (popperRef.current && !popperRef.current.contains(event.target)) {
      setToolTip(null);
      setClicked(false);
    }
  };
  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  });

  return (
    <div className={s.root}>
      <div className={s.cardHolder}>
        <div className={s.wrapper}>
          <p className={s.mainInfo}>{cardType || "card type"}</p>
          <InputCheckbox
            variant="blue"
            value="checkbox"
            checked={isActive}
            onChange={() => setIsActive(!isActive)}
          />
        </div>
        <div className={s.InfoWrapper}>
          <p className={s.cardDetails}>
            **** **** **** {exampleCard.substring(10, 14)}
          </p>
          <div className={s.wrapper}>
            <p className={s.mainInfo}>{cardNumber || "01/01"}</p>
            <ThreeDots
              onClick={(event: any) => {
                setClicked(!clicked);
                setToolTip(event.currentTarget);
              }}
            />
            <div ref={helpTooltipRef}></div>
          </div>

          <Popper
            // placement="right"
            className={s.root}
            ref={popperRef}
            id="simple-popper"
            open={clicked}
            anchorEl={toolTip}
          >
            <div className={s.dropdown} onClick={handleOpen}>
              <div className={s.wrapperDropDown}>
                <Image src={wallet} alt="wallet" width="30px" height="30px" />
                <p>{changeCard}</p>
              </div>
              <div className={s.wrapperDropDown} onClick={handleOpen}>
                <Image src={bin} alt="bin" width="30px" height="30px" />
                <p>{deleteCard}</p>
              </div>
            </div>
          </Popper>
          <Modal open={open} onClose={handleClose} closeAfterTransition>
            <Box className={clsx("modal", s.root)}>
              <button className={s.closeBtn} onClick={handleClose}></button>
              <div className={s.holder}>
                <Typography
                  sx={{ mb: 2, fontWeight: 400, fontSize: 14, color: "black" }}
                >
                  {modalMsg}
                </Typography>
                <BtnOutline type="submit" variant="root" onClick={handleClose}>
                  <label>OK</label>
                </BtnOutline>
              </div>
            </Box>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default CardHolder;
