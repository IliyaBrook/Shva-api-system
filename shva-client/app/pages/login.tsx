import Spinner from "@/components/Spinner";
import type { IAuthResponse } from "@/types";
import { apiUrl } from "@/utils";
import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { globalContext } from "@/contexts/globalContext";

const Login = (): React.JSX.Element => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setIsAuthorized, setIsLoading, isLoading } =
    useContext(globalContext);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const response = await fetch(apiUrl + "/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data: IAuthResponse = await response.json();

      if ("accessToken" in data) {
        localStorage.setItem("accessToken", data.accessToken);
        setIsAuthorized(true);
        navigate("/users");
      } else {
        setError((data as { message?: string }).message || "Login failed");
      }
    } catch {
      setError("An error occurred during login.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading)
    return (
      <Spinner
        wrapperProps={{
          className:
            "absolute flex flex-1 justify-center items-center h-full w-full",
        }}
      />
    );

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 w-full">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-sm"
      >
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="email"
          >
            Email
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            id="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="text-red-500 text-xs italic">{error}</p>}
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Sign In
          </button>
          <Link
            to={{ pathname: "/register" }}
            className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
          >
            Need an account?
          </Link>
        </div>
      </form>
    </div>
  );
};

// noinspection JSUnusedGlobalSymbols
export default Login;
