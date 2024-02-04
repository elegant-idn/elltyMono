import s from "./Alert.module.scss";

interface AlertProps {
  variant: string; // error, warning, info, success
}

const Alert: React.FC<React.PropsWithChildren<AlertProps>> = ({
  children,
  variant,
}) => {
  return (
    <div className={s.root}>
      <svg
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="5.96907"
          cy="6.36946"
          r="4.94759"
          fill="#6BB143"
          stroke="#6BB143"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M5.53153 8.83984L9.11757 5.10439C9.39035 4.82024 9.38114 4.36875 9.09699 4.09597C8.81284 3.82319 8.36136 3.8324 8.08857 4.11655L5.3545 6.96454L3.74929 5.82448C3.42815 5.5964 2.98292 5.67184 2.75484 5.99298C2.52675 6.31412 2.60219 6.75935 2.92333 6.98743L5.53153 8.83984Z"
          fill="white"
        />
      </svg>
      {children}
    </div>
  );
};

export default Alert;
