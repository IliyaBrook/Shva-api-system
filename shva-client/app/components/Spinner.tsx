import { cn } from "@/utils/cn";
import React from "react";

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  wrapperStyles?: React.HTMLAttributes<HTMLDivElement>;
}
export const Spinner: React.FC<SpinnerProps> = ({
  wrapperStyles,
  ...spinnerStyles
}) => {
  const { className, ...restSpinnerStyles } = spinnerStyles;
  return (
    <div {...wrapperStyles}>
      <div
        className={cn(
          "w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin",
          className,
        )}
        {...restSpinnerStyles}
      />
    </div>
  );
};

export default Spinner;
