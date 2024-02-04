import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";

export const useClientSideCookie = () => {
  const [useCookiesCookie, ...useCookiesRest] = useCookies();
  const [cookie, setCookie] = useState<Record<string, any>>({});

  useEffect(() => {
    setCookie(useCookiesCookie);
  }, [useCookiesCookie]);

  return [cookie, ...useCookiesRest];
};
