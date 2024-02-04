import s from "./DisplayModeBtns.module.scss";

interface DisplayModeBtnsProps {
  displayMode: string; // grid, list
  setDisplayMode: any;
}

const DisplayModeBtns: React.FC<
  React.PropsWithChildren<DisplayModeBtnsProps>
> = ({ displayMode, setDisplayMode }) => {
  return (
    <div className={s.controls}>
      {displayMode == "grid" ? (
        <div
          className={s.controlItem}
          onClick={() => {
            setDisplayMode("list");
          }}
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 28 28"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="7.39832"
              y="6.64844"
              width="5.95995"
              height="5.95995"
              rx="0.5"
            />
            <rect
              x="15.5197"
              y="14.7656"
              width="5.95995"
              height="5.95995"
              rx="0.5"
            />
            <rect
              x="7.39832"
              y="14.7656"
              width="5.95995"
              height="5.95995"
              rx="0.5"
            />
            <rect
              x="15.5197"
              y="6.64844"
              width="5.95995"
              height="5.95995"
              rx="0.5"
            />
          </svg>
        </div>
      ) : (
        <div
          className={s.controlItem}
          onClick={() => {
            setDisplayMode("grid");
          }}
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 28 28"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M6.92773 13.6949H20.9277M6.92773 8.29492H20.9277M6.92773 19.0949H20.9277" />
          </svg>
        </div>
      )}
    </div>
  );
};

export default DisplayModeBtns;
