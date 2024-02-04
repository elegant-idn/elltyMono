import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { isServer } from "./utils/isServer";

const getBaseUrl = () => {
  const isProd = process.env.NODE_ENV === "production";

  if (!isProd || isServer()) return "http://localhost:3000/api";

  return "/api";
};

export const BASE_URL = getBaseUrl();

const getCookie = (name: string) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts) {
    return decodeURI(parts.pop()?.split(";").shift() || "");
  }
  return "";
};

export const Api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "*/*",
  },
});

export function request<T = any, R = AxiosResponse<T>, D = any>(
  requestParams: AxiosRequestConfig<D>
): Promise<R> {
  return Api.request<T, R, D>({
    ...requestParams,
    headers: {
      ...requestParams.headers,
      Authorization: getCookie("Authorization"),
    },
  });
}
