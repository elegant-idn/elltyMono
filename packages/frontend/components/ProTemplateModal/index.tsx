import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import clsx from "clsx";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import { useCookies } from "react-cookie";
import { useDispatch } from "react-redux";
import {
  SetCheckoutModalBackdropTimeoutAction,
  ToggleCheckoutModalAction,
  ToggleProElementsModalAction,
  ToggleProTemplatesModalAction,
  ToggleRemainingDownloadsModalAction,
} from "../../redux/actions";
import gaEvent from "../../utils/gaEvent";
import useTypedSelector from "../../utils/useTypedSelector";
import BtnPrimary from "../BtnPrimary";
import s from "./ProTemplateModal.module.scss";

interface ProTemplateModalProps {}

interface ModalLayoutProps {
  modalOpen: any;
  onCloseModal: any;
  className: string;
}

const ModalLayout: React.FC<React.PropsWithChildren<ModalLayoutProps>> = ({
  children,
  modalOpen,
  onCloseModal,
  className,
}) => {
  // const dispatch = useDispatch()

  return (
    <Modal
      open={modalOpen}
      onClose={onCloseModal}
      closeAfterTransition
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Box className={clsx("modal", s.root, s[className])}>
        <button className={s.closeBtn} onClick={onCloseModal}></button>

        {children}

        <svg display="none">
          <symbol
            id="templates"
            width="19"
            height="19"
            viewBox="0 0 19 19"
            // eslint-disable-next-line
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0.999512 6.35338V14.0465C0.999512 14.6429 1.15194 15.2294 1.44232 15.7503C2.06016 16.8586 3.2296 17.5455 4.49849 17.5455H12.6563C13.5459 17.5455 14.3937 17.1684 14.9895 16.5079C15.5101 15.9307 15.7982 15.1809 15.7982 14.4036V6.11357C15.7982 5.01395 15.2692 3.98146 14.3767 3.33913C13.7951 2.92053 13.0966 2.69531 12.38 2.69531H4.65758C3.79104 2.69531 2.95264 3.00293 2.29173 3.56336C1.47207 4.2584 0.999512 5.27871 0.999512 6.35338Z"
              stroke="#36373C"
            />
            <path
              d="M15.2629 15.3736V15.3736C15.8945 15.3736 16.4965 15.1059 16.9195 14.6369L17.1909 14.336C17.7115 13.7588 17.9997 13.0091 17.9997 12.2317V3.9417C17.9997 2.84207 17.4707 1.80959 16.5781 1.16726V1.16726C15.9965 0.748654 15.298 0.523438 14.5814 0.523438H6.64394C5.9085 0.523438 5.18902 0.737809 4.57351 1.14032L4.46175 1.2134C4.25468 1.34882 4.06658 1.51122 3.90241 1.69632L3.62795 2.00577C3.35284 2.31595 3.20093 2.71619 3.20093 3.13079V3.13079"
              stroke="#36373C"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M5.90345 6.13281C4.94466 6.13281 4.16714 6.88219 4.16714 7.80563C4.16714 8.72907 4.94466 9.47845 5.90345 9.47845C6.86228 9.47845 7.64046 8.72903 7.64046 7.80563C7.64046 6.88223 6.86228 6.13281 5.90345 6.13281ZM5.9005 7.13379C6.28465 7.13379 6.59696 7.43456 6.59696 7.80452C6.59696 8.17448 6.28465 8.47525 5.9005 8.47525C5.51656 8.47525 5.20472 8.1747 5.20472 7.80452C5.20472 7.43434 5.51656 7.13379 5.9005 7.13379ZM12.1348 8.87549C11.3632 8.14284 10.1603 8.23045 9.49233 9.09607L7.81103 11.273L7.7541 11.3361C7.55244 11.5267 7.23968 11.5213 7.04454 11.3094L6.37699 10.5843L6.28273 10.4881C5.63605 9.8792 4.63633 9.91556 4.02926 10.5982L2.87611 11.8933L2.82304 11.9624C2.66468 12.2028 2.69134 12.5368 2.89749 12.7448C3.12426 12.9737 3.48235 12.9635 3.69731 12.722L4.8507 11.4267L4.91252 11.3678C5.10824 11.2107 5.3893 11.2291 5.56554 11.4238L6.23647 12.1527L6.32845 12.2453C7.02071 12.8916 8.09066 12.8089 8.68532 12.0377L10.3665 9.86095L10.4273 9.79141C10.7041 9.51181 11.1477 9.51461 11.4205 9.81417L12.9864 11.5343L13.049 11.5937C13.2679 11.7723 13.5824 11.7581 13.7864 11.5476C14.0108 11.3161 14.0164 10.9348 13.7989 10.6959L12.2329 8.97571L12.1348 8.87549Z"
              fill="#1F2128"
            />
          </symbol>

          <symbol
            id="gift"
            width="20"
            height="19"
            viewBox="0 0 20 19"
            // eslint-disable-next-line
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3.13916 10.9453V15.9453C3.13916 17.0499 4.03459 17.9453 5.13916 17.9453H15.1392C16.2437 17.9453 17.1392 17.0499 17.1392 15.9453V10.9453"
              stroke="#36373C"
            />
            <rect
              x="2.63916"
              y="6.44531"
              width="15"
              height="5"
              rx="1.5"
              stroke="#36373C"
            />
            <path
              d="M10.1392 17.9469V6.44687M10.1392 6.44687C10.4725 4.94687 11.6392 2.04687 13.6392 2.44687C16.1392 2.94687 15.1392 5.4465 14.6392 5.9465C14.2392 6.3465 13.8058 6.4465 13.6392 6.4465M10.1392 6.44687C9.97249 5.28033 9.13916 2.84717 7.13916 2.44687C4.63916 1.9465 4.63916 3.9465 4.63916 4.4465C4.63916 4.9465 5.13916 6.44727 6.63916 6.44727"
              stroke="#36373C"
            />
          </symbol>

          <symbol
            id="download"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            // eslint-disable-next-line
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M8.52881 2.54688V10.215L7.30288 8.98491L7.23991 8.93031C7.02003 8.76647 6.7075 8.78398 6.50739 8.98327C6.28727 9.20249 6.28654 9.55865 6.50576 9.77877L8.69276 11.9748L8.69423 11.976C8.71284 11.9946 8.73275 12.0118 8.7538 12.0277L8.75592 12.0295C8.97646 12.1937 9.29002 12.1755 9.48988 11.9748L11.6769 9.77877L11.7312 9.71557C11.8942 9.49502 11.8754 9.18256 11.6753 8.98327L11.6121 8.92894C11.3915 8.766 11.079 8.7848 10.8798 8.98491L9.65381 10.2154V2.54688L9.64867 2.47055C9.61143 2.19599 9.37608 1.98438 9.09131 1.98438C8.78065 1.98438 8.52881 2.23621 8.52881 2.54688ZM13.4288 15.8384C15.1894 15.7569 16.5913 14.3041 16.5913 12.5233V8.8603L16.5877 8.70368C16.506 6.93892 15.0504 5.53405 13.2658 5.53405H12.5661L12.4897 5.53919C12.2152 5.57643 12.0036 5.81178 12.0036 6.09655C12.0036 6.40721 12.2554 6.65905 12.5661 6.65905H13.2658L13.3951 6.66279C14.5506 6.7297 15.4663 7.68749 15.4663 8.8603V12.5233L15.4626 12.6522C15.3959 13.804 14.4411 14.7171 13.2726 14.7171H4.91756L4.78823 14.7133C3.63282 14.6464 2.71631 13.688 2.71631 12.5158V8.85205L2.72003 8.72322C2.78678 7.57225 3.74204 6.65905 4.91006 6.65905H5.61656L5.69289 6.65392C5.96744 6.61667 6.17906 6.38132 6.17906 6.09655C6.17906 5.78589 5.92722 5.53405 5.61656 5.53405H4.91006L4.74929 5.53788C2.99141 5.62174 1.59131 7.07363 1.59131 8.85205V12.5158L1.59493 12.6724C1.6767 14.4366 3.13313 15.8421 4.91756 15.8421H13.2726L13.4288 15.8384Z"
              fill="#36373C"
            />
          </symbol>

          <symbol
            id="text"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            // eslint-disable-next-line
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="1.45898"
              y="1.46094"
              width="15.0817"
              height="15.0817"
              rx="2.5"
              stroke="#36373C"
              strokeLinecap="square"
              strokeLinejoin="round"
              strokeDasharray="3 6"
            />
            <path
              d="M5.87305 6.32031H9.00004M12.127 6.32031H9.00004M9.00004 6.32031V12.3256"
              stroke="#36373C"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </symbol>
        </svg>
      </Box>
    </Modal>
  );
};

