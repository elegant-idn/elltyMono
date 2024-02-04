import React from "react";
import s from "./ThreeDots.module.scss";
type ThreeDotsProps = {
  ref?: any;
  onClick?: any;
};

const ThreeDots = ({ ref, onClick }: ThreeDotsProps) => {
  return (
    <svg
      ref={ref}
      onClick={onClick}
      className={s.root}
      viewBox="78 53 26 7"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M84.1973 58.1605C83.6373 58.1605 83.1573 57.9705 82.7573 57.5905C82.3573 57.1905 82.1573 56.6905 82.1573 56.0905C82.1573 55.5105 82.3573 55.0305 82.7573 54.6505C83.1573 54.2505 83.6373 54.0505 84.1973 54.0505C84.7573 54.0505 85.2273 54.2405 85.6073 54.6205C85.9873 55.0005 86.1773 55.4905 86.1773 56.0905C86.1773 56.6905 85.9773 57.1905 85.5773 57.5905C85.1973 57.9705 84.7373 58.1605 84.1973 58.1605ZM90.9942 58.1605C90.4342 58.1605 89.9542 57.9705 89.5542 57.5905C89.1542 57.1905 88.9542 56.6905 88.9542 56.0905C88.9542 55.5105 89.1542 55.0305 89.5542 54.6505C89.9542 54.2505 90.4342 54.0505 90.9942 54.0505C91.5542 54.0505 92.0242 54.2405 92.4042 54.6205C92.7842 55.0005 92.9742 55.4905 92.9742 56.0905C92.9742 56.6905 92.7742 57.1905 92.3742 57.5905C91.9942 57.9705 91.5342 58.1605 90.9942 58.1605ZM97.7911 58.1605C97.2311 58.1605 96.7511 57.9705 96.3511 57.5905C95.9511 57.1905 95.7511 56.6905 95.7511 56.0905C95.7511 55.5105 95.9511 55.0305 96.3511 54.6505C96.7511 54.2505 97.2311 54.0505 97.7911 54.0505C98.3511 54.0505 98.8211 54.2405 99.2011 54.6205C99.5811 55.0005 99.7711 55.4905 99.7711 56.0905C99.7711 56.6905 99.5711 57.1905 99.1711 57.5905C98.7911 57.9705 98.3311 58.1605 97.7911 58.1605Z" />
    </svg>
  );
};

export default ThreeDots;
