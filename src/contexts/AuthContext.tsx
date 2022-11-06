import React, { createContext, ReactNode, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios, { AxiosInstance } from "axios";

import authHeader from "../services/AuthHeaders";
import AuthService from "../services/AuthService";
import { UserModel } from "../models/User";

const DefaultProps = {
  login: () => null,
  register: () => null,
  logout: () => null,
  authAxios: axios,
  user: null,
};

export interface AuthProps {
  login: (username: string, password: string) => any;
  register: (
    firstName: string,
    lastName: string,
    username: string,
    password: string
  ) => any;
  logout: () => void;
  authAxios: AxiosInstance;
  user: UserModel | null;
}

export const AuthContext = createContext<AuthProps>(DefaultProps);

export const AuthContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => AuthService.getCurrentUser());

  async function login(username: string, password: string) {
    console.log("in login");
    const data = await AuthService.login(username, password);
    setUser(data);
    return data;
  }

  async function register(
    firstName: string,
    lastName: string,
    username: string,
    password: string
  ) {
    const data = await AuthService.register(
      firstName,
      lastName,
      username,
      password
    );
    setUser(data);
    return data;
  }

  function logout() {
    AuthService.logout();
    setUser(null);
    navigate("/login");
  }

  // axios instance for making requests
  const authAxios = axios.create();

  // request interceptor for adding token
  authAxios.interceptors.request.use((config) => {
    // add token to request headers
    config.headers = authHeader();
    return config;
  });

  authAxios.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response.status === 401) {
        logout();
      }
      return Promise.reject(error);
    }
  );

  return (
    <AuthContext.Provider value={{ user, login, register, logout, authAxios }}>
      {children}
    </AuthContext.Provider>
  );
};
