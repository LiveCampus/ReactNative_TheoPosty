import { useEffect, useRef, useState } from "react";
import { Dimensions, ScrollView, Text, View } from "react-native";
import { getTables } from "../api/table";
import Dots from "../components/Dots";
import Header from "../components/Header";
import Table from "../components/Table/Table";
import TableLoading from "../components/Table/TableLoading";
import { useAuth } from "../context/AuthContext";

const DashboardScreen = () => {
  const { user } = useAuth();
  const ref = useRef<ScrollView>(null);

  const [loading, setLoading] = useState(true);
  const [tables, setTables] = useState<any[]>([]);
  const [refreshValue, setRefreshValue] = useState(0);
  const [activeTable, setActiveTable] = useState(0);

  useEffect(() => {
    if (!user) return;

    (async () => {
      const tables = await getTables(user.uid);

      setTables(tables);
      setLoading(false);
    })();
  }, [user, refreshValue]);

  const refreshTables = () => {
    setRefreshValue(Math.random);
  };

  const handleScroll = () => {
    ref.current?.scrollTo({
      x: 0,
      y: 0,
      animated: false,
    });
  };

  return (
    <View className="py-10">
      <Header />
      <ScrollView
        ref={ref}
        horizontal
        pagingEnabled
        className="min-h-screen z-10"
        onMomentumScrollEnd={(e) => {
          setActiveTable(
            Math.round(
              parseFloat(
                `${
                  e.nativeEvent.contentOffset.x / Dimensions.get("window").width
                }`
              )
            )
          );
        }}
      >
        {loading ? (
          <TableLoading />
        ) : tables.length === 0 ? (
          <Text className="text-gray-400 font-bold m-4">
            There is no table here ¯\_(ツ)_/¯
          </Text>
        ) : (
          tables.map((table) => (
            <Table
              key={table.id}
              id={table.id}
              title={table.name}
              refresh={refreshTables}
              handleScroll={handleScroll}
            />
          ))
        )}
      </ScrollView>
      {!loading && tables.length > 0 && (
        <Dots activeTable={activeTable} numberOfTables={tables.length} />
      )}
    </View>
  );
};

export default DashboardScreen;
