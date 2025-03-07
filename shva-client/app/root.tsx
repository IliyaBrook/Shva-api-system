// noinspection JSUnusedGlobalSymbols

import { ErrorBoundary } from "@/components/ErrorBoundary";
import { globalContext } from "@/contexts/globalContext";
import useAuthAndGetUsers from "@/hooks/useAuthAndGetUsers";
import { Layout } from "@/Layout";
import type { IUserResponse } from "@/types";
import React, { useEffect, useMemo, useState } from "react";
import { Outlet } from "react-router";
import "./index.css";
import { useLocation, useNavigate } from "react-router-dom";

export { Layout };

const App: React.FC = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [users, setUsers] = useState<IUserResponse[] | []>([]);

  useAuthAndGetUsers({
    isAuthorized,
    setIsAuthorized,
    setUsers,
  });

  useEffect(() => {
    const allowedPaths = ["/", "/register"];
    if (!isAuthorized && !allowedPaths.includes(location.pathname)) {
      navigate("/");
    } else if (isAuthorized && location.pathname === "/") {
      navigate("/users");
    }
  }, [isAuthorized, location, navigate]);

  const contextValue = useMemo(
    () => ({ isAuthorized, users, setIsAuthorized, setUsers }),
    [isAuthorized, setIsAuthorized, users, setIsAuthorized],
  );

  return (
    <globalContext.Provider value={contextValue}>
      <Outlet />
    </globalContext.Provider>
  );
};

export default App;

export { ErrorBoundary };
