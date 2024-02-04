import LinearProgress from "@mui/material/LinearProgress";
import clsx from "clsx";
import React, { useEffect, useRef, useState } from "react";
import s from "./LinearDownloadProgress.module.scss";

interface LinearDownloadProgressProps {
  hasLoaded: boolean;
  progressClass?: string;
}

const EXPECTED_LOAD_TIME_MS = 3_000;
const EXPECTED_LOAD_MAX_PERCENT = 90;
const UPDATE_FREQUENCY_MS = 200;

const TOTAL_NUMBER_OF_TICKS = EXPECTED_LOAD_TIME_MS / UPDATE_FREQUENCY_MS;
const PROGRESS_PER_TICK = EXPECTED_LOAD_MAX_PERCENT / TOTAL_NUMBER_OF_TICKS;

export const LinearDownloadProgress: React.FC<LinearDownloadProgressProps> = ({
  hasLoaded,
  progressClass,
}) => {
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (hasLoaded) {
      setProgress(100);
    }
  }, [hasLoaded]);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setProgress((progress) => {
        return Math.min(
          progress + PROGRESS_PER_TICK,
          EXPECTED_LOAD_MAX_PERCENT
        );
      });
    }, UPDATE_FREQUENCY_MS);

    return () => {
      intervalRef.current && clearTimeout(intervalRef.current);
    };
  }, []);

  useEffect(() => {
    if (progress >= EXPECTED_LOAD_MAX_PERCENT && intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, [progress]);

  return (
    <LinearProgress
      variant="determinate"
      value={progress}
      className={s.progress}
      classes={{
        root: clsx(s.progress, progressClass),
        bar: s.progressBar,
      }}
    />
  );
};
