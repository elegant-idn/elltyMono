import React from "react";
import s from "./YookassaForm.module.scss";
import clsx from "clsx";
import { Formik } from "formik";
import * as Yup from "yup";
import { useTranslation } from "next-i18next";

const YookassaForm = React.forwardRef<any>((props, ref) => {
  const { t }: any = useTranslation("Checkout");
  const i18n = t("form", { returnObjects: true });
  return (
    <div className={s.root}>
      <Formik
        initialValues={{
          number: "",
          month: "",
          year: "",
          cvc: "",
        }}
        validationSchema={Yup.object({
          number: Yup.string().min(16).max(16).required(),
          month: Yup.string().min(2).max(2).required(),
          year: Yup.string().min(2).max(2).required(),
          cvc: Yup.string().min(3).max(4).required(),
        })}
        onSubmit={(values, actions) => {}}
        innerRef={ref}
      >
        {(props) => (
          <form onSubmit={props.handleSubmit} className={s.form}>
            <div className={s.inputGroup}>
              <label>{i18n.step2.cardNumber}</label>
              <input
                name="number"
                type="text"
                placeholder="1234123412341234"
                value={props.values.number}
                onChange={props.handleChange}
                onBlur={props.handleBlur}
                className={clsx(
                  props.touched.number && props.errors.number && s.error
                )}
              />
              {/* {props.touched.number && props.errors.number ? <div>{props.errors.number}</div> : null} */}
            </div>

            <div className={s.row}>
              <div className={s.inputGroup}>
                <label>{i18n.step2.month}</label>
                <input
                  name="month"
                  type="text"
                  placeholder={i18n.step2.abbrMonth}
                  value={props.values.month}
                  onChange={props.handleChange}
                  onBlur={props.handleBlur}
                  className={clsx(
                    props.touched.month && props.errors.month && s.error
                  )}
                />
              </div>

              <div className={s.inputGroup}>
                <label>{i18n.step2.year}</label>
                <input
                  name="year"
                  type="text"
                  placeholder={i18n.step2.abbrYear}
                  value={props.values.year}
                  onChange={props.handleChange}
                  onBlur={props.handleBlur}
                  className={clsx(
                    props.touched.year && props.errors.year && s.error
                  )}
                />
              </div>

              <div className={s.inputGroup}>
                <label>{i18n.step2.CardCVC}</label>
                <input
                  name="cvc"
                  type="text"
                  placeholder="CVC"
                  value={props.values.cvc}
                  onChange={props.handleChange}
                  onBlur={props.handleBlur}
                  className={clsx(
                    props.touched.cvc && props.errors.cvc && s.error
                  )}
                />
              </div>
            </div>
          </form>
        )}
      </Formik>
    </div>
  );
});
YookassaForm.displayName = "YookassaForm";

export default YookassaForm;
