import { globalContext } from "@/contexts/globalContext";
import useAuthAndGetUsers from "@/hooks/useAuthAndGetUsers";
import type { IUserResponse } from "@/types";
import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [users, setUsers] = useState<IUserResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useAuthAndGetUsers({
    isAuthorized,
    setIsAuthorized,
    setUsers,
    setIsLoading,
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
    () => ({
      isAuthorized,
      users,
      setIsAuthorized,
      setUsers,
      isLoading,
      setIsLoading,
    }),
    [isAuthorized, users, isLoading],
  );

  return (
    <globalContext.Provider value={contextValue}>
      {children}
    </globalContext.Provider>
  );
};
