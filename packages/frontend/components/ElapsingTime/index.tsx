import { useTranslation } from "next-i18next";
import React, { useEffect, useState } from "react";
import { toHumanReadableTimeElapsed } from "../../utils/toHumanReadableTimeElapsed";

interface ElapsingTimeProps {
  date: Date;
}

const UPDATE_FREQUENCY = 1_000;

export const useElapsingTime = (date: Date) => {
  const { t } = useTranslation("common");
  const [displayText, setDisplayText] = useState(
    toHumanReadableTimeElapsed(date, t)
  );

  useEffect(() => {
    const intervalId = setInterval(() => {
      setDisplayText(toHumanReadableTimeElapsed(date, t));
    }, UPDATE_FREQUENCY);

    return () => {
      clearInterval(intervalId);
    };
  }, [date, t]);

  return displayText;
};

export const ElapsingTime: React.FC<ElapsingTimeProps> = ({ date }) => {
  const displayText = useElapsingTime(date);

  return <>{displayText}</>;
};
