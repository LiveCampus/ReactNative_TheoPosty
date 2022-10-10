import clsx from "clsx";
import { View } from "react-native";

interface Props {
  numberOfTables: number;
  activeTable: number;
}

const Dots = ({ numberOfTables, activeTable }: Props) => {
  return (
    <View className="absolute z-50 h-screen w-screen" pointerEvents="none">
      <View className="bottom-5 absolute left-0 right-0 justify-center flex flex-row space-x-1">
        {[...Array(numberOfTables)].map((_, tableI) => (
          <View
            key={tableI}
            className={clsx(
              "w-2 h-2 bg-blue-500 rounded-full",
              tableI === activeTable && "bg-blue-400"
            )}
          />
        ))}
      </View>
    </View>
  );
};

export default Dots;
