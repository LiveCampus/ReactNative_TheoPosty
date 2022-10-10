import { forwardRef } from "react";
import { Text, TouchableOpacity, TouchableOpacityProps } from "react-native";
import clsx from "clsx";
import { Ionicons } from "@expo/vector-icons";
import { ICONS } from "../utils/constants";

interface Props extends TouchableOpacityProps {
  name: typeof ICONS[number];
  size?: number;
  iconColor?: string;
}

const IconButton = forwardRef<TouchableOpacity, Props>(
  (
    { name, size = 20, iconColor = "#000", activeOpacity = 0.5, ...props },
    ref
  ) => {
    return (
      <TouchableOpacity
        ref={ref}
        activeOpacity={activeOpacity}
        className="rounded-md flex justify-center items-center p-1 basis-auto"
        {...props}
      >
        <Ionicons name={name} style={{ color: iconColor }} size={size} />
      </TouchableOpacity>
    );
  }
);

export default IconButton;
