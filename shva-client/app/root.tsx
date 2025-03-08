// noinspection JSUnusedGlobalSymbols

import { ErrorBoundary } from "@/components/ErrorBoundary";
import { DataProvider } from "@/components/DataProvider";
import { Layout } from "@/Layout";
import React from "react";
import { Outlet } from "react-router";
import "./index.css";
import "./tailwind.css";

export { Layout };

const App: React.FC = () => {
  return (
    <DataProvider>
      <Outlet />
    </DataProvider>
  );
};

export default App;

export { ErrorBoundary };
