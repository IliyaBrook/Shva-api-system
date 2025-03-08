import type { IAuthResponse, IUserResponse, IUsersResponse } from "@/types";
import { apiUrl } from "@/utils";
import React, { useEffect, useRef } from "react";

interface UseAuthAndGetUsersProps {
  isAuthorized: boolean;
  setIsAuthorized: React.Dispatch<React.SetStateAction<boolean>>;
  setUsers: React.Dispatch<React.SetStateAction<IUserResponse[] | []>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const useAuthAndGetUsers = ({
  isAuthorized,
  setIsAuthorized,
  setUsers,
  setIsLoading,
}: UseAuthAndGetUsersProps): void => {
  const checkAuthAndGetTries = useRef(0);

  useEffect(() => {
    const checkAuthAndGetData = async (): Promise<void> => {
      const token = localStorage.getItem("accessToken");
      setIsLoading(true);
      checkAuthAndGetTries.current++;
      if (checkAuthAndGetTries.current >= 5) {
        localStorage.removeItem("accessToken");
        return;
      }
      try {
        const res = await fetch(apiUrl + "/users", {
          headers: { Authorization: `Bearer ${token}` },
          credentials: "include",
        });
        if (res.ok) {
          const usersData: IUsersResponse = await res.json();
          if (Array.isArray(usersData)) {
            setUsers(usersData);
          }
          setIsAuthorized(true);
          checkAuthAndGetTries.current = 0;
          return;
        } else if (res.status === 401) {
          try {
            const refreshRes = await fetch(apiUrl + "/refresh", {
              credentials: "include",
            });
            if (refreshRes.ok) {
              const refreshData: IAuthResponse = await refreshRes.json();
              if ("accessToken" in refreshData) {
                localStorage.setItem("accessToken", refreshData.accessToken);
                await checkAuthAndGetData();
                setIsAuthorized(true);
                return;
              } else {
                setIsAuthorized(false);
              }
            } else {
              setIsAuthorized(false);
            }
          } catch {
            setIsAuthorized(false);
          }
        } else {
          setIsAuthorized(false);
        }
      } catch (error) {
        console.error("Error during authentication check:", error);
        setIsAuthorized(false);
      } finally {
        setIsLoading(false);
      }
    };

    void checkAuthAndGetData();
  }, [isAuthorized, setIsAuthorized, setUsers, setIsLoading]);
};

export default useAuthAndGetUsers;
