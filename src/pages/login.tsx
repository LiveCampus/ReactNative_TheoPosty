import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Keyboard, Text, TextInput, View } from "react-native";
import { auth } from "../api/firebase";
import Button from "../components/Button";
import { useAuth } from "../context/AuthContext";
import { handlePromise } from "../utils";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { loginWithCredentials } = useAuth();
  const navigation = useNavigation<any>();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        navigation.replace("Home");
      }
    });

    return unsubscribe;
  }, []);

  const handleLogin = async () => {
    Keyboard.dismiss();
    setError("");

    const [_, error] = await handlePromise(
      loginWithCredentials(email, password)
    );

    if (error) setError(error.message);
  };

  return (
    <View className="justify-center items-center flex-1">
      <View className="w-4/5">
        {error.length > 0 && <Text className="text-red-500">{error}</Text>}
        <TextInput
          placeholder="Email"
          className="bg-white px-4 py-3 rounded-lg mt-2"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <TextInput
          placeholder="Password"
          className="bg-white px-4 py-3 rounded-lg mt-2"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>
      <View className="w-3/5 justify-center items-center mt-10">
        <Button onPress={handleLogin}>Login</Button>
        <Button
          onPress={() => navigation.replace("Register")}
          type="outline"
          className="mt-1"
        >
          Register
        </Button>
      </View>
    </View>
  );
};

export default LoginScreen;
