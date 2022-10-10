import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  BackHandler,
  Dimensions,
  FlatList,
  Image,
  Modal,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";

interface Props {
  data: string[];
  handleDelete: (uri: string) => void;
}

const GridImage = ({ data, handleDelete }: Props) => {
  const [modal, setModal] = useState({ visible: false, data: 0 });
  const ref = useRef<ScrollView>(null);
  let key = 0;

  const handleCloseModal = () => {
    setModal({ visible: false, data: 0 });
    return true;
  };

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", handleCloseModal);
    return () => {
      BackHandler.addEventListener("hardwareBackPress", handleCloseModal);
    };
  }, []);

  return (
    <View className="flex-1">
      <Modal
        animationType="slide"
        transparent={true}
        visible={modal.visible}
        onRequestClose={handleCloseModal}
      >
        <ScrollView
          showsHorizontalScrollIndicator={false}
          ref={ref}
          className="flex-1"
          onMomentumScrollEnd={(e) => {
            setModal({
              ...modal,
              data: Math.round(
                parseFloat(
                  `${
                    e.nativeEvent.contentOffset.x /
                    Dimensions.get("window").width
                  }`
                )
              ),
            });
          }}
          snapToInterval={Dimensions.get("window").width}
          decelerationRate="fast"
          pagingEnabled
          horizontal
        >
          {data.map((uri, i) => (
            <View key={i}>
              <Image
                source={{ uri }}
                className="bg-black bg-opacity-80"
                style={{
                  height: Dimensions.get("window").height,
                  width: Dimensions.get("window").width,
                  resizeMode: "contain",
                }}
              />
            </View>
          ))}
        </ScrollView>

        <View className="absolute self-center items-center justify-center left-2 top-2">
          <TouchableOpacity
            onPress={() => {
              setModal({ visible: false, data: 0 });
            }}
          >
            <Ionicons name="close-sharp" color={"white"} size={40} />
          </TouchableOpacity>
        </View>

        <View className="absolute self-center items-center justify-center right-2 top-2">
          <TouchableOpacity
            onPress={() => {
              Alert.alert(
                "Warning",
                "Do you really want to delete this image ?",
                [
                  { text: "Cancel", style: "cancel" },
                  {
                    text: "Confirm",
                    onPress: async () => {
                      await handleDelete(data[modal.data]);
                    },
                  },
                ]
              );
              setModal({ ...modal, visible: false });
            }}
          >
            <Ionicons name="ios-trash" color={"white"} size={40} />
          </TouchableOpacity>
        </View>
      </Modal>

      <FlatList
        contentContainerStyle={{ paddingBottom: 40 }}
        data={data}
        renderItem={({ index }) => {
          if (data.length <= index * 3) {
            return null;
          }
          return (
            <View className="flex-row">
              {[...Array(3)].map((_, i) => {
                return (
                  <View
                    className="m-1 flex-1"
                    style={{ height: Dimensions.get("window").height / 5.5 }}
                    key={i}
                  >
                    {data.length > index * 3 + i ? (
                      <TouchableOpacity
                        onPress={() => {
                          setModal({ visible: true, data: index * 3 + i });
                          setTimeout(() => {
                            ref.current?.scrollTo({
                              x:
                                Dimensions.get("window").width *
                                (index * 3 + i),
                              y: 0,
                              animated: false,
                            });
                          }, 1);
                        }}
                        className="m-1 flex-1"
                        style={{
                          height: Dimensions.get("window").height / 5.5,
                        }}
                      >
                        <Image
                          source={{ uri: data[index * 3 + i] }}
                          className="flex-1"
                        />
                      </TouchableOpacity>
                    ) : null}
                  </View>
                );
              })}
            </View>
          );
        }}
        keyExtractor={() => {
          key++;
          return key.toString();
        }}
        className="flex-1"
      />
    </View>
  );
};

export default GridImage;
