import { type TFunction } from "next-i18next";

const TIME_UNITS = [
  { value: 86400, unitKey: "day" },
  { value: 3600, unitKey: "hour" },
  { value: 60, unitKey: "minute" },
];

export const toHumanReadableTimeElapsed = (dateSince: Date, t: TFunction) => {
  const seconds = Math.floor(
    (new Date().getTime() - dateSince.getTime()) / 1000
  );
  if (seconds < 60) {
    return t("timeElapsed.justNow");
  }

  for (const { value, unitKey } of TIME_UNITS) {
    if (seconds < value) continue;
    const amount = Math.floor(seconds / value);

    return t(`timeElapsed.ago`, {
      time: t(`timeElapsed.units.${unitKey}`, { count: amount }),
    });
  }
};
