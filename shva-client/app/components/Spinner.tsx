import { cn } from "@/utils/cn";
import React from "react";

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  wrapperProps?: React.HTMLAttributes<HTMLDivElement>;
}
export const Spinner: React.FC<SpinnerProps> = ({
  wrapperProps,
  ...spinnerProps
}) => {
  const { className, ...restSpinnerProps } = spinnerProps;
  return (
    <div {...wrapperProps}>
      <div
        className={cn(
          "w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin",
          className,
        )}
        {...restSpinnerProps}
      />
    </div>
  );
};

export default Spinner;
