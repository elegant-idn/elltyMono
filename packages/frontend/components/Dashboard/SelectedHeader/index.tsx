import s from "./SelectedHeader.module.scss";

interface SelectedHeaderProps {
  selectedCount: number;
  onClickEdit: any;
  onClickDelete: any;
  local: string;
}

const SelectedHeader: React.FC<
  React.PropsWithChildren<SelectedHeaderProps>
> = ({ selectedCount, onClickEdit, onClickDelete, local }) => {
  return (
    <div className={s.root}>
      {selectedCount ? (
        <div className={s.wrapper}>
          {selectedCount} {local}
          {selectedCount == 1 && (
            <div className={s.svgWrapper} onClick={onClickEdit}>
              <svg
                width="13"
                height="13"
                viewBox="0 0 13 13"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M3.58033 11.0502L10.6263 4.00421L9.20542 2.58333L2.20753 9.58122L3.58033 11.0502ZM2.70099 11.5738L1.61379 10.4105L1.3366 11.7717L2.70099 11.5738ZM11.5141 3.11642L11.3334 3.29711L9.91252 1.87622L10.0932 1.69554C10.4816 1.30718 11.1181 1.30618 11.5108 1.69888C11.9034 2.09157 11.9024 2.72807 11.5141 3.11642ZM1.12458 12.8129L3.26054 12.5031C3.47395 12.4722 3.67164 12.3731 3.82413 12.2206L12.2212 3.82353C13.0022 3.04248 12.9989 1.77282 12.2179 0.991768C11.4368 0.21072 10.1671 0.207385 9.3861 0.988434L0.966907 9.40762C0.828147 9.54638 0.73328 9.7229 0.694124 9.91519L0.285024 11.9242L0.072998 12.9654L1.12458 12.8129Z"
                  fill="#1F2128"
                />
              </svg>
            </div>
          )}
          <div className={s.svgWrapper} onClick={onClickDelete}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2.95947 6.59766L3.41451 14.3763C3.44544 14.9049 3.8832 15.3179 4.4128 15.3179H11.1984C11.728 15.3179 12.1658 14.9049 12.1967 14.3762L12.6518 6.59766"
                stroke="#1F2128"
                strokeLinecap="round"
              />
              <path
                d="M0.805176 4.58648H14.8052H11.8885L10.7218 1.31641H4.88851L3.72184 4.58648H0.805176Z"
                stroke="#1F2128"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default SelectedHeader;
