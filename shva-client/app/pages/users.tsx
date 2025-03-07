import type { IUserResponse } from '@/types/api-response'

interface UsersProps {
  resource: { read: () => IUserResponse[] };
}

function Users({ resource }: UsersProps) {
  const users = resource.read();
  
  return (
    <div>
      <h2>Пользователи</h2>
      {users.map(user => (
        <div key={user.id}>{user.firstname}</div>
      ))}
    </div>
  );
}

export default Users;