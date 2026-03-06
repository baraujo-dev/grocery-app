import { useState } from "react";
import { authApi } from "../api/authApi";
import { useAuth } from "../auth/useAuth";

import { Input } from "../components/Input";
import { Button } from "../components/Button";

export const LoginPage = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    try {
      const { token } = await authApi.login({ username, password });
      login(token);
    } catch {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <form
        className="bg-white p-6 rounded-xl w-80 shadow"
        onSubmit={(event) => {
          event.preventDefault();
          handleSubmit();
        }}
      >
        <h2 className="text-lg font-semibold mb-4">Login</h2>

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <Input
          className="w-full border p-2 mb-2 rounded"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <Input
          type="password"
          className="w-full border p-2 mb-4 rounded"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button
          type="submit"
          className="w-full py-2 rounded"
        >
          Login
        </Button>
      </form>
    </div>
  );
};
