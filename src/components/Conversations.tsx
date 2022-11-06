import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { HOST, PORT } from "../config/server";
import { AuthContext } from "../contexts/AuthContext";

interface UserResponse {
  id: number;
  username: string;
  name: string;
  url: string;
}

export function Conversations() {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState<UserResponse[]>([]);

  useEffect(() => {
    async function fetchUsers() {
      const res = await fetch(`${HOST}:${PORT}/users/api/all/`, {
        headers: {
          Authorization: `Token ${user?.token}`,
        },
      });
      const data = await res.json();
      setUsers(data);
    }
    fetchUsers();
  }, [user]);

  function createConversationName(username: string) {
    const namesAlph = [user?.username, username].sort();
    return `${namesAlph[0]}__${namesAlph[1]}`;
  }

  return (
    <div>
      {users
        .filter((u: UserResponse) => u.username !== user?.username)
        .map((u: UserResponse) => (
          <Link key={u.id} to={`chats/${createConversationName(u.username)}`}>
            <div>{u.username}</div>
          </Link>
        ))}
    </div>
  );
}
