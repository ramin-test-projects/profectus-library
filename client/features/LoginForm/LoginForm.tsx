"use client";

import { Button, TextField } from "@mui/material";
import { useState } from "react";
import { useApi } from "@/api/useApi";
import { API } from "@/api/Api";
import { useAuthContext } from "@/context/auth-provider/AuthProvider";
import { LoadingButtonLabel } from "@/components/loading/LoadingButtonLabel";

export const LoginForm = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const { setAuthResponse } = useAuthContext();

  const { call, isLoading } = useApi(API.login);

  const handleLogin = () => {
    if (isLoading) return;

    (async () => {
      const res = await call({ username, password });
      !!res?.token && setAuthResponse(res);
    })();
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="text-center font-medium text-xl mb-4" style={{ color: "rgb(100, 100, 100)" }}>
        Login
      </div>
      <div>
        <TextField
          className="w-full"
          variant="outlined"
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <TextField
          className="w-full"
          variant="outlined"
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div style={{ marginTop: "1rem" }}>
        <Button
          className="w-32 py-2 px-4 h-10"
          disabled={!username || !password}
          onClick={handleLogin}
          variant="contained"
        >
          {isLoading ? <LoadingButtonLabel /> : "Sign In"}
        </Button>
      </div>
      <div className="text-gray-600 text-left mt-2">
        Username: "admin" or "user"; Password: "123"
      </div>
    </div>
  );
};
