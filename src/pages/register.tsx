import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Keyboard, Text, TextInput, View } from "react-native";
import { auth } from "../api/firebase";
import Button from "../components/Button";
import { useAuth } from "../context/AuthContext";
import { handlePromise } from "../utils";
// import * as WebBrowser from "expo-web-browser";
// import * as Google from "expo-auth-session/providers/google";
// import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";

// WebBrowser.maybeCompleteAuthSession();

const RegisterScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  // const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
  //   clientId:
  //     "589599598345-hg9p6n1ri1b0i30lt8p0r1qkapnkutm7.apps.googleusercontent.com",
  // });

  const { registerWithCredentials } = useAuth();
  const navigation = useNavigation<any>();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        navigation.replace("Home");
      }
    });

    return unsubscribe;
  }, []);

  // useEffect(() => {
  //   if (response?.type === "success") {
  //     const { id_token } = response.params;
  //     const credential = GoogleAuthProvider.credential(id_token);
  //     signInWithCredential(auth, credential);
  //   }
  // }, [request]);

  const handleRegister = async () => {
    Keyboard.dismiss();
    setError("");

    if (password !== confirmPassword) return setError("Passwords must match");
    const [_, error] = await handlePromise(
      registerWithCredentials(email, password)
    );

    if (error) setError(error.message);
  };

  // const handleRegisterWithGoogle = async () => {
  //   promptAsync();
  // };

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
        <TextInput
          placeholder="Confirm password"
          className="bg-white px-4 py-3 rounded-lg mt-2"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />
      </View>
      <View className="w-3/5 justify-center items-center mt-10">
        <Button onPress={handleRegister}>Register</Button>
        {/* <Button disabled={!request} onPress={handleRegisterWithGoogle}>
          Login with Google
        </Button> */}
        <Button
          onPress={() => navigation.replace("Login")}
          type="outline"
          className="mt-1"
        >
          Login
        </Button>
      </View>
    </View>
  );
};

export default RegisterScreen;