export const ProTemplateModal: React.FC<
  React.PropsWithChildren<ProTemplateModalProps>
> = () => {
  const [cookie] = useCookies();
  const { t }: any = useTranslation("modalPro");
  const i18nCommon = t("common", { returnObjects: true });
  const i18n = t("proTemplateModal", { returnObjects: true });

  const dispatch = useDispatch();
  const modalOpen = useTypedSelector(
    (state) => state.mainReducer.proTemplateModalOpen
  );
  const previewSrc = useTypedSelector(
    (state) => state.mainReducer.proTemplateModalPreview
  );

  return (
    <ModalLayout
      modalOpen={modalOpen}
      onCloseModal={() => {
        dispatch(ToggleProTemplatesModalAction(false));
      }}
      className="proTemplate"
    >
      <div className={s.banner}>
        <img src={previewSrc} />
        {/* <Image src="https://ellty-images.s3.amazonaws.com/template_images/e6s5zN4n7SkinCareTipsStiriesAds-middle.png" layout="fill" objectFit="contain" /> */}
      </div>

      <div className={s.content}>
        {/* <img className={s.emojiImg} src="/design/emoji.png" /> */}

        <div className={s.title}>
          {/* Try Ellty Pro <img className={s.emojiImg} src="/design/emoji.png" /> */}
          {i18n.title}
        </div>
        <div className={s.subtitle}>{i18n.subtitle}</div>

        <div className={s.advs}>
          <div className={s.adv}>
            <div className={s.svg}>
              <svg>
                <use href="#templates" />
              </svg>
            </div>
            {i18nCommon.adv1}
          </div>
          {cookie.locale !== "ru" && (
            <div className={s.adv}>
              <div className={clsx(s.svg, s.giftSvg)}>
                <svg>
                  <use href="#gift" />
                </svg>
              </div>
              {i18nCommon.adv2}
            </div>
          )}

          <div className={s.adv}>
            <div className={s.svg}>
              <svg>
                <use href="#download" />
              </svg>
            </div>
            {i18nCommon.adv3}
          </div>
          <div className={s.adv}>
            <div className={s.svg}>
              <svg>
                <use href="#text" />
              </svg>
            </div>
            {i18nCommon.adv4}
          </div>
        </div>

        <div
          onClick={() => {
            gaEvent("view_checkout_form");
            dispatch(SetCheckoutModalBackdropTimeoutAction(false));
            dispatch(ToggleCheckoutModalAction(true));
            dispatch(ToggleProTemplatesModalAction(false));
          }}
        >
          <BtnPrimary>{i18nCommon.startTrial}</BtnPrimary>
        </div>
      </div>
    </ModalLayout>
  );
};

