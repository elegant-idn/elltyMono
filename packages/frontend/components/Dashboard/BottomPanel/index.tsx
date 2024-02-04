import { useRouter } from "next/router";
import clsx from "clsx";
import { useDispatch, useSelector } from "react-redux";
import { SetInitialSectionAction } from "../../../redux/actions";
import { RootState } from "../../../redux/store";
import s from "./BottomPanel.module.scss";
import { useTranslation } from "next-i18next";

const yourProjectsPages = ["/projects", "/liked", "/trash"];

const BottomPanel = () => {
  const { t }: any = useTranslation("index");
  const i18n = t("menuMobile.bottomPanel", { returnObjects: true });
  const router = useRouter();

  return (
    <div className={s.root}>
      <div
        className={clsx(s.item, router.pathname == "/" && s.active)}
        onClick={() => {
          router.push("/");
        }}
      >
        <svg
          className={s.homeSvg}
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12.9823 1.49715C12.631 1.2239 12.4553 1.08727 12.2613 1.03476C12.0902 0.988415 11.9098 0.988415 11.7387 1.03476C11.5447 1.08727 11.369 1.2239 11.0177 1.49715L4.23539 6.77228C3.78202 7.1249 3.55534 7.30121 3.39203 7.52201C3.24737 7.7176 3.1396 7.93794 3.07403 8.17221C3 8.43667 3 8.72385 3 9.29821V16.5331C3 17.6532 3 18.2133 3.21799 18.6411C3.40973 19.0174 3.71569 19.3234 4.09202 19.5152C4.51984 19.7331 5.0799 19.7331 6.2 19.7331H8.2C8.48003 19.7331 8.62004 19.7331 8.727 19.6786C8.82108 19.6307 8.89757 19.5542 8.9455 19.4601C9 19.3532 9 19.2132 9 18.9331V12.3331C9 11.7731 9 11.4931 9.10899 11.2791C9.20487 11.091 9.35785 10.938 9.54601 10.8421C9.75992 10.7331 10.0399 10.7331 10.6 10.7331H13.4C13.9601 10.7331 14.2401 10.7331 14.454 10.8421C14.6422 10.938 14.7951 11.091 14.891 11.2791C15 11.4931 15 11.7731 15 12.3331V18.9331C15 19.2132 15 19.3532 15.0545 19.4601C15.1024 19.5542 15.1789 19.6307 15.273 19.6786C15.38 19.7331 15.52 19.7331 15.8 19.7331H17.8C18.9201 19.7331 19.4802 19.7331 19.908 19.5152C20.2843 19.3234 20.5903 19.0174 20.782 18.6411C21 18.2133 21 17.6532 21 16.5331V9.29821C21 8.72385 21 8.43667 20.926 8.17221C20.8604 7.93794 20.7526 7.7176 20.608 7.52201C20.4447 7.30121 20.218 7.1249 19.7646 6.77228L12.9823 1.49715Z"
            stroke="#878787"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        <span>{i18n.home}</span>
      </div>

      <div className={s.item} onClick={() => router.push("/templates")}>
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          className={s.templatesSvg}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10 10L19 10M10 1L10 19M5.8 1H14.2C15.8802 1 16.7202 1 17.362 1.32698C17.9265 1.6146 18.3854 2.07354 18.673 2.63803C19 3.27976 19 4.11984 19 5.8V14.2C19 15.8802 19 16.7202 18.673 17.362C18.3854 17.9265 17.9265 18.3854 17.362 18.673C16.7202 19 15.8802 19 14.2 19H5.8C4.11984 19 3.27976 19 2.63803 18.673C2.07354 18.3854 1.6146 17.9265 1.32698 17.362C1 16.7202 1 15.8802 1 14.2V5.8C1 4.11984 1 3.27976 1.32698 2.63803C1.6146 2.07354 2.07354 1.6146 2.63803 1.32698C3.27976 1 4.11984 1 5.8 1Z"
            stroke="#878787"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        <span>{i18n.templates}</span>
      </div>

      <div
        className={clsx(
          s.item,
          yourProjectsPages.includes(router.pathname) && s.active
        )}
        onClick={() => {
          router.push("/projects");
        }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={s.designsSvg}
        >
          <path
            d="M12.9 4.6L11.896 2.59202C11.6071 2.01412 11.4626 1.72516 11.247 1.51405C11.0564 1.32736 10.8267 1.18538 10.5745 1.09838C10.2892 1 9.96619 1 9.32006 1H5.88C4.87191 1 4.36786 1 3.98282 1.19619C3.64413 1.36876 3.36876 1.64413 3.19619 1.98282C3 2.36786 3 2.87191 3 3.88V4.6M3 4.6H16.68C18.1921 4.6 18.9482 4.6 19.5258 4.89428C20.0338 5.15314 20.4469 5.56619 20.7057 6.07423C21 6.65179 21 7.40786 21 8.92V12.88C21 14.3921 21 15.1482 20.7057 15.7258C20.4469 16.2338 20.0338 16.6469 19.5258 16.9057C18.9482 17.2 18.1921 17.2 16.68 17.2H7.32C5.80786 17.2 5.05179 17.2 4.47423 16.9057C3.96619 16.6469 3.55314 16.2338 3.29428 15.7258C3 15.1482 3 14.3921 3 12.88V4.6Z"
            stroke="#878787"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        <span>{i18n.yourDesign}</span>
      </div>
    </div>
  );
};

export default BottomPanel;
