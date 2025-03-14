import Spinner from "@/components/Spinner";
import { globalContext } from "@/contexts/globalContext";
import type { IUserResponse } from "@/types";
import { apiUrl } from "@/utils";
import formatDate from "@/utils/formatDate";
import React, { useContext, useEffect, useRef, useState } from "react";

const Users = (): React.JSX.Element => {
  const {
    users,
    isLoading,
    isAuthorized,
    setIsAuthorized,
    setIsLoading,
    setUsers,
  } = useContext(globalContext);
  const [page, setPage] = useState<number>(2);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef<HTMLDivElement>(null);
  const loading = isLoading || !isAuthorized;
  const token = localStorage.getItem("accessToken");

  const fetchNextPage = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${apiUrl}/users?page=${page}&limit=10`, {
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
      });
      const data: IUserResponse[] = await res.json();
      if (data.length < 10) {
        setHasMore(false);
      }
      setUsers([...users, ...data]);
      setPage(page + 1);
    } catch (error) {
      console.error("Error loading users", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!hasMore) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) {
          void fetchNextPage();
        }
      },
      { threshold: 1 },
    );
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [hasMore, loading, page, users]);

  const handleLogout = () => {
    fetch(apiUrl + "/logout", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      credentials: "include",
    }).then((res) => {
      if (res.status === 200) {
        localStorage.removeItem("accessToken");
        setIsAuthorized(false);
      }
    });
  };

  return (
    <div className="not-prose overflow-auto bg-white outline outline-white/5 dark:bg-gray-950/50 w-full min-h-screen flex flex-col">
      <nav className="bg-gray-800">
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          <div className="relative flex h-16 items-center justify-between">
            <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-end">
              <div className="sm:ml-6 sm:block">
                <div className="flex space-x-4">
                  <button
                    className="bg-red-500 hover:bg-red-700 rounded px-3 py-2 text-sm font-medium text-white"
                    aria-current="page"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
      {users.length > 0 ? (
        <div className="m-8 overflow-hidden">
          <table className="w-full table-auto border-collapse text-sm">
            <thead>
              <tr>
                <th className="th">ID</th>
                <th className="th">Email</th>
                <th className="th">First Name</th>
                <th className="th">Last Name</th>
                <th className="th">Created At</th>
                <th className="th">Updated At</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800">
              {users.map((user: IUserResponse) => (
                <tr key={user.id}>
                  <td className="td">{user.id}</td>
                  <td className="td">{user.email}</td>
                  <td className="td">{user.firstname}</td>
                  <td className="td">{user.lastname}</td>
                  <td className="td">{formatDate(user.createdAt)}</td>
                  <td className="td">{formatDate(user.updatedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {hasMore && <div ref={loaderRef} />}
        </div>
      ) : (
        <>
          {!loading && (
            <div className="flex flex-1 justify-center items-center">
              <p className="text-xl font-semibold text-gray-700 dark:text-white p-4">
                No users found.
              </p>
            </div>
          )}
        </>
      )}
      {isLoading && (
        <Spinner
          wrapperProps={{
            className: "fixed inset-0 flex justify-center items-center",
          }}
        />
      )}
    </div>
  );
};

// noinspection JSUnusedGlobalSymbols
export default Users;