export const ProElementModal: React.FC<
  React.PropsWithChildren<ProTemplateModalProps>
> = () => {
  const [cookie] = useCookies();
  const { t }: any = useTranslation("modalPro");
  const i18nCommon = t("common", { returnObjects: true });
  const i18n = t("proElementModal", { returnObjects: true });

  const dispatch = useDispatch();
  const modalOpen = useTypedSelector(
    (state) => state.mainReducer.proElementModalOpen
  );
  const previewSrc = useTypedSelector(
    (state) => state.mainReducer.proElementModalPreview
  );

  return (
    <ModalLayout
      modalOpen={modalOpen}
      onCloseModal={() => {
        dispatch(ToggleProElementsModalAction(false));
      }}
      className="proTemplate"
    >
      <div className={s.banner}>
        <img src={previewSrc} />
        {/* <Image src="https://ellty-images.s3.amazonaws.com/template_images/e6s5zN4n7SkinCareTipsStiriesAds-middle.png" layout="fill" objectFit="contain" /> */}
      </div>

      <div className={s.content}>
        {/* <img className={s.emojiImg} src="/design/emoji.png" /> */}

        <div className={s.title}>
          {/* Try Ellty Pro <img className={s.emojiImg} src="/design/emoji.png" /> */}
          {i18n.title}
        </div>
        <div className={s.subtitle}>{i18n.subtitle}</div>

        <div className={s.advs}>
          <div className={s.adv}>
            <div className={s.svg}>
              <svg>
                <use href="#templates" />
              </svg>
            </div>
            {i18nCommon.adv1}
          </div>
          {cookie.locale !== "ru" && (
            <div className={s.adv}>
              <div className={clsx(s.svg, s.giftSvg)}>
                <svg>
                  <use href="#gift" />
                </svg>
              </div>
              {i18nCommon.adv2}
            </div>
          )}

          <div className={s.adv}>
            <div className={s.svg}>
              <svg>
                <use href="#download" />
              </svg>
            </div>
            {i18nCommon.adv4}
          </div>
          <div className={s.adv}>
            <div className={s.svg}>
              <svg>
                <use href="#text" />
              </svg>
            </div>
            {i18nCommon.adv4}
          </div>
        </div>

        <div
          onClick={() => {
            gaEvent("view_checkout_form");
            dispatch(SetCheckoutModalBackdropTimeoutAction(false));
            dispatch(ToggleCheckoutModalAction(true));
            dispatch(ToggleProElementsModalAction(false));
          }}
        >
          <BtnPrimary>{i18nCommon.startTrial}</BtnPrimary>
        </div>
      </div>
    </ModalLayout>
  );
};

