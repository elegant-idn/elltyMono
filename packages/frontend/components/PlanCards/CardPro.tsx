import s from "./PlanCards.module.scss";
import BtnPrimary from "../BtnPrimary";

import { useDispatch } from "react-redux";
import {
  ToggleCheckoutModalAction,
  ToggleAuthModalAction,
  ChangeAuthFormAction,
} from "../../redux/actions";
import { useCookies } from "react-cookie";
import AuthModal from "../AuthModal";
import gaEvent from "../../utils/gaEvent";
import { Skeleton } from "@mui/material";

interface CardProProps {
  currency: string;
  price: string;
  value: string;
  local: any;
  text: string;
  isLoading: boolean;
}

const CardPro: React.FC<React.PropsWithChildren<CardProProps>> = ({
  currency,
  price,
  text,
  local,
  isLoading,
}) => {
  const [cookie, setCookie] = useCookies();
  const dispatch = useDispatch();

  const handleClickBeginPayment = () => {
    if (cookie.user) {
      dispatch(ToggleCheckoutModalAction(true));
      gaEvent("view_checkout_form");
      // value == 'monthly' ?
      //   gaEvent('begin_checkout_monthly')
      // :
      //   gaEvent('begin_checkout_annually')

      // window.dataLayer.push({'event': 'begin_checkout'});
    } else {
      // console.log('LOG IN');
      // dispatch(ToggleCheckoutModalAction(true))
      dispatch(ToggleAuthModalAction(null));
      dispatch(ChangeAuthFormAction("logIn"));
    }
  };

  return (
    <>
      <div className={s.card}>
        <div className={s.cardName}>Pro</div>
        <div className={s.cardPrice}>
          {isLoading ? <Skeleton width={88} /> : price}
          <span className={s.cardDuration}>{text}</span>
        </div>

        {cookie.locale === "ru" ? (
          <div className={s.cardText}>
            Идеальное решение для профессионалов и бизнеса.
          </div>
        ) : (
          <div className={s.cardText}>{local.pro.description}</div>
        )}

        <div onClick={handleClickBeginPayment}>
          <BtnPrimary>{local.pro.btn}</BtnPrimary>
        </div>

        <div className={s.adv}>
          <svg>
            <use href="#done" />
          </svg>{" "}
          {local.pro.prop1}
        </div>
        <div className={s.adv}>
          <svg>
            <use href="#done" />
          </svg>{" "}
          {local.pro.prop2}
        </div>
        <div className={s.adv}>
          <svg>
            <use href="#done" />
          </svg>{" "}
          {local.pro.prop3}
        </div>
        <div className={s.adv}>
          <svg>
            <use href="#done" />
          </svg>{" "}
          {local.pro.prop4}
        </div>
        <div className={s.adv}>
          <svg>
            <use href="#done" />
          </svg>{" "}
          {local.pro.prop5}
        </div>
        <div className={s.adv}>
          <svg>
            <use href="#done" />
          </svg>{" "}
          {local.pro.prop6}
        </div>
        <div className={s.adv}>
          <svg>
            <use href="#done" />
          </svg>{" "}
          {local.pro.prop7}
        </div>
        {/* <div className={s.adv}>
          <svg>
            <use href="#done" />
          </svg>{" "}
          {local.pro.prop8}
        </div> */}
        <div className={s.adv}>
          <svg>
            <use href="#done" />
          </svg>{" "}
          {local.pro.prop9}
        </div>
        <div className={s.adv}>
          <svg>
            <use href="#done" />
          </svg>{" "}
          {local.pro.prop10}
        </div>
      </div>
      <AuthModal />
    </>
  );
};

export default CardPro;
