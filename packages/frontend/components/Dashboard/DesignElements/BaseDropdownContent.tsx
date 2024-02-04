import clsx from "clsx";
import { Trans, useTranslation } from "next-i18next";

import React, { useState } from "react";
import { useCookies } from "react-cookie";
import { Api } from "../../../api";
import { useElapsingTime } from "../../ElapsingTime";
import s from "./DesignElementDropdownContent.module.scss";

interface BaseDropdownContentProps {
  template?: any;
  onTemplateUpdate?: (
    id: string,
    newProperties: Record<string, any>
  ) => unknown;

  children?: React.ReactNode;
}

const DesignElementBaseDropdownContent: React.FC<BaseDropdownContentProps> = ({
  template,
  onTemplateUpdate,
  children,
}) => {
  const { t } = useTranslation("common");
  const [cookie] = useCookies();

  const [editingTitle, setEditingTitle] = useState(false);
  const [designName, setDesignName] = useState(template?.title ?? "");
  const timeText = useElapsingTime(new Date(template?.updatedAt));

  const handleSaveTitle = async () => {
    if (!cookie.user_token || !template._id) return;
    onTemplateUpdate?.(template._id, { title: designName });
    setEditingTitle(false);

    const axiosBody = JSON.stringify({
      title: designName,
    });

    const axiosHeaders = {
      headers: {
        Authorization: cookie.user_token,
      },
    };

    await Api.patch(
      `user/templates/${template._id}/title`,
      axiosBody,
      axiosHeaders
    ).catch((err) => {
      console.log(err);
    });
  };

  return (
    <div className={s.root}>
      <div className={clsx(s.header, s.xPadding)}>
        {editingTitle ? (
          <div className={s.nameInput}>
            <form onSubmit={handleSaveTitle}>
              <input
                onChange={(e: any) => setDesignName(e.target.value)}
                defaultValue={designName}
                onBlur={handleSaveTitle}
                autoFocus={true}
              />
            </form>
          </div>
        ) : (
          <div
            className={s.titleContainer}
            onClick={(e) => {
              e.stopPropagation();
              setEditingTitle(true);
            }}
          >
            <div className={s.title}>{designName}</div>
            <svg
              width="17"
              height="17"
              viewBox="0 0 17 17"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15.3571 15.612H9.14863M1 16L5.30655 14.3436C5.58201 14.2377 5.71974 14.1847 5.84859 14.1155C5.96305 14.0541 6.07216 13.9832 6.17479 13.9036C6.29033 13.8139 6.39467 13.7096 6.60336 13.5009L15.3571 4.74715C16.2143 3.88993 16.2143 2.50012 15.3571 1.64291C14.4999 0.785698 13.1101 0.785697 12.2529 1.64291L3.49913 10.3966C3.29044 10.6053 3.1861 10.7097 3.09644 10.8252C3.0168 10.9278 2.94589 11.0369 2.88445 11.1514C2.81528 11.2803 2.76231 11.418 2.65637 11.6934L1 16ZM1 16L2.59722 11.8473C2.71152 11.5501 2.76866 11.4015 2.86668 11.3335C2.95234 11.274 3.05834 11.2515 3.16078 11.2711C3.27799 11.2934 3.39056 11.406 3.61569 11.6311L5.36888 13.3843C5.59401 13.6095 5.70658 13.722 5.72896 13.8392C5.74852 13.9417 5.72603 14.0477 5.66655 14.1333C5.59849 14.2314 5.44991 14.2885 5.15274 14.4028L1 16Z"
                stroke="#242124"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        )}
        <p className={s.time}>
          <Trans
            t={t}
            i18nKey="timeAction.edit"
            values={{
              timeElapsed: timeText,
            }}
          />
        </p>
      </div>

      {children}
    </div>
  );
};

export default DesignElementBaseDropdownContent;
