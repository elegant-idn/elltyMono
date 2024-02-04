import React from "react";
import s from "./Checkbox.module.scss";
import clsx from "clsx";

interface CheckboxProps {
  value?: boolean;
  onChange?: (value: boolean) => unknown;
  onClick?: React.MouseEventHandler<HTMLLabelElement>;
  variant?: "light" | "dark";
  className?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  value,
  onChange,
  variant = "light",
  onClick,
  className,
}) => {
  const handleChange: React.ChangeEventHandler<HTMLInputElement> = () => {
    onChange?.(!value);
  };

  return (
    <label
      className={clsx(s.root, s[variant], { [s.checked]: value }, className)}
      onClick={onClick}
    >
      <input
        type="checkbox"
        checked={value}
        onChange={handleChange}
        className={s.input}
      />
      <svg
        width="16"
        height="11"
        viewBox="0 0 16 11"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={s.mark}
      >
        <path d="M15 1L10.6 5.4L6.2 9.8L1 5" strokeLinecap="round" />
      </svg>
    </label>
  );
};
