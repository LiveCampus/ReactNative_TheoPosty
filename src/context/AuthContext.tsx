import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../api/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  User,
} from "firebase/auth";
import { errorMessage, handlePromise } from "../utils";

export interface IAuthContext {
  isAuthenticated: boolean;
  user: any;
  loginWithCredentials: (email: string, password: string) => Promise<void>;
  registerWithCredentials: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<null | IAuthContext>(null);

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      }
    });

    return unsubscribe;
  }, []);

  const registerWithCredentials = async (email: string, password: string) => {
    const [response, error] = await handlePromise(
      createUserWithEmailAndPassword(auth, email, password)
    );

    if (error) {
      throw new Error(errorMessage[error.code]);
    }

    setUser(response.user);
    console.log("Registered:", response.user.email);
  };

  const loginWithCredentials = async (email: string, password: string) => {
    const [response, error] = await handlePromise(
      signInWithEmailAndPassword(auth, email, password)
    );

    if (error) {
      throw new Error(errorMessage[error.code]);
    }

    setUser(response.user);
    console.log("Logged in:", response.user.email);
  };

  const logout = async () => {
    auth.signOut();
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        user,
        loginWithCredentials,
        registerWithCredentials,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const value = useContext(AuthContext);
  if (value === null) {
    throw new Error("you must surround this component with a <AuthProvider>");
  }
  return value;
};