export const TryElltyProModal: React.FC<
  React.PropsWithChildren<unknown>
> = () => {
  const [cookie] = useCookies();
  const { t }: any = useTranslation("modalPro");
  const i18nCommon = t("common", { returnObjects: true });
  const i18n = t("tryProModal", { returnObjects: true });

  const dispatch = useDispatch();
  const modalOpen = useTypedSelector(
    (state) => state.designReducer.remainingDownloadsModalOpen
  );

  return (
    <ModalLayout
      modalOpen={modalOpen}
      onCloseModal={() => {
        dispatch(ToggleRemainingDownloadsModalAction(false));
      }}
      className="tryElltyPro"
    >
      <div className={s.banner}>
        <Image src="/plans/banner3.png" layout="fill" objectFit="cover" />
      </div>

      <div className={s.content}>
        <div className={s.title}>{i18n.title}</div>
        <div className={s.subtitle}>{i18n.subtitle}</div>

        <div className={s.advs}>
          <div className={s.adv}>
            <div className={s.svg}>
              <svg>
                <use href="#templates" />
              </svg>
            </div>
            {i18nCommon.adv1}
          </div>
          {cookie.locale !== "ru" && (
            <div className={s.adv}>
              <div className={clsx(s.svg, s.giftSvg)}>
                <svg>
                  <use href="#gift" />
                </svg>
              </div>
              {i18nCommon.adv2}
            </div>
          )}
          <div className={s.adv}>
            <div className={s.svg}>
              <svg>
                <use href="#download" />
              </svg>
            </div>
            {i18nCommon.adv3}
          </div>
          <div className={s.adv}>
            <div className={s.svg}>
              <svg>
                <use href="#text" />
              </svg>
            </div>
            {i18nCommon.adv4}
          </div>
        </div>

        <div
          onClick={() => {
            gaEvent("view_checkout_form");
            dispatch(SetCheckoutModalBackdropTimeoutAction(false));
            dispatch(ToggleCheckoutModalAction(true));
            dispatch(ToggleRemainingDownloadsModalAction(false));
          }}
        >
          <BtnPrimary>{i18nCommon.startTrial}</BtnPrimary>
        </div>
      </div>
    </ModalLayout>
  );
};
