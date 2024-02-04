import React from "react";
import s from "./UnderMaintenancePage.module.scss";

const UnderMaintenancePage = () => {
  // document.body.style.height = "100vh"

  return (
    <div className={s.root}>
      <img src="/logo.svg" alt="logo" />
      <div className={s.title}>We are preparing something new.</div>
    </div>
  );
};

export default UnderMaintenancePage;
