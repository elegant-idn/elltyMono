import { useTranslation } from "next-i18next";
import { useDispatch } from "react-redux";
import {
  ChangeAuthFormAction,
  SetCheckoutPlanDurationAction,
  SetProfileTooltipAction,
  ToggleAuthModalAction,
  ToggleCheckoutModalAction,
} from "../../../redux/actions";
import gaEvent from "../../../utils/gaEvent";
import useTypedSelector from "../../../utils/useTypedSelector";
import BtnOutline from "../../BtnOutline";
import s from "./UpgradeToProBar.module.scss";
import clsx from "clsx";
interface UpgradeToProBarProps {
  remainingDownloads?: number;
  br?: boolean;
  className?: string;
}

const UpgradeToProBar: React.FC<
  React.PropsWithChildren<UpgradeToProBarProps>
> = ({ remainingDownloads, br, className }) => {
  const { t }: any = useTranslation("index");
  const text = t("toPro");
  const user = useTypedSelector((state) => state.mainReducer.user);
  const dispatch = useDispatch();
  const totalDownloads = 3;
  const onClickUpgrade = () => {
    gaEvent("view_checkout_form");
    dispatch(ToggleCheckoutModalAction(true));
    dispatch(SetCheckoutPlanDurationAction("monthly"));
    // activated when you click on UpgradetoPro via the HeaderDashboard
    dispatch(SetProfileTooltipAction(null));
  };

  return (
    <div className={clsx(s.root, className)}>
      <div
        className={s.btnSecondary}
        onClick={
          user.email == null
            ? () => {
                dispatch(ToggleAuthModalAction(null)),
                  dispatch(ChangeAuthFormAction("logIn"));
              }
            : onClickUpgrade
        }
      >
        <BtnOutline variant="root">
          <div className={s.btnWrapper}>
            <svg
              className={s.crown}
              width="15"
              height="11"
              viewBox="0 0 15 11"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0.754602 4.31979C0.590296 3.93641 0.939984 3.53224 1.34301 3.63971L4.81984 4.56687C5.05402 4.62931 5.29927 4.51482 5.40176 4.29519L7.04652 0.770714C7.22606 0.385971 7.77315 0.385972 7.9527 0.770715L9.59746 4.29519C9.69995 4.51482 9.9452 4.62931 10.1794 4.56687L13.6562 3.63971C14.0592 3.53224 14.4089 3.93641 14.2446 4.31979L11.8545 9.89676C11.7757 10.0806 11.5949 10.1998 11.3949 10.1998H3.60431C3.40429 10.1998 3.22352 10.0806 3.14473 9.89676L0.754602 4.31979Z"
                fill="#FFCE22"
              />
            </svg>

            {text}
          </div>
        </BtnOutline>
      </div>
    </div>
  );
};

export default UpgradeToProBar;
