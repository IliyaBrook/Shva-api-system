import type { IAuthResponse, IUserResponse, IUsersResponse } from "@/types";
import { apiUrl } from "@/utils";
import React, { useEffect, useRef } from "react";

interface UseAuthAndGetUsersProps {
  isAuthorized: boolean;
  setIsAuthorized: React.Dispatch<React.SetStateAction<boolean>>;
  setUsers: React.Dispatch<React.SetStateAction<IUserResponse[] | []>>;
}

const useAuthAndGetUsers = ({
  isAuthorized,
  setIsAuthorized,
  setUsers,
}: UseAuthAndGetUsersProps): void => {
  // To prevent an infinite loop in case the server doesn't validate a correct accessToken after a /refresh request, recursion is limited to 5 attempts.
  const checkAuthAndGetTries = useRef(0);

  useEffect(() => {
    const checkAuthAndGetData = async (): Promise<void> => {
      const token = localStorage.getItem("accessToken");
      checkAuthAndGetTries.current++;
      if (checkAuthAndGetTries.current >= 5) {
        localStorage.removeItem("accessToken");
        return;
      }
      if (token) {
        try {
          const res = await fetch(apiUrl + "/users", {
            headers: { Authorization: `Bearer ${token}` },
            credentials: "include",
          });
          if (res.ok) {
            const usersData: IUsersResponse = await res.json();
            if (Array.isArray(usersData)) {
              setUsers(usersData);
              setIsAuthorized(true);
            } else {
              setIsAuthorized(true);
            }
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
        }
      } else {
        setIsAuthorized(false);
      }
    };

    void checkAuthAndGetData();
  }, [isAuthorized]);
};

export default useAuthAndGetUsers;
