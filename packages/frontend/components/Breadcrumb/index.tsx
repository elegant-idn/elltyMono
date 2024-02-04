import NextLink from "next/link";
import s from "./Breadcrumb.module.scss";
import clsx from "clsx";
import Link from "../Link";

interface BreadcrumbProps {
  href: string;
  active?: boolean;
}

const Breadcrumb: React.FC<React.PropsWithChildren<BreadcrumbProps>> = ({
  href,
  active,
  children,
}) => {
  return (
    <div className={clsx(s.root, active && s.active)}>
      <NextLink href={href} passHref>
        <Link href="#" chevron>
          {children}
        </Link>
      </NextLink>
    </div>
  );
};

export default Breadcrumb;
