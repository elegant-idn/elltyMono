import clsx from "clsx";
import s from "./ContainerFluid.module.scss";

const ContainerFluid: React.FC<
  React.PropsWithChildren<{ className?: string }>
> = ({ children, className }) => {
  return <div className={clsx(s.root, className)}>{children}</div>;
};

export default ContainerFluid;
