import s from "./FolderElement.module.scss";

interface FolderElementProps {}

const FolderElement: React.FC<
  React.PropsWithChildren<FolderElementProps>
> = ({}) => {
  return <div className={s.root}>FolderElement</div>;
};

export default FolderElement;
