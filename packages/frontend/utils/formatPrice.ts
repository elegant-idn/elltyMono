export const formatPrice = (
  amountInCents: number,
  currency: string,
  locale = "en-US"
) => {
  if (amountInCents === undefined || !currency) return "";

  const formatter = new Intl.NumberFormat(locale, {
    currency,
    style: "currency",
    maximumFractionDigits: currency === "RUB" ? 0 : undefined,
  });

  return formatter.format(amountInCents / 100);
};
