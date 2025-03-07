import { globalContext } from '@/contexts/globalContext'
import type { IUserResponse } from '@/types'
import React, { useContext } from 'react'


const Users = () => {
  const { users, isAuthorized } = useContext(globalContext);
  
  if (!isAuthorized) {
    return <div>Loading...</div>;
  }
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Users</h1>
      {users.length > 0 ? (
        <table className="table-auto w-full">
          <thead>
          <tr>
            <th className="px-4 py-2">ID</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">First Name</th>
            <th className="px-4 py-2">Last Name</th>
            <th className="px-4 py-2">Created At</th>
            <th className="px-4 py-2">Updated At</th>
          </tr>
          </thead>
          <tbody>
          {users.map((user: IUserResponse) => (
            <tr key={user.id}>
              <td className="border px-4 py-2">{user.id}</td>
              <td className="border px-4 py-2">{user.email}</td>
              <td className="border px-4 py-2">{user.firstname}</td>
              <td className="border px-4 py-2">{user.lastname}</td>
              <td className="border px-4 py-2">{user.createdAt}</td>
              <td className="border px-4 py-2">{user.updatedAt}</td>
            </tr>
          ))}
          </tbody>
        </table>
      ) : (
        <p>No users found.</p>
      )}
    </div>
  );
};

export default Users;