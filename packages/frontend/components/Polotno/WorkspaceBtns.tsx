import s from "./Polotno.module.scss";
import clsx from "clsx";
import { observer } from "mobx-react-lite";

interface WorkspaceBtnsProps {
  store: any;
}

export const AddPageBtn: React.FC<React.PropsWithChildren<WorkspaceBtnsProps>> =
  observer(({ store }) => {
    return (
      <button
        className={s.workspaceBtn}
        onClick={() => {
          store.addPage();
        }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12.0001 8.32715V15.6535"
            stroke="#36373C"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M15.6666 11.9904H8.33331"
            stroke="#36373C"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M16.6857 2H7.31429C4.04762 2 2 4.31208 2 7.58516V16.4148C2 19.6879 4.0381 22 7.31429 22H16.6857C19.9619 22 22 19.6879 22 16.4148V7.58516C22 4.31208 19.9619 2 16.6857 2Z"
            stroke="#36373C"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    );
  });

// @ts-ignore
export const ClonePageBtn: React.FC<
  React.PropsWithChildren<WorkspaceBtnsProps>
> = observer(({ store }) => {
  return (
    <button
      className={s.workspaceBtn}
      onClick={() => {
        store.activePage?.clone();
      }}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M11.4523 2.25C10.2377 2.25 9.19022 2.67319 8.43826 3.44465C7.73192 4.16933 7.33393 5.15179 7.25999 6.25H6.72C5.39096 6.25 4.25447 6.72543 3.4539 7.58421C2.65878 8.43715 2.25 9.60833 2.25 10.9096V17.0904C2.25 18.3907 2.65657 19.562 3.45107 20.4154C4.25121 21.2749 5.3881 21.75 6.72 21.75H13.28C14.6119 21.75 15.7488 21.2749 16.5489 20.4154C17.3434 19.562 17.75 18.3907 17.75 17.0904V16.7459C18.9122 16.6997 19.9074 16.2592 20.6201 15.4937C21.3688 14.6897 21.75 13.5882 21.75 12.3696V6.63035C21.75 5.41178 21.3688 4.31027 20.6201 3.50625C19.8658 2.69619 18.7952 2.25 17.545 2.25H11.4523ZM17.75 15.2443C18.5276 15.2006 19.1166 14.9073 19.5224 14.4715C19.9687 13.9922 20.25 13.2786 20.25 12.3696V6.63035C20.25 5.72143 19.9687 5.00776 19.5224 4.52848C19.0817 4.05524 18.4248 3.75 17.545 3.75H11.4523C10.5981 3.75 9.95274 4.0399 9.51242 4.49165C9.10968 4.90484 8.83423 5.49955 8.76462 6.25H13.28C14.6119 6.25 15.7488 6.72513 16.5489 7.58457C17.3434 8.43795 17.75 9.60925 17.75 10.9096V15.2443ZM4.5511 8.60703C4.05788 9.13611 3.75 9.91974 3.75 10.9096V17.0904C3.75 18.0812 4.05677 18.8647 4.54893 19.3933C5.03545 19.9159 5.75857 20.25 6.72 20.25H13.28C14.2414 20.25 14.9645 19.9159 15.4511 19.3933C15.9432 18.8647 16.25 18.0812 16.25 17.0904V10.9096C16.25 9.91882 15.9432 9.13531 15.4511 8.60668C14.9645 8.0841 14.2414 7.75 13.28 7.75H6.72C5.76238 7.75 5.03886 8.0838 4.5511 8.60703ZM10.75 11.5C10.75 11.0858 10.4142 10.75 10 10.75C9.58579 10.75 9.25 11.0858 9.25 11.5V13.25H7.5C7.08579 13.25 6.75 13.5858 6.75 14C6.75 14.4142 7.08579 14.75 7.5 14.75H9.25V16.5C9.25 16.9142 9.58579 17.25 10 17.25C10.4142 17.25 10.75 16.9142 10.75 16.5V14.75H12.5C12.9142 14.75 13.25 14.4142 13.25 14C13.25 13.5858 12.9142 13.25 12.5 13.25H10.75V11.5Z"
          fill="#36373C"
        />
      </svg>
    </button>
  );
});

export const DeletePageBtn: React.FC<
  React.PropsWithChildren<WorkspaceBtnsProps>
> = observer(({ store }) => {
  return (
    <button
      className={clsx(s.workspaceBtn, store.pages.length == 1 && "hidden")}
      onClick={() => {
        store.deletePages([store.activePage.id]);
      }}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M19.3247 9.46826C19.3247 9.46826 18.7817 16.2033 18.4667 19.0403C18.3167 20.3953 17.4797 21.1893 16.1087 21.2143C13.4997 21.2613 10.8877 21.2643 8.27967 21.2093C6.96067 21.1823 6.13767 20.3783 5.99067 19.0473C5.67367 16.1853 5.13367 9.46826 5.13367 9.46826"
          stroke="#1F2128"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M20.708 6.23975H3.75"
          stroke="#1F2128"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M17.4406 6.23973C16.6556 6.23973 15.9796 5.68473 15.8256 4.91573L15.5826 3.69973C15.4326 3.13873 14.9246 2.75073 14.3456 2.75073H10.1126C9.53358 2.75073 9.02558 3.13873 8.87558 3.69973L8.63258 4.91573C8.47858 5.68473 7.80258 6.23973 7.01758 6.23973"
          stroke="#1F2128"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
});

export const MovePageUpBtn: React.FC<
  React.PropsWithChildren<WorkspaceBtnsProps>
> = observer(({ store }) => {
  const idx = store.pages.findIndex(
    (page: any) => page.id == store.activePage.id
  );

  const movePageUp = () => {
    store.activePage?.setZIndex(idx - 1);
    store.selectPage(store.pages[idx - 1].id);
  };

  return (
    <button
      className={clsx(
        s.workspaceBtn,
        idx == 0 && s.disabled,
        store.pages.length == 1 && "hidden"
      )}
      onClick={movePageUp}
      disabled={idx == 0 && true}
    >
      <svg
        style={{ transform: "rotate(180deg)" }}
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g id="Iconly/Light-outline/Arrow - Down 2">
          <g id="Arrow - Down 2">
            <path
              id="Arrow - Down 2_2"
              d="M4.24106 7.7459C4.53326 7.44784 4.99051 7.42074 5.31272 7.66461L5.40503 7.7459L12 14.4734L18.595 7.7459C18.8872 7.44784 19.3444 7.42074 19.6666 7.66461L19.7589 7.7459C20.0511 8.04396 20.0777 8.51037 19.8386 8.83904L19.7589 8.93321L12.582 16.2541C12.2898 16.5522 11.8325 16.5793 11.5103 16.3354L11.418 16.2541L4.24106 8.93321C3.91965 8.60534 3.91965 8.07376 4.24106 7.7459Z"
              fill="#1F2128"
            />
          </g>
        </g>
      </svg>
    </button>
  );
});

export const MovePageDownBtn: React.FC<
  React.PropsWithChildren<WorkspaceBtnsProps>
> = observer(({ store }) => {
  const idx = store.pages.findIndex(
    (page: any) => page.id == store.activePage.id
  );

  const movePageDown = () => {
    store.activePage?.setZIndex(idx + 1);
    store.selectPage(store.pages[idx + 1].id);
  };

  return (
    <button
      className={clsx(
        s.workspaceBtn,
        store.pages.length - 1 == idx && s.disabled,
        store.pages.length == 1 && "hidden"
      )}
      onClick={movePageDown}
      disabled={idx == store.pages.length - 1 && true}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g id="Iconly/Light-outline/Arrow - Down 2">
          <g id="Arrow - Down 2">
            <path
              id="Arrow - Down 2_2"
              d="M4.24106 7.7459C4.53326 7.44784 4.99051 7.42074 5.31272 7.66461L5.40503 7.7459L12 14.4734L18.595 7.7459C18.8872 7.44784 19.3444 7.42074 19.6666 7.66461L19.7589 7.7459C20.0511 8.04396 20.0777 8.51037 19.8386 8.83904L19.7589 8.93321L12.582 16.2541C12.2898 16.5522 11.8325 16.5793 11.5103 16.3354L11.418 16.2541L4.24106 8.93321C3.91965 8.60534 3.91965 8.07376 4.24106 7.7459Z"
              fill="#1F2128"
            />
          </g>
        </g>
      </svg>
    </button>
  );
});
