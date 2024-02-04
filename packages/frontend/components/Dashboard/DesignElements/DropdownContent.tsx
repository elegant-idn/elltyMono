import clsx from "clsx";
import { useTranslation } from "next-i18next";

import React from "react";
import DesignElementBaseDropdownContent from "./BaseDropdownContent";
import s from "./DesignElementDropdownContent.module.scss";
import { DropdownActions } from "../../Dropdown/DropdownActions";

interface DropdownContentProps {
  template?: any;
  onCopyStart?: (template: any) => unknown;
  onMoveToTrashTrash?: (template: any) => unknown;
  onTemplateUpdate?: (
    id: string,
    newProperties: Record<string, any>
  ) => unknown;
}

const DesignElementDropdownContent: React.FC<DropdownContentProps> = ({
  template,
  onTemplateUpdate,
  onCopyStart,
  onMoveToTrashTrash,
}) => {
  const { t } = useTranslation("common");
  const file = t("file", { returnObjects: true }) as any;

  // const [store, setStore] = useState<null | StoreType>(null);

  const makeCopy = async () => {
    onCopyStart?.(template);
  };

  const moveToTrash = async () => {
    onMoveToTrashTrash?.(template);
  };

  // const download = async () => {
  //   const storeLib = createStore({
  //     key: "5WZgkgr7CZj0XSGxxdjj",
  //     showCredit: false,
  //   });

  //   setStore(storeLib);

  //   const axiosHeaders = {
  //     headers: {
  //       Authorization: cookie.user_token,
  //     },
  //   };

  //   const result = await Api.get(
  //     `/user/templates/${template._id}`,
  //     axiosHeaders
  //   );

  //   storeLib.loadJSON(result.data);

  //   await storeLib.waitLoading();

  //   setView("download");
  // };

  const actions = [
    {
      name: file.MakeACopy,
      icon: (
        <svg
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5 1H11.3111C13.3024 1 14.2981 1 15.0586 1.38753C15.7277 1.72842 16.2716 2.27235 16.6125 2.94137C17 3.70194 17 4.69759 17 6.68889V13M3.84444 17H11.0444C12.0401 17 12.5379 17 12.9182 16.8062C13.2527 16.6358 13.5247 16.3638 13.6951 16.0293C13.8889 15.649 13.8889 15.1512 13.8889 14.1556V6.95556C13.8889 5.95991 13.8889 5.46208 13.6951 5.08179C13.5247 4.74728 13.2527 4.47532 12.9182 4.30488C12.5379 4.11111 12.0401 4.11111 11.0444 4.11111H3.84444C2.8488 4.11111 2.35097 4.11111 1.97068 4.30488C1.63617 4.47532 1.36421 4.74728 1.19377 5.08179C1 5.46208 1 5.95991 1 6.95556V14.1556C1 15.1512 1 15.649 1.19377 16.0293C1.36421 16.3638 1.63617 16.6358 1.97068 16.8062C2.35097 17 2.8488 17 3.84444 17Z"
            stroke="#242124"
            strokeWidth="1.3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      onClick: makeCopy,
    },

    // {
    //   name: file.download,
    //   icon: "download",
    //   onClick: download,
    // },
    {
      name: file.moveToTrash,
      icon: (
        <svg
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M7.78067 0.0527345H7.80349H9.29082H9.31364H9.31365C9.81489 0.0527295 10.2239 0.0527254 10.5561 0.0753442C10.8981 0.0986297 11.2098 0.148198 11.5044 0.273299C11.9643 0.468583 12.3606 0.789577 12.6174 1.2096C12.7898 1.49153 12.8567 1.79133 12.8871 2.10062C12.9035 2.26856 12.9105 2.45729 12.9134 2.6656H14.6535H14.6649H16.4042C16.7632 2.6656 17.0542 2.95662 17.0542 3.3156C17.0542 3.67459 16.7632 3.9656 16.4042 3.9656H15.2679L14.6967 12.5337L14.6949 12.5605L14.6949 12.5606L14.6949 12.5606C14.6506 13.2261 14.6147 13.7638 14.5509 14.1987C14.485 14.6474 14.3829 15.0392 14.178 15.3989C13.8512 15.9725 13.3583 16.4336 12.7642 16.7215C12.3917 16.9021 11.994 16.9779 11.5419 17.0138C11.1037 17.0485 10.5648 17.0485 9.8978 17.0485H9.89773H9.87089H7.238H7.21116H7.2111C6.54409 17.0485 6.00522 17.0485 5.56696 17.0138C5.11492 16.9779 4.71724 16.9021 4.34465 16.7215C3.75059 16.4336 3.25769 15.9725 2.93092 15.3989C2.72597 15.0392 2.62391 14.6474 2.55804 14.1987C2.49417 13.7637 2.45833 13.226 2.41396 12.5605L2.41218 12.5337L1.84097 3.9656H0.704687C0.345702 3.9656 0.0546875 3.67459 0.0546875 3.3156C0.0546875 2.95662 0.345702 2.6656 0.704687 2.6656H2.44403H2.45542H4.18094C4.18386 2.45729 4.19079 2.26856 4.20726 2.10062C4.23758 1.79133 4.30452 1.49153 4.47691 1.2096C4.73372 0.789577 5.12999 0.468583 5.58991 0.273299C5.88454 0.148198 6.19624 0.0986297 6.53824 0.0753442C6.87045 0.0527254 7.27943 0.0527295 7.78066 0.0527345H7.78067ZM11.5933 2.22747C11.6051 2.34783 11.6106 2.48893 11.6132 2.6656H5.48111C5.48371 2.48893 5.48925 2.34783 5.50105 2.22747C5.52139 2.02006 5.55577 1.93722 5.58602 1.88774C5.68569 1.72472 5.85826 1.57169 6.09799 1.4699C6.20106 1.42614 6.34851 1.39127 6.62655 1.37234C6.90935 1.35309 7.27393 1.35273 7.80349 1.35273H9.29082C9.82039 1.35273 10.185 1.35309 10.4678 1.37234C10.7458 1.39127 10.8933 1.42614 10.9963 1.4699C11.2361 1.57169 11.4086 1.72472 11.5083 1.88774C11.5386 1.93722 11.5729 2.02006 11.5933 2.22747ZM13.965 3.9656H3.14386L3.7093 12.4472C3.75587 13.1458 3.78876 13.632 3.84425 14.0099C3.89858 14.38 3.96812 14.5933 4.06048 14.7554C4.25721 15.1007 4.55394 15.3783 4.91159 15.5517C5.07949 15.633 5.29696 15.6882 5.66983 15.7178C6.05062 15.7481 6.53785 15.7485 7.238 15.7485H9.87089C10.571 15.7485 11.0583 15.7481 11.4391 15.7178C11.8119 15.6882 12.0294 15.633 12.1973 15.5517C12.555 15.3783 12.8517 15.1007 13.0484 14.7554C13.1408 14.5933 13.2103 14.38 13.2647 14.0099C13.3201 13.632 13.353 13.1458 13.3996 12.4472L13.965 3.9656ZM7.38122 5.90503C7.38122 5.54604 7.09021 5.25503 6.73122 5.25503C6.37224 5.25503 6.08122 5.54604 6.08122 5.90503V13.3417C6.08122 13.7007 6.37224 13.9917 6.73122 13.9917C7.09021 13.9917 7.38122 13.7007 7.38122 13.3417V5.90503ZM10.6864 5.90503C10.6864 5.54604 10.3954 5.25503 10.0364 5.25503C9.67742 5.25503 9.38641 5.54604 9.38641 5.90503V13.3417C9.38641 13.7007 9.67742 13.9917 10.0364 13.9917C10.3954 13.9917 10.6864 13.7007 10.6864 13.3417V5.90503Z"
            fill="#232327"
          />
        </svg>
      ),
      onClick: moveToTrash,
    },
  ];

  return (
    <DesignElementBaseDropdownContent
      onTemplateUpdate={onTemplateUpdate}
      template={template}
    >
      <DropdownActions>
        {actions.map((action, i) => {
          return (
            <button onClick={action.onClick} key={i}>
              {action.icon}

              {action.name}
            </button>
          );
        })}
      </DropdownActions>
    </DesignElementBaseDropdownContent>
  );
};

export default DesignElementDropdownContent;
