import { CSSProperties } from "react";
import { Icon } from "../../utils/utility";
import styles from "./styles.module.css";

const PageLoader = ({
  text,
  style,
  className,
}: {
  text?: string;
  style?: CSSProperties | undefined;
  className?: string;
}) => {
  return (
    <div style={style} className={`full-width ${styles.main} ${className}`}>
      <Icon name="spinner" width="w-6" height="h-6" />
      {text}
    </div>
  );
};

export default PageLoader;
