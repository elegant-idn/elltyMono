import clsx from "clsx";
import React, { useState } from "react";
import s from "./Toggler.module.scss";

interface TogglerProps {
  checked?: boolean;
  onChange?: () => void;
}

const Toggler: React.FC<React.PropsWithChildren<TogglerProps>> = ({
  checked = false,
  onChange = function () {},
}) => {
  const [checkedState, setCheckedState] = useState<boolean>(!checked);
  return (
    <div
      className={clsx(s.root, !checkedState && s.active)}
      onClick={() => {
        onChange();
        setCheckedState(!checkedState);
      }}
    >
      {/* {`${checkedState ? 14 : 50}`} */}
      <svg
        className={clsx(s.svg, !checkedState && s.activeCircle)}
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          y="14"
          width="14"
          height="14"
          rx="7"
          transform="rotate(-90 0 14)"
          fill="#EEEEEE"
        />
      </svg>
    </div>
  );
};

export default Toggler;
