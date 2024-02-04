import clsx from "clsx";
import { useTranslation } from "next-i18next";

import React from "react";
import { UploadElementBaseDropdownContent } from "./UploadElementBaseDropdownContent";
import s from "./UploadElementDropdownContent.module.scss";

interface UploadElementDropdownContentProps {
  upload?: any;
  onUploadUpdate?: (id: string, newProperties: Record<string, any>) => unknown;
  onUploadDownload?: () => unknown;
  onUploadToTrash: (upload: any) => unknown;
}

export const UploadElementDropdownContent: React.FC<
  UploadElementDropdownContentProps
> = ({ upload, onUploadUpdate, onUploadDownload, onUploadToTrash }) => {
  const { t } = useTranslation("common");
  const file = t("file", { returnObjects: true }) as any;

  async function toDataURL(url: string) {
    const blob = await fetch(url).then((res) => res.blob());
    return URL.createObjectURL(blob);
  }

  const download = async () => {
    const a = document.createElement("a");
    a.href = await toDataURL(upload.src);
    a.download = upload.title;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    onUploadDownload?.();
  };

  const actions = [
    {
      name: file.download,
      icon: (
        <svg
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M17 11.6667V12.7333C17 14.2268 17 14.9735 16.7094 15.544C16.4537 16.0457 16.0457 16.4537 15.544 16.7094C14.9735 17 14.2268 17 12.7333 17H5.26667C3.77319 17 3.02646 17 2.45603 16.7094C1.95426 16.4537 1.54631 16.0457 1.29065 15.544C1 14.9735 1 14.2268 1 12.7333V11.6667M13.4444 7.22222L9 11.6667M9 11.6667L4.55556 7.22222M9 11.6667V1"
            stroke="#242124"
            strokeWidth="1.3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      onClick: download,
    },
    {
      name: file.moveToTrash,
      icon: (
        <svg
          width="18"
          height="19"
          viewBox="0 0 18 19"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M8.71011 0.986817H8.73305H10.2204H10.2433H10.2433C10.7444 0.986811 11.1535 0.986807 11.4859 1.00957C11.8281 1.03301 12.1402 1.08292 12.4352 1.20893C12.8956 1.40558 13.2915 1.72851 13.5478 2.15018C13.7196 2.43284 13.7864 2.73333 13.8166 3.04377C13.8331 3.21336 13.8401 3.40411 13.8429 3.61486H15.591H15.6023H17.3417C17.7007 3.61486 17.9917 3.90588 17.9917 4.26486C17.9917 4.62385 17.7007 4.91486 17.3417 4.91486H16.2057L15.6342 13.5374L15.6325 13.564C15.5881 14.2338 15.5523 14.7744 15.4884 15.2117C15.4226 15.6625 15.3208 16.0557 15.1163 16.4168C14.79 16.9929 14.2975 17.4567 13.7031 17.7465C13.3302 17.9283 12.9321 18.0046 12.4797 18.0407C12.0413 18.0757 11.5023 18.0757 10.8354 18.0757H10.8353H10.8084H8.1755H8.14857H8.14851C7.48159 18.0757 6.94258 18.0757 6.50416 18.0407C6.05182 18.0046 5.65372 17.9283 5.28078 17.7465C4.68639 17.4567 4.19387 16.9929 3.8676 16.4168C3.66313 16.0557 3.56125 15.6625 3.49546 15.2117C3.43163 14.7744 3.39581 14.2338 3.35142 13.564L3.34966 13.5374L2.77823 4.91486H1.64219C1.2832 4.91486 0.992188 4.62385 0.992188 4.26486C0.992188 3.90588 1.2832 3.61486 1.64219 3.61486H3.38156H3.39288H5.11046C5.11335 3.40411 5.12026 3.21336 5.13679 3.04377C5.16705 2.73333 5.23378 2.43284 5.40559 2.15018C5.66188 1.72851 6.0578 1.40558 6.51819 1.20893C6.8132 1.08292 7.12531 1.03301 7.46754 1.00957C7.79988 0.986807 8.20897 0.986811 8.7101 0.986817H8.71011ZM12.5228 3.16987C12.5347 3.29202 12.5402 3.43531 12.5428 3.61486H6.41063C6.41321 3.43531 6.41876 3.29202 6.43066 3.16987C6.45107 2.96053 6.48565 2.87612 6.51648 2.82539C6.61667 2.66055 6.78958 2.50664 7.02883 2.40444C7.13153 2.36058 7.27857 2.32556 7.55637 2.30653C7.83901 2.28717 8.20343 2.28682 8.73305 2.28682H10.2204C10.75 2.28682 11.1144 2.28717 11.397 2.30653C11.6748 2.32556 11.8219 2.36058 11.9246 2.40444C12.1638 2.50664 12.3367 2.66055 12.4369 2.82539C12.4678 2.87612 12.5023 2.96053 12.5228 3.16987ZM14.9028 4.91486H4.08108L4.64681 13.4514C4.69338 14.154 4.72628 14.6434 4.78183 15.024C4.83624 15.3968 4.90596 15.6122 4.9988 15.7762C5.19603 16.1244 5.49314 16.4038 5.85045 16.578C6.01801 16.6596 6.23505 16.7151 6.60764 16.7448C6.98824 16.7752 7.47529 16.7757 8.1755 16.7757H10.8084C11.5086 16.7757 11.9957 16.7752 12.3763 16.7448C12.7488 16.7151 12.9659 16.6596 13.1334 16.578C13.4908 16.4038 13.7879 16.1244 13.9851 15.7762C14.0779 15.6122 14.1477 15.3968 14.2021 15.024C14.2576 14.6434 14.2905 14.154 14.3371 13.4514L14.9028 4.91486ZM8.30684 6.86994C8.30684 6.51096 8.01582 6.21994 7.65684 6.21994C7.29785 6.21994 7.00684 6.51096 7.00684 6.86994V14.3509C7.00684 14.7098 7.29785 15.0009 7.65684 15.0009C8.01582 15.0009 8.30684 14.7098 8.30684 14.3509V6.86994ZM11.612 6.86994C11.612 6.51096 11.321 6.21994 10.962 6.21994C10.603 6.21994 10.312 6.51096 10.312 6.86994V14.3509C10.312 14.7098 10.603 15.0009 10.962 15.0009C11.321 15.0009 11.612 14.7098 11.612 14.3509V6.86994Z"
            fill="#232327"
          />
        </svg>
      ),
      onClick: () => onUploadToTrash(upload),
    },
  ];

  return (
    <UploadElementBaseDropdownContent
      upload={upload}
      onUploadUpdate={onUploadUpdate}
    >
      <div className={s.actions}>
        {actions.map((action, i) => {
          return (
            <button
              onClick={action.onClick}
              key={i}
              className={clsx(s.xPadding)}
            >
              {action.icon}

              {action.name}
            </button>
          );
        })}
      </div>
    </UploadElementBaseDropdownContent>
  );
};
