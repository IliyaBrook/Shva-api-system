import { globalContext } from "@/contexts/globalContext";
import type { IUserResponse } from "@/types";
import formatDate from "@/utils/formatDate";
import React, { useContext } from "react";

const Users = (): React.JSX.Element => {
  // const { users, isAuthorized } = useContext(globalContext);
  const { isAuthorized } = useContext(globalContext);
  const users = [];

  if (!isAuthorized) {
    return <div>Loading...</div>;
  }

  return (
    <div className="not-prose overflow-auto bg-white outline outline-white/5 dark:bg-gray-950/50 w-full">
      <nav className="bg-gray-800">
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          <div className="relative flex h-16 items-center justify-between">
            <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
              <div className="hidden sm:ml-6 sm:block">
                <div className="flex space-x-4">
                  <button
                    className="bg-red-500 hover:bg-red-700 rounded bg-gray-900 px-3 py-2 text-sm font-medium text-white"
                    aria-current="page"
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
        </div>
      ) : (
        <p>No users found.</p>
      )}
    </div>
  );
};

// noinspection JSUnusedGlobalSymbols
export default Users;
