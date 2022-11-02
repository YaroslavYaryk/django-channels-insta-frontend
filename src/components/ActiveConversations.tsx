import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { ConversationModel } from "../models/Conversation";

type Props = {
  conversName?: string;
};

export function ActiveConversations(props: Props) {
  const { user } = useContext(AuthContext);
  const [conversations, setActiveConversations] = useState<ConversationModel[]>(
    []
  );

  console.log(user?.token);

  useEffect(() => {
    async function fetchUsers() {
      const res = await fetch(
        "http://127.0.0.1:8000/chat/api/active_conversation/",
        {
          headers: {
            Authorization: `Token ${user?.token}`,
          },
        }
      );
      const data = await res.json();
      setActiveConversations(data);
    }
    fetchUsers();
  }, [user]);

  function createConversationName(username: string) {
    const namesAlph = [user?.username, username].sort();
    return `${namesAlph[0]}__${namesAlph[1]}`;
  }

  function formatMessageTimestamp(timestamp?: string) {
    if (!timestamp) return;
    const date = new Date(timestamp);
    return date.toLocaleTimeString().slice(0, 4);
  }

  return (
    <div
    // style={{
    //   display: "flex",
    //   justifyContent: "space-between",
    //   height: window.innerHeight - 100,
    // }}
    >
      <div className="conversationBlock border border-gray-200">
        {conversations.map((c) => (
          <Link
            to={`/chats/${createConversationName(c.other_user.username)}`}
            key={c.other_user.username}
          >
            <div
              className="fullBlock"
              style={{
                display: "flex",
                alignItems: "center",
                paddingLeft: "10px",
                background: props.conversName == c.name ? "#DBDBDB" : "",
              }}
            >
              <div
                className="imageBlock"
                style={{ height: "45px", width: "50px" }}
              >
                <img
                  src="/images/man.png"
                  alt=""
                  style={{ width: "100%", height: "100%" }}
                />
              </div>
              <div className=" w-full p-3">
                <h3 className="text-xl font-semibold text-gray-800">
                  {c.other_user.username}
                </h3>
                <div className="flex justify-between">
                  <p className="text-gray-700">{c.last_message?.content}</p>
                  <p className="text-gray-700">
                    {formatMessageTimestamp(c.last_message?.timestamp)}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
