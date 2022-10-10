import { forwardRef } from "react";
import { Text, TouchableOpacity, TouchableOpacityProps } from "react-native";
import clsx from "clsx";

interface Props extends TouchableOpacityProps {
  type?: "filled" | "outline";
}

const Button = forwardRef<TouchableOpacity, Props>(
  ({ className, type = "filled", children, ...props }, ref) => {
    return (
      <TouchableOpacity
        ref={ref}
        className={clsx(
          "w-full p-4 rounded-lg items-center",
          type === "outline"
            ? "bg-white border-blue-500 border-2"
            : "bg-blue-500"
        )}
        {...props}
      >
        <Text
          className={clsx(
            "font-bold text-base",
            type === "outline" ? "text-blue-500" : "text-white"
          )}
        >
          {children}
        </Text>
      </TouchableOpacity>
    );
  }
);

export default Button;
