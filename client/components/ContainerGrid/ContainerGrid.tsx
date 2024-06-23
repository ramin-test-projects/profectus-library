import styles from "./ContainerGrid.module.scss";
import classNames from "classnames";
import { Responsive, getResponsiveValues } from "@/util/responsive";

type Cols = 1 | 2 | 3 | 4 | 5 | 6;

export const ContainerGrid = ({
  cols,
  className,
  children,
}: React.PropsWithChildren<{
  cols: Responsive<Cols>;
  className?: string;
}>) => {
  const sizes = getResponsiveValues<Cols>(cols);

  const sizeClasses = Object.entries(sizes)
    .filter(([, value]) => !!value)
    .map(([size, value]) => styles[`${size}_${value}`]);

  return (
    <div className={styles.outerContainer}>
      <div
        className={`${styles.innerContainer} hidden ${classNames(
          ...sizeClasses,
          className
        )}`}
      >
        {children}
      </div>
    </div>
  );
};
