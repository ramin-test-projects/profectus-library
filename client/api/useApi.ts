import { Routes } from "@/constants/routes";
import { useAuthContext } from "@/context/auth-provider/AuthProvider";
import { useCallback, useContext, useState } from "react";

type IReturnType<S extends Function> = S extends (...args: any[]) => Promise<infer RT>
  ? RT
  : S extends (...args: any[]) => infer RT
    ? RT
    : never;

export const useApi = <Fn extends (...args: any[]) => any>(
  fn: Fn
): {
  call: (...args: Parameters<Fn>) => Promise<IReturnType<Fn> | undefined>;
  isLoading: boolean;
  isError: boolean;
  error?: string;
  result?: IReturnType<Fn>;
} => {
  const [result, setResult] = useState<IReturnType<Fn> | undefined>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const { logout } = useAuthContext();

  const call = useCallback(
    async (...args: Parameters<Fn>) => {
      setIsLoading(true);
      setIsError(false);
      setError("");

      let dt: IReturnType<Fn> | undefined = undefined;

      try {
        dt = await fn(...args);
        setResult(dt);
      } catch (e) {
        const status = (e as { status?: number } | undefined)?.status;
        const isLoginPage = window.location.pathname.toLowerCase() === Routes.login.fullPath;

        if (status === 401 && !isLoginPage) logout();

        setIsError(true);
        setError("");
        setResult(undefined);
      } finally {
        setIsLoading(false);
      }

      return dt;
    },
    [fn]
  );

  return { call, isLoading, isError, error, result };
};
