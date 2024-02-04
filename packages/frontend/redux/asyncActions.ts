import { Dispatch } from "redux";
import { Api } from "../api";
import { FailedFetchUserAction, FetchUserAction } from "./actions";

export const fetchUser = (userToken: string) => {
  const axiosHeaders = {
    headers: {
      Authorization: userToken,
    },
  };

  // console.log(axiosHeaders);

  if (!userToken) return;

  return (dispatch: Dispatch) => {
    Api.get("auth/me", axiosHeaders)
      .then((result) => {
        dispatch(FetchUserAction(result.data));
      })
      .catch((err) => {
        if (err?.response?.status === 401) {
          dispatch(FailedFetchUserAction({ status: err.response.status }));
        }
      });
  };
};
