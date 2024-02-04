import { nanoid } from "nanoid";
import { useMemo } from "react";

const TEMPORARY_USER_TOKEN_KEY = "temporary_user_token";

export const useTemporaryUserToken = (userToken: string | undefined) => {
  const temporaryUserToken = useMemo(() => {
    if (userToken) {
      localStorage.removeItem(TEMPORARY_USER_TOKEN_KEY);
      return null;
    }

    let token = localStorage.getItem(TEMPORARY_USER_TOKEN_KEY);

    if (!token) {
      token = nanoid();
      localStorage.setItem(TEMPORARY_USER_TOKEN_KEY, token);
    }

    return token;
  }, [userToken]);

  return temporaryUserToken;
};
