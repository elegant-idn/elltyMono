import s from "./Container.module.scss";

const Container: React.FC<React.PropsWithChildren<unknown>> = ({
  children,
}) => {
  return <div className={s.root}>{children}</div>;
};

export default Container;
