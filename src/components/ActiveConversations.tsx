import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useWebSocket, { ReadyState } from "react-use-websocket";
import InfiniteScroll from "react-infinite-scroll-component";
import { useParams } from "react-router-dom";
import { Message } from "./Message";
import { useHotkeys } from "react-hotkeys-hook";
import { BiCheckDouble, BiCheck } from "react-icons/bi";
import { FaRegEdit } from "react-icons/fa";

import { MessageModel } from "../models/Message";
import { ChatLoader } from "./ChatLoader";
import { GoPrimitiveDot } from "react-icons/go";

import { AuthContext } from "../contexts/AuthContext";
import { ConversationModel } from "../models/Conversation";
import ChooseConversationPopup from "./UI/ChooseConversationPopup";
import { UserModelTable } from "../models/UserModelTable";
import { JUST_HOST, PORT } from "../config/server";

type Props = {
  conversName?: string;
};

type UnreadMessages = {
  name: string;
  count: number;
};

export function ActiveConversations(props: Props) {
  const { user } = useContext(AuthContext);
  const [conversations, setActiveConversations] = useState<ConversationModel[]>(
    []
  );

  const [isOpen, setIsOpen] = useState(false);

  const togglePopup = () => {
    setIsOpen(!isOpen);
  };

  const [activeUsers, setActiveUsers] = useState<string[]>([]);
  const [unreadMessages, setUnreadMessages] = useState<UnreadMessages[]>([]);

  const { readyState, sendJsonMessage } = useWebSocket(
    user ? `ws://${JUST_HOST}:${PORT}/conversations/` : null,
    {
      queryParams: {
        token: user ? user.token : "",
      },
      onOpen: () => {
        console.log("Connected!");
      },
      onClose: () => {
        console.log("Disconnected!");
      },
      // New onMessage handler
      onMessage: (e) => {
        const data = JSON.parse(e.data);
        switch (data.type) {
          case "online_user_list":
            setActiveUsers(data.users);
            break;
          case "unread_messages":
            var oldConversations = [...conversations];
            var index = oldConversations.findIndex(
              (el) => (el.name = data.name)
            );
            var oldConversation = oldConversations[index];
            if (oldConversation) {
              oldConversation.last_message = data.message;
              oldConversations[index] = oldConversation;
              setActiveConversations([...oldConversations]);
            }
            if (data.user === user?.username) {
              setUnreadMessages(JSON.parse(data.unread_messages));
            }
            break;
          case "new_unread_message":
            var oldConversations = [...conversations];
            var index = oldConversations.findIndex(
              (el) => (el.name = data.name)
            );
            var oldConversation = oldConversations[index];
            if (oldConversation) {
              oldConversation.last_message = data.message;
              oldConversations[index] = oldConversation;
              setActiveConversations([...oldConversations]);
            }
            if (data.from_user == user?.username) {
              break;
            }
            var oldMessages = [...unreadMessages];
            const convName = data.name;
            var index = oldMessages.findIndex((el) => (el.name = convName));
            if (index == -1) {
              var newElem = { name: convName, count: 1 };
              oldMessages.concat(newElem);
            } else {
              var oldElem = oldMessages[index];
              oldElem.count += 1;
              oldMessages[index] = oldElem;
            }
            setUnreadMessages([...oldMessages]);
            break;
          case "user_join":
            setActiveUsers((pcpts: string[]) => {
              if (!pcpts.includes(data.user)) {
                return [...pcpts, data.user];
              }
              return pcpts;
            });
            break;
          case "user_leave":
            console.log(data.user, "logout");
            setActiveUsers((pcpts: string[]) => {
              const newPcpts = pcpts.filter((x) => x !== data.user);
              return newPcpts;
            });
            break;
          default:
            console.log(data.type);
            console.error("Unknown message type!");
            break;
        }
      },
    }
  );

  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];

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
    // return date.toLocaleTimeString().slice(0, 12);
    var time = date.toLocaleTimeString().slice(0, 7).split(":");
    var betterTime = `${time[0]}:${time[1]} `;
    return (
      betterTime +
      date.toLocaleTimeString().slice(-3, date.toLocaleTimeString().length + 1)
    );
  }

  return (
    <div
    // style={{
    //   display: "flex",
    //   justifyContent: "space-between",
    //   height: window.innerHeight - 100,
    // }}
    >
      <div className="py-2">
        <div
          className="headerWrapper"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingBlock: "10px",
            borderBottom: "1px solid #C9C9C9",
          }}
        >
          <div
            className="headerBlock"
            style={{
              display: "flex",
              gap: "10px",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <p></p>
            <h3
              className=" font-semibold text-gray-500"
              style={{ textAlign: "center" }}
            >
              {user?.username}
            </h3>
            <div
              className="iconBlockStartNewConv"
              style={{ marginRight: "10px" }}
            >
              <FaRegEdit size={20} onClick={togglePopup} />
            </div>
          </div>
        </div>
      </div>
      <div className="conversationBlock border border-gray-200">
        {conversations.length ? (
          conversations.map((c) => (
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
                  position: "relative",
                }}
              >
                <div
                  className="imageBlock"
                  style={{
                    height: "45px",
                    width: "50px",
                    position: "relative",
                  }}
                >
                  <img
                    src={
                      c.other_user.image
                        ? c.other_user.image
                        : "/images/man.png"
                    }
                    alt=""
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: "50%",
                    }}
                  />
                  {
                    <span
                      className=""
                      style={{
                        position: "absolute",
                        bottom: 0,
                        right: -10,
                      }}
                    >
                      {activeUsers.includes(c.other_user.username) ? (
                        <GoPrimitiveDot color="green" />
                      ) : (
                        <GoPrimitiveDot color="grey" />
                      )}
                    </span>
                  }
                </div>

                <div className=" w-full p-3">
                  <h3 className="text-xl font-semibold text-gray-800">
                    {c.other_user.username}
                  </h3>
                  <div className="flex justify-between">
                    <p className="text-gray-700" style={{ maxWidth: "100px" }}>
                      {c.last_message?.content ? (
                        c.last_message?.content?.toString().length! > 10 ? (
                          <span
                            style={{ fontSize: "14px" }}
                          >{`${c.last_message?.content.slice(0, 11)}...`}</span>
                        ) : (
                          <span style={{ fontSize: "14px" }}>
                            {c.last_message?.content}
                          </span>
                        )
                      ) : c.last_message?.images ? (
                        <span style={{ fontSize: "14px" }}>photo message</span>
                      ) : (
                        ""
                      )}
                    </p>
                    <div
                      className="blockRight"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                      }}
                    >
                      <div className="blockMessageStatus">
                        {user?.username ==
                          c.last_message?.from_user.username && (
                          <div className="read">
                            {c.last_message?.read ? (
                              <BiCheckDouble color="green" />
                            ) : (
                              <BiCheck />
                            )}
                          </div>
                        )}
                      </div>
                      <p className="text-gray-700">
                        {formatMessageTimestamp(c.last_message?.timestamp)}
                      </p>
                    </div>
                  </div>
                </div>
                {
                  <div
                    className=""
                    style={{
                      position: "absolute",
                      top: 5,
                      right: 5,
                    }}
                  >
                    {unreadMessages &&
                    unreadMessages.find((el) => el.name == c.name) &&
                    unreadMessages.find((el) => el.name == c.name)?.count ? (
                      <div
                        className="unreadMessage"
                        style={{
                          paddingLeft: "7px",
                          paddingRight: "7px",
                          border: "2px solid grey",
                          borderRadius: "50%",
                        }}
                      >
                        {unreadMessages.find((el) => el.name == c.name)?.count}
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                }
              </div>
            </Link>
          ))
        ) : (
          <div
            className="emptyConversations"
            style={{
              height: window.innerHeight - 165,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
              fontSize: "13px",
            }}
          >
            You don't have any active conversation, start one!
          </div>
        )}
      </div>
      {isOpen && <ChooseConversationPopup handleClose={togglePopup} />}
    </div>
  );
}
