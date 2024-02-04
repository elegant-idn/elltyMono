import clsx from "clsx";
import React, { useState } from "react";
import s from "./NumberInput.module.scss";

interface NumberInput {
  onChange?: (value: string | number) => void;
  value: string | number;
  label?: string;
}

const NumberArrowIcon: React.FC = () => {
  return (
    <svg
      width="10"
      height="7"
      viewBox="0 0 10 7"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1.37449 5.40202L5.25977 0.98584L9.20169 5.46642"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const NumberInput: React.FC<
  NumberInput &
    Omit<
      React.DetailedHTMLProps<
        React.InputHTMLAttributes<HTMLInputElement>,
        HTMLInputElement
      >,
      "type" | "onChange" | "value"
    >
> = ({ onChange, value, label, className, ...inputProps }) => {
  const [focus, setFocus] = useState(false);
  const applySizeMaxMin = (size: number | string) => {
    const parsedSize = typeof size === "string" ? parseInt(size) : size;

    if (isNaN(parsedSize) && inputProps.min) return inputProps.min;

    if (inputProps.min && size < inputProps.min) return inputProps.min;
    if (inputProps.max && size > inputProps.max) return inputProps.max;

    return parsedSize;
  };

  const handleInputBlur = () => {
    onChange?.(String(applySizeMaxMin(value)));
    setFocus(false);
  };

  const withFocus =
    (callback?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void) =>
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      setFocus(true);
      callback?.(e);
    };

  const withBlur =
    (callback?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void) =>
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      setFocus(false);
      callback?.(e);
    };

  const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    onChange?.(e.target.value);
  };

  const increment = () => {
    onChange?.(String(applySizeMaxMin(Number(value) + 1)));
  };

  const decrement = () => {
    onChange?.(String(applySizeMaxMin(Number(value) - 1)));
  };

  return (
    <div className={clsx(s.resizeItem, className)}>
      <span className={s.resizeLabel}>{label}</span>
      <div
        className={clsx(s.inputNumber, focus && s.focus)}
        onBlur={handleInputBlur}
      >
        <input
          type="number"
          onChange={handleInputChange}
          value={value}
          {...inputProps}
        />
        <button
          className={clsx(s.spinButtonPlus)}
          onClick={withFocus(increment)}
        >
          <NumberArrowIcon />
        </button>
        <button
          className={clsx(s.spinButtonMinus)}
          onClick={withFocus(decrement)}
        >
          <NumberArrowIcon />
        </button>
      </div>
    </div>
  );
};
