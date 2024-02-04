import { Trans, useTranslation } from "next-i18next";
import React, {
  ComponentProps,
  Dispatch,
  SetStateAction,
  useState,
} from "react";
import { useCookies } from "react-cookie";
import { Api } from "../../api";
import { KEEP_TRASH_DAYS } from "../../utils/constants";
import { useDropdown } from "../../utils/useDropdown";
import { DesignGridElement } from "../Dashboard/DesignElements";
import DesignElementDropdownContent from "../Dashboard/DesignElements/DropdownContent";
import Dropdown from "../Dropdown";
import { DesignElementTrashDropdownContent } from "../Trash/DesignElementTrashDropdownContent";
import { BaseGrid } from "./BaseGrid";
import s from "./Empty.module.scss";
import { DeletingIsland } from "./DeletingIsland";

interface DesignsGridProps
  extends Omit<ComponentProps<typeof BaseGrid>, "children"> {
  templates: any[];
  isEmpty: boolean;
  setTemplates: Dispatch<SetStateAction<any[]>>;
  setCopyTemplateItem?: Dispatch<SetStateAction<any>>;
  copyTemplateItem?: any;
  trash?: boolean;
  onCreateNewTemplateClick?: () => unknown;
  selectedIds?: string[];
  setSelectedIds?: Dispatch<SetStateAction<string[]>>;
  onMoveToTrash?: (template: any) => unknown;
}

export const DesignsGrid: React.FC<DesignsGridProps> = ({
  templates,
  isEmpty,
  setTemplates,
  onCreateNewTemplateClick,
  setCopyTemplateItem,
  copyTemplateItem,
  trash,
  selectedIds = [],
  setSelectedIds,
  onMoveToTrash,
  ...baseProps
}) => {
  const { t } = useTranslation("Dashboard");
  const { t: designT } = useTranslation("design");
  const [cookie] = useCookies();
  const [isCopying, setIsCopying] = useState(false);
  const [deletingTemplate, setDeletingTemplate] = React.useState<any>(null);
  const [templateDeleted, setTemplateDeleted] = React.useState(false);
  const [isConfirmingDeletion, setIsConfirmingDeletion] = React.useState(false);

  const { closeDropdown, openDropdown, anchor, popperRef, activeItem } =
    useDropdown();

  const handleNewTemplate = (item: any) => {
    closeDropdown();

    setCopyTemplateItem?.(null);

    setTemplates((templates) => {
      return [item, ...templates];
    });
  };

  const handleUpdateTemplate = (
    id: string,
    newProperties: Record<string, any>
  ) => {
    setTemplates((templates) => {
      const templateToUpdateIndex = templates.findIndex(
        (template) => template._id === id
      );
      if (templateToUpdateIndex === -1) return templates;
      const templateToUpdate = templates[templateToUpdateIndex];
      const newTemplate = {
        ...templateToUpdate,
        ...newProperties,
        updatedAt: new Date(),
      };
      const newTemplates = [...templates];
      newTemplates.splice(templateToUpdateIndex, 1, newTemplate);
      return newTemplates;
    });
  };

  const handleCopyStart = async (template: any) => {
    const title = designT("content.copyOf", { name: template?.title });
    setCopyTemplateItem?.({ ...template, _id: "load", title });

    closeDropdown();

    setIsCopying(true);
    const result = await Api.post<{ _id: string }>(
      `user/templates/clone/${template?._id}`,
      {
        title,
      },
      { headers: { Authorization: cookie.user_token } }
    );

    setIsCopying(false);

    setTimeout(() => {
      handleNewTemplate(result.data);
    }, 1000);
  };

  const removeTemplate = (id: string) => {
    setTemplates((templates) => {
      return templates.filter((item) => item._id !== id);
    });
  };

  const withRemoval =
    (cb: (template: any) => Promise<unknown>, instantRemoval = true) =>
    async (template: any) => {
      closeDropdown();

      if (instantRemoval) {
        removeTemplate(template._id);
      }

      await cb(template);

      if (!instantRemoval) {
        removeTemplate(template._id);
      }
    };

  const handleMoveToTrash = withRemoval(async (template: any) => {
    onMoveToTrash?.(template);

    await Api.patch(`user/templates/${template._id}/trash`, undefined, {
      headers: { Authorization: cookie.user_token },
    });
  });

  const handleRestore = withRemoval(async (template: any) => {
    await Api.patch(`user/templates/${template._id}/restore`, undefined, {
      headers: { Authorization: cookie.user_token },
    });
  });

  const handleDelete = withRemoval(async (template: any) => {
    setDeletingTemplate(template);

    await Api.delete(`user/templates/${template._id}`, {
      headers: { Authorization: cookie.user_token },
    });

    setTemplateDeleted(true);

    setTimeout(() => {
      setDeletingTemplate(null);
      setTemplateDeleted(false);
    }, 2000);
  }, false);

  const ns = trash ? "designTrash" : "design";
  const imgNs = trash ? "designsTrash-blank" : "designs-blank";

  return (
    <>
      {isEmpty ? (
        <div className={s.emptyContainer}>
          <img src={`/dashboard/${imgNs}.svg`} alt="Empty illustration" />
          <p className={s.title}>
            <Trans t={t} i18nKey={`empty.${ns}.title`} />
          </p>

          <p className={s.subtitle}>
            <Trans
              t={t}
              i18nKey={`empty.${ns}.subtitle`}
              components={
                {
                  action: <button onClick={onCreateNewTemplateClick} />,
                  days: KEEP_TRASH_DAYS,
                } as any
              }
            />
          </p>
        </div>
      ) : (
        <BaseGrid {...baseProps}>
          {templates.map((item: any) => {
            const isSelected = selectedIds.includes(item._id);

            return (
              <DesignGridElement
                userTemplate={true}
                key={item._id}
                item={item}
                isSelected={isSelected}
                onChangeCheckbox={() => {
                  if (isSelected) {
                    setSelectedIds?.((ids) =>
                      ids.filter((id) => id !== item._id)
                    );
                  } else {
                    setSelectedIds?.((ids) => [...ids, item._id]);
                  }
                }}
                selectable={!!setSelectedIds}
                alwaysShowSelection={selectedIds.length > 0}
                threeDots
                threeDotsAction={openDropdown}
                activeItem={activeItem}
                showUpload={item?._id === "load"}
                hasLoaded={!isCopying}
                trash={trash}
              />
            );
          })}
        </BaseGrid>
      )}

      <DeletingIsland
        deletedItem={
          deletingTemplate
            ? {
                ...deletingTemplate,
                preview: deletingTemplate?.preview?.[0],
              }
            : undefined
        }
        isItemDeleted={templateDeleted}
      />

      <Dropdown
        anchor={anchor}
        popperRef={popperRef}
        onClose={closeDropdown}
        minHeight={isConfirmingDeletion ? 0 : 320}
      >
        {trash ? (
          <DesignElementTrashDropdownContent
            template={activeItem}
            onDelete={handleDelete}
            onRestore={handleRestore}
            onDeletingChange={setIsConfirmingDeletion}
          />
        ) : (
          <>
            {activeItem && (
              <DesignElementDropdownContent
                template={activeItem}
                onTemplateUpdate={handleUpdateTemplate}
                onCopyStart={handleCopyStart}
                onMoveToTrashTrash={handleMoveToTrash}
              />
            )}
          </>
        )}
      </Dropdown>
    </>
  );
};
