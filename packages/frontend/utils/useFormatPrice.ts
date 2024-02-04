import { useCookies } from "react-cookie";
import { formatPrice } from "./formatPrice";

export const useFormatPrice = () => {
  const [cookie] = useCookies();
  return (amountInCents: number, currency: string) => {
    const locale = cookie?.locale?.replace("_", "-");

    return formatPrice(amountInCents, currency, locale);
  };
};
