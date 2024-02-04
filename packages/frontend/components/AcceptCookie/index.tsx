import React from "react";
import NextLink from "next/link";
import clsx from "clsx";
import s from "./AcceptCookie.module.scss";
import BtnPrimary from "../BtnPrimary";
import { useCookies } from "react-cookie";

interface AcceptCookieProps {
  local: any;
}

const AcceptCookie: React.FC<React.PropsWithChildren<AcceptCookieProps>> = ({
  local,
}) => {
  // the state is used, because if there is an 'acceptCookieAgreement',
  // the element appears and then disappears instantly
  const [open, setOpen] = React.useState(false);
  const [cookie, setCookie, removeCookie] = useCookies();
  // removeCookie('acceptCookieAgreement')
  const AcceptCookieLocal = local("AcceptCookie", { returnObjects: true });

  React.useEffect(() => {
    cookie.acceptCookieAgreement ? setOpen(false) : setOpen(true);
  }, []);

  return (
    <div className={clsx(s.root, open && s.open)}>
      <span>
        {AcceptCookieLocal.text}{" "}
        <NextLink href="/policy/cookie-policy">
          <a>{AcceptCookieLocal.link}</a>
        </NextLink>
        .
      </span>
      <div
        onClick={() => {
          setCookie(
            "acceptCookieAgreement",
            true,
            // 1 month
            {
              path: "/",
              expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
            }
          );
          setOpen(false);
        }}
      >
        <BtnPrimary>{AcceptCookieLocal.btn}</BtnPrimary>
      </div>
    </div>
  );
};

export default AcceptCookie;
