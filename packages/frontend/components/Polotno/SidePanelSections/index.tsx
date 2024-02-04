/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/display-name */
import {
  DEFAULT_SECTIONS,
  // TemplatesSection,
  // TextSection,
  // PhotosSection,
  // ElementsSection,
  // UploadSection,
  // BackgroundSection,
  // SizeSection,
  SectionTab,
} from "polotno/side-panel";

import { t } from "polotno/utils/l10n";
import ElementsSection from "./ElementsSection";
import TemplatesSection from "./TemplatesSection";
import { UploadsSection } from "./UploadsSection";

const SidePanelSections: any = () => {
  // const {t}: any = useTranslation("design")
  // const i18n = t("sidePanel", {returnObjects: true})

  const templatesSection = DEFAULT_SECTIONS.find((s) => s.name === "templates");
  const textSection = DEFAULT_SECTIONS.find((s) => s.name === "text");
  const photosSection = DEFAULT_SECTIONS.find((s) => s.name === "photos");
  const elementsSection = DEFAULT_SECTIONS.find((s) => s.name === "elements");
  const uploadSection = DEFAULT_SECTIONS.find((s) => s.name === "upload");
  const bgSection = DEFAULT_SECTIONS.find((s) => s.name === "background");
  //const sizeSection = DEFAULT_SECTIONS.find((s) => s.name === "size");

  // @ts-ignore
  templatesSection.Tab = (props) => (
    <SectionTab name={t("sidePanel.template")} {...props}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="22"
        height="22"
        fill="none"
        viewBox="0 0 22 22"
      >
        <path
          stroke="#878787"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="M11 11h10M11 1v20M6.333 1h9.334c1.867 0 2.8 0 3.513.363.627.32 1.137.83 1.457 1.457C21 3.533 21 4.466 21 6.333v9.334c0 1.867 0 2.8-.363 3.513a3.334 3.334 0 01-1.457 1.457c-.713.363-1.646.363-3.513.363H6.333c-1.867 0-2.8 0-3.513-.363a3.333 3.333 0 01-1.457-1.457C1 18.467 1 17.534 1 15.667V6.333c0-1.867 0-2.8.363-3.513.32-.627.83-1.137 1.457-1.457C3.533 1 4.466 1 6.333 1z"
        ></path>
      </svg>
    </SectionTab>
  );

  // @ts-ignore
  templatesSection.Panel = TemplatesSection;

  // @ts-ignore
  textSection.Tab = (props) => (
    <SectionTab name={t("sidePanel.text")} {...props}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          stroke="#878787"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.4"
          d="M3 6.375c0-1.048 0-1.573.171-1.986A2.25 2.25 0 014.39 3.171C4.802 3 5.327 3 6.375 3h11.25c1.048 0 1.573 0 1.986.171.551.229.99.667 1.218 1.218.171.413.171.938.171 1.986M8.625 21h6.75M12 3v18"
        ></path>
      </svg>
    </SectionTab>
  );
  // @ts-ignore
  photosSection.Tab = (props) => (
    <SectionTab name={t("sidePanel.photo")} {...props}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="22"
        height="20"
        fill="none"
        viewBox="0 0 22 20"
      >
        <path
          stroke="#878787"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.4"
          d="M3.272 18.728L9.87 12.13c.396-.396.594-.594.822-.668a1 1 0 01.618 0c.228.074.426.272.822.668l6.553 6.553M13 13l2.869-2.869c.396-.396.594-.594.822-.668a1 1 0 01.618 0c.228.074.426.272.822.668L21 13M9 7a2 2 0 11-4 0 2 2 0 014 0zM5.8 19h10.4c1.68 0 2.52 0 3.162-.327a3 3 0 001.311-1.311C21 16.72 21 15.88 21 14.2V5.8c0-1.68 0-2.52-.327-3.162a3 3 0 00-1.311-1.311C18.72 1 17.88 1 16.2 1H5.8c-1.68 0-2.52 0-3.162.327a3 3 0 00-1.311 1.311C1 3.28 1 4.12 1 5.8v8.4c0 1.68 0 2.52.327 3.162a3 3 0 001.311 1.311C3.28 19 4.12 19 5.8 19z"
        ></path>
      </svg>
    </SectionTab>
  );
  // @ts-ignore
  elementsSection.Tab = (props) => (
    <SectionTab name={t("sidePanel.elements")} {...props}>
      <svg
        width="27"
        height="26"
        viewBox="0 0 27 26"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M20.9283 3.25H6.07158C3.59571 3.25 1.58441 5.24617 1.58441 7.71478L1.58325 10.6985C1.58309 11.1217 1.89589 11.4716 2.3018 11.5269L2.41465 11.5346C3.32306 11.5346 3.99616 12.1669 3.99616 13.0011C3.99616 13.864 3.29432 14.5607 2.41465 14.5607C1.95548 14.5607 1.58325 14.9349 1.58325 15.3964V18.2852C1.58325 20.7542 3.59376 22.75 6.07043 22.75H20.9294C23.4061 22.75 25.4166 20.7542 25.4166 18.2852V15.3964C25.4166 14.9349 25.0444 14.5607 24.5852 14.5607C23.7055 14.5607 23.0037 13.864 23.0037 13.0011C23.0037 12.138 23.7059 11.4404 24.5852 11.4404C25.0445 11.4404 25.4168 11.0661 25.4166 10.6044L25.4154 7.71445C25.4154 5.24617 23.4041 3.25 20.9283 3.25ZM20.9281 4.92155L21.114 4.9275C22.5893 5.02222 23.7525 6.23582 23.7525 7.7149L23.7525 9.87678L23.6634 9.9008C22.3198 10.295 21.3407 11.5303 21.3407 13.0013L21.3462 13.1917C21.4265 14.5779 22.3781 15.7238 23.6633 16.1007L23.7536 16.1246V18.2853C23.7536 19.8265 22.4922 21.0787 20.9292 21.0787H16.382V19.4185L16.3744 19.3051C16.3193 18.8972 15.9715 18.5828 15.5506 18.5828C15.0914 18.5828 14.7192 18.9569 14.7192 19.4185V21.0787H6.07024L5.8842 21.0727C4.40839 20.9781 3.24586 19.7648 3.24586 18.2853V16.1235L3.33613 16.1007C4.67976 15.7067 5.65877 14.4722 5.65877 13.0013L5.6533 12.8119C5.57347 11.4355 4.6274 10.3444 3.33944 9.98754L3.24475 9.96369L3.24702 7.71523C3.24702 6.1742 4.50916 4.92155 6.0714 4.92155H14.7192V7.06105L14.7268 7.17446C14.7818 7.58237 15.1297 7.89677 15.5506 7.89677C16.0098 7.89677 16.382 7.52261 16.382 7.06105V4.92155H20.9281ZM15.5506 9.38263C15.9715 9.38263 16.3193 9.69703 16.3744 10.1049L16.382 10.2183V15.5903C16.382 16.0519 16.0098 16.426 15.5506 16.426C15.1297 16.426 14.7818 16.1116 14.7268 15.7037L14.7192 15.5903V10.2183C14.7192 9.75679 15.0914 9.38263 15.5506 9.38263Z"
          fill="white"
        />
      </svg>
    </SectionTab>
  );

  const customElementsSection = {
    name: "custom elements",
    Tab: (props: any) => (
      <SectionTab name={t("sidePanel.elements")} {...props}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke="#878787"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.4"
            d="M20 14h-4.222c-.623 0-.934 0-1.171.121a1.11 1.11 0 00-.486.486c-.121.237-.121.549-.121 1.17V20c0 .622 0 .933.121 1.171.107.21.277.38.486.486.237.12.549.12 1.17.12H20c.622 0 .933 0 1.171-.12.21-.107.38-.277.486-.486.12-.238.12-.549.12-1.171v-4.222c0-.623 0-.934-.12-1.171a1.111 1.111 0 00-.486-.486C20.933 14 20.622 14 20 14zM10.66 9.778h4.882c.622 0 .933 0 1.171-.121.21-.107.38-.277.486-.486C17.319 8.933 14.16 3 13.66 2.5a.705.705 0 00-.997 0c-.497.5-3.78 6.433-3.66 6.671.107.21.277.38.486.486.238.12.549.12 1.17.12z"
          ></path>
          <circle
            cx="6"
            cy="16"
            r="4"
            stroke="#878787"
            strokeWidth="1.4"
          ></circle>
        </svg>
      </SectionTab>
    ),
    // we need observer to update component automatically on any store changes
    Panel: ElementsSection,
  };

  // @ts-ignore
  uploadSection.Tab = (props) => (
    <SectionTab name={t("sidePanel.upload")} {...props}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          stroke="#878787"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.4"
          d="M7 14l5-5m0 0l5 5m-5-5v12M21 10V8.8c0-1.68 0-2.52-.327-3.162a3 3 0 00-1.311-1.311C18.72 4 17.88 4 16.2 4H7.8c-1.68 0-2.52 0-3.162.327a3 3 0 00-1.311 1.311C3 6.28 3 7.12 3 8.8V10"
        ></path>
      </svg>
    </SectionTab>
  );

  // @ts-ignore
  uploadSection.Panel = UploadsSection;

  // @ts-ignore
  bgSection.Tab = (props) => (
    <SectionTab name={t("sidePanel.background")} {...props}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          stroke="#878787"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.4"
          d="M1 8.04c0-1.764 0-2.646.343-3.32A3.15 3.15 0 012.72 3.343C3.394 3 4.276 3 6.04 3h10.92c1.764 0 2.646 0 3.32.343a3.15 3.15 0 011.377 1.377C22 5.394 22 6.276 22 8.04v8.82c0 1.764 0 2.646-.343 3.32a3.15 3.15 0 01-1.377 1.377c-.674.343-1.556.343-3.32.343H6.04c-1.764 0-2.646 0-3.32-.343a3.15 3.15 0 01-1.377-1.377C1 19.506 1 18.624 1 16.86V8.04z"
        ></path>
        <path
          stroke="#878787"
          strokeWidth="1.4"
          d="M1 11.4L10.45 3M1 16.65L15.7 3M2.05 21.9L20.95 3M7.3 21.9L22 8.25M13.6 21.9l8.4-8.4"
        ></path>
      </svg>
    </SectionTab>
  );
  // @ts-ignore
  //resize tab
  // sizeSection.Tab = (props) => (
  //   <SectionTab name={t("sidePanel.resize")} {...props}>
  //     <svg
  //       width="24"
  //       height="24"
  //       viewBox="0 0 24 24"
  //       fill="none"
  //       xmlns="http://www.w3.org/2000/svg"
  //     >
  //       <path
  //         fillRule="evenodd"
  //         clipRule="evenodd"
  //         d="M15.7776 3.5C15.256 3.5 14.8331 3.92286 14.8331 4.44448C14.8331 4.96611 15.256 5.38896 15.7776 5.38896H17.2028L13.5913 9.07258C13.2262 9.44506 13.2321 10.043 13.6046 10.4082C13.977 10.7734 14.575 10.7675 14.9402 10.395L18.6107 6.65113V8.22204C18.6107 8.74366 19.0336 9.16652 19.5552 9.16652C20.0768 9.16652 20.4997 8.74366 20.4997 8.22204V4.44448C20.4997 3.92286 20.0768 3.5 19.5552 3.5H15.7776Z"
  //         fill="white"
  //       />
  //       <path
  //         fillRule="evenodd"
  //         clipRule="evenodd"
  //         d="M10.4018 14.9346C10.7706 14.5658 10.7706 13.9677 10.4018 13.5989C10.0329 13.2301 9.43492 13.2301 9.06607 13.5989L5.38896 17.276V15.7785C5.38896 15.2569 4.96611 14.834 4.44448 14.834C3.92286 14.834 3.5 15.2569 3.5 15.7785V19.5561C3.5 20.0777 3.92286 20.5005 4.44448 20.5005H8.22209C8.74371 20.5005 9.16657 20.0777 9.16657 19.5561C9.16657 19.0344 8.74371 18.6116 8.22209 18.6116H6.72473L10.4018 14.9346Z"
  //         fill="white"
  //       />
  //       <path
  //         fillRule="evenodd"
  //         clipRule="evenodd"
  //         d="M14.9336 13.5989C14.5648 13.2301 13.9668 13.2301 13.5979 13.5989C13.2291 13.9677 13.2291 14.5658 13.5979 14.9346L17.2749 18.6115H15.7776C15.256 18.6115 14.8331 19.0344 14.8331 19.556C14.8331 20.0777 15.256 20.5005 15.7776 20.5005H19.5552C20.0768 20.5005 20.4997 20.0777 20.4997 19.556V15.7785C20.4997 15.2568 20.0768 14.834 19.5552 14.834C19.0336 14.834 18.6107 15.2568 18.6107 15.7785V17.2759L14.9336 13.5989Z"
  //         fill="white"
  //       />
  //       <path
  //         fillRule="evenodd"
  //         clipRule="evenodd"
  //         d="M4.44448 3.5C3.92286 3.5 3.5 3.92286 3.5 4.44448V8.22204C3.5 8.74366 3.92286 9.16652 4.44448 9.16652C4.96611 9.16652 5.38896 8.74366 5.38896 8.22204V6.64468L9.05893 10.3944C9.42379 10.7672 10.0218 10.7736 10.3946 10.4087C10.7673 10.0439 10.7738 9.44589 10.4089 9.07311L6.8031 5.38896H8.22209C8.74371 5.38896 9.16657 4.96611 9.16657 4.44448C9.16657 3.92286 8.74371 3.5 8.22209 3.5H4.44448Z"
  //         fill="white"
  //       />
  //     </svg>
  //   </SectionTab>
  // );

  let sections;
  // return sections = [customElementsSection, templatesSection, textSection, photosSection, elementsSection, uploadSection, bgSection, sizeSection];
  // return sections = [templatesSection, textSection, photosSection, elementsSection, uploadSection, bgSection, sizeSection];
  return (sections = [
    templatesSection,
    textSection,
    photosSection,
    customElementsSection,
    uploadSection,
    bgSection,
  ]);
};

export default SidePanelSections;
