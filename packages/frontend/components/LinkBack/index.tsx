import NextLink from "next/link";
import s from "./LinkBack.module.scss";

interface LinkBackProps {
  href: string;
}

const LinkBack: React.FC<React.PropsWithChildren<LinkBackProps>> = ({
  children,
  href,
}) => {
  return (
    <NextLink href={href} passHref>
      <div className={s.root}>
        <svg
          width="9"
          height="16"
          viewBox="0 0 9 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7.64724 15.4265L0.576172 8.35547L7.64724 1.2844"
            stroke="#1F2128"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        {children}
      </div>
    </NextLink>
  );
};

export default LinkBack;
