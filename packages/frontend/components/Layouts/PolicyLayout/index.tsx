import { nanoid } from "nanoid";
import Head from "next/head";
import React from "react";
import s from "./PolicyLayout.module.scss";

import Breadcrumb from "../../Breadcrumb";
import ContainerFluid from "../../ContainerFluid";
import MainLayout from "../MainLayout";

interface PolicyLayoutProps {
  userToken: string;
  cookieUser: any;
  authorized: boolean;
  title: string;
  routes: any;
}

const PolicyLayout: React.FC<React.PropsWithChildren<PolicyLayoutProps>> = ({
  userToken,
  cookieUser,
  authorized,
  children,
  title,
  routes,
}) => {
  // @ts-ignore
  const breadcrumbs = routes.map((item, index) => {
    const active = !(routes.length - 1 == index);
    return (
      <Breadcrumb key={nanoid(5)} href={item.path} active={active}>
        {item.title}
      </Breadcrumb>
    );
  });

  return (
    <>
      <Head>
        {/* meta tags... */}
        {/* <meta name="robots" content="noindex, nofollow" /> */}
      </Head>
      <MainLayout
        userToken={userToken}
        cookieUser={cookieUser}
        authorized={authorized}
      >
        <ContainerFluid>
          <div className={s.breadcrumbs}>{breadcrumbs}</div>

          <div className={s.title}>
            <h1>{title}</h1>
          </div>
        </ContainerFluid>
        <div className={s.containerContent}>{children}</div>
      </MainLayout>
    </>
  );
};

export default PolicyLayout;
