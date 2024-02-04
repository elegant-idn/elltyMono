import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import {
  SetInitialSectionAction,
  ToggleAuthModalAction,
  ChangeAuthFormAction,
} from "../../redux/actions";
import s from "./PlanCards.module.scss";
import BtnPrimary from "../BtnPrimary";
import { useCookies } from "react-cookie";
import AuthModal from "../AuthModal";
import { Skeleton } from "@mui/material";

interface CardFree {
  price: string;
  local: any;
  isLoading: boolean;
}

const CardFree: React.FC<React.PropsWithChildren<CardFree>> = ({
  price,
  local,
  isLoading,
}) => {
  const [cookie, setCookie] = useCookies();
  const dispatch = useDispatch();
  const router = useRouter();

  const handleClickOpenDesign = () => {
    router.push("/design");
    // if (cookie.user) {
    // } else {
    //   console.log('LOG IN');
    //   dispatch(ToggleAuthModalAction(null)), dispatch(ChangeAuthFormAction('logIn'))
    // }
    // @ts-ignore
    // window.dataLayer.push({'event': 'eventGA4_click_cardFree'});
  };

  return (
    <>
      <div className={s.card}>
        <div className={s.cardName}>Free</div>
        <div className={s.cardPrice}>
          {isLoading ? <Skeleton width={88} /> : price}
          <span className={s.cardDuration}>{local.planM}</span>
        </div>
        <div className={s.cardText}>{local.free.description}</div>
        <BtnPrimary onClick={handleClickOpenDesign}>
          {local.free.btn}
        </BtnPrimary>
        <div className={s.adv}>
          <svg>
            <use href="#done" />
          </svg>{" "}
          {local.free.prop1}
        </div>
        <div className={s.adv}>
          <svg>
            <use href="#done" />
          </svg>{" "}
          {local.free.prop2}
        </div>
        <div className={s.adv}>
          <svg>
            <use href="#done" />
          </svg>{" "}
          {local.free.prop3}
        </div>
        <div className={s.adv}>
          <svg>
            <use href="#done" />
          </svg>{" "}
          {local.free.prop4}
        </div>
        <div className={s.adv}>
          <svg>
            <use href="#done" />
          </svg>{" "}
          {local.free.prop5}
        </div>
        <div className={s.adv}>
          <svg>
            <use href="#done" />
          </svg>{" "}
          {local.free.prop6}
        </div>
        <div className={s.adv}>
          <svg>
            <use href="#done" />
          </svg>{" "}
          {local.free.prop7}
        </div>
        <div className={s.adv}>
          <svg>
            <use href="#done" />
          </svg>{" "}
          {local.free.prop8}
        </div>
      </div>
      {/* <AuthModal /> */}
    </>
  );
};

export default CardFree;
