import type { Route } from "@/types/Router";
import React from "react";
import { isRouteErrorResponse } from "react-router";
import { useNavigate } from "react-router-dom";

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  const navigate = useNavigate();
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 w-full">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-red-600 mb-4">{message}</h1>
        <p className="text-gray-700 mb-6">{details}</p>
        {stack && (
          <pre className="bg-gray-200 rounded-md p-4 overflow-x-auto mb-6">
            <code className="text-sm text-gray-800">{stack}</code>
          </pre>
        )}
        <button
          onClick={() => navigate("/")}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Go to Home Page
        </button>
      </div>
    </main>
  );
}
