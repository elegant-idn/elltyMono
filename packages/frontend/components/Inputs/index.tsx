import React from "react";
import clsx from "clsx";
import { nanoid } from "nanoid";
import s from "./Inputs.module.scss";
// import { useFormContext } from 'react-hook-form';
// import { TextField } from '@mui/material'
import { Formik, Form, useField, useFormikContext } from "formik";

interface InputProps {
  name: string;
  label: string;
  type: string;
  errors?: any;
  touched?: boolean;
  placeholder?: string;
  onChange: any;
  onBlur: any;
  value: any;
}

interface CheckboxProps {
  name?: string;
  label?: string;
  errors?: any;
  touched?: boolean;
  checked?: boolean;
  onChange?: any;
  onBlur?: any;
  value: any;
  variant: string;
}

export const InputText: React.FC<React.PropsWithChildren<InputProps>> = ({
  label,
  errors,
  touched,
  onChange,
  onBlur,
  value,
  ...props
}) => {
  // const [field, meta] = useField(props);
  return (
    <div className={clsx(s.inputGroup, touched && errors && s.error)}>
      <label>{label}</label>
      <input
        onChange={onChange}
        onBlur={onBlur}
        {...props} // type, name, placeholder
        value={value}
        autoComplete="off"
      />
      {touched && errors ? <span className={s.errorText}>{errors}</span> : null}
    </div>
  );
};

export const InputPassword: React.FC<React.PropsWithChildren<InputProps>> = ({
  label,
  errors,
  touched,
  onChange,
  onBlur,
  value,
  ...props
}) => {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <div
        className={clsx(
          s.inputGroup,
          s.password,
          touched && errors && s.error,
          !open ? s.close : s.open
        )}
      >
        <label>{label}</label>
        <div className={s.inputWrapper}>
          <input
            onChange={onChange}
            onBlur={onBlur}
            {...props} // type, name, placeholder
            type={!open ? "password" : "text"}
            value={value}
            autoComplete="off"
          />
          <div
            className={clsx(s.passwordEye, "unselectable")}
            onClick={() => {
              setOpen(!open);
            }}
          >
            <img src="/auth/eye-open.svg" />
          </div>
        </div>
        {touched && errors ? (
          <span className={s.errorText}>{errors}</span>
        ) : null}
      </div>
    </>
  );
};

export const InputCheckbox: React.FC<
  React.PropsWithChildren<CheckboxProps>
> = ({
  name,
  label,
  errors,
  touched,
  onChange,
  onBlur,
  value,
  checked,
  variant,
}) => {
  // The checkbox is used in modal window forms and mobile menu forms
  // with the same name, so their IDs need to be generated.
  // console.log(checked);

  const [id] = React.useState(nanoid(6));
  return (
    <div className={s.checkbox}>
      <input
        className={clsx(s[variant], checked && s.checked)}
        onChange={onChange}
        onBlur={onBlur}
        name={name}
        id={id}
        type="checkbox"
        // defaultChecked={checked || value ? true : false}
        value={value}
        checked={checked}
        readOnly={!onChange}
      />
      <label
        className={s[variant]}
        // 5px margin right + 20px input size to indent the text, if there is one
        style={label ? { paddingLeft: "25px" } : { paddingLeft: "20px" }}
        htmlFor={id}
      >
        {label}
      </label>
    </div>
  );
};
