"use client";

import { LoginApiResponse } from "@/api/ApiBase";
import { Routes } from "@/constants/routes";
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type IAuthData = {
  auth?: LoginApiResponse;
  isAuthenticated: boolean;
  setAuthResponse: (details: LoginApiResponse) => void;
  logout: () => void;
  requestParams?: { headers: { Authorization: string } };
};

const authLocalStorageKey = "auth_details";

const getAuthDetailsFromLocalStorage = () => {
  const authDetailsFromStorage =
    typeof localStorage === "undefined"
      ? undefined
      : (JSON.parse(localStorage.getItem(authLocalStorageKey) || "{}") as LoginApiResponse);

  return !authDetailsFromStorage?.token ? undefined : authDetailsFromStorage;
};

const AuthContext = createContext<IAuthData>({
  isAuthenticated: false,
  setAuthResponse: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authResponse, setAuthResponse] = useState<LoginApiResponse | undefined>(
    getAuthDetailsFromLocalStorage
  );

  useEffect(() => {
    const isLoginPage = window.location.pathname.toLowerCase() === Routes.login.fullPath;

    if (!isLoginPage && !authResponse?.token) {
      window.location.href = Routes.login.fullPath ?? "";
    } else if (isLoginPage && !!authResponse?.token) {
      window.location.href = Routes.home.fullPath ?? "";
    }
  }, [authResponse?.token]);

  const logout = useCallback(() => {
    localStorage.removeItem(authLocalStorageKey);
    setAuthResponse(undefined);
  }, []);

  const handleSetAuthResponse = useCallback((value: LoginApiResponse) => {
    localStorage.setItem(authLocalStorageKey, JSON.stringify(value));
    setAuthResponse(value);
    window.location.href = Routes.home.fullPath ?? "";
  }, []);

  const requestParams = useMemo(() => {
    return !authResponse?.token
      ? undefined
      : { headers: { Authorization: `Bearer ${authResponse.token}` } };
  }, [authResponse?.token]);

  return (
    <AuthContext.Provider
      value={{
        auth: authResponse,
        isAuthenticated: !!authResponse?.token,
        setAuthResponse: handleSetAuthResponse,
        logout,
        requestParams,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
