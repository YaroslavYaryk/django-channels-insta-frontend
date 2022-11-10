import React, { useContext, useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { UserModelTable } from "../../models/UserModelTable";
import { AuthContext } from "../../contexts/AuthContext";
import { HOST, PORT } from "../../config/server";
import { useNavigate } from "react-router-dom";
import { ConversationModel } from "../../models/Conversation";

type Props = {
  handleClose: () => void;
  handleChoseUser: (conversationName: string) => void;
};

const ForwardMessagePopup = (props: Props) => {
  const { user } = useContext(AuthContext);

  const [conversations, setActiveConversations] = useState<ConversationModel[]>(
    []
  );

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

  return (
    <div className="popup-box">
      <div className="box" style={{ width: window.innerWidth * 0.3 }}>
        <div className="header">
          <p className="popHeaderTitle">Forward to:</p>
          <span className="close-icon" onClick={props.handleClose}>
            <FaTimes />
          </span>
        </div>
        <div className="contentBlock">
          <div className="suggestedBlock">
            <p className="suggestedBlockText">Suggested</p>
          </div>

          {conversations.map((conv) => (
            <div
              key={conv.name}
              className="profileBlock"
              onClick={() => props.handleChoseUser(conv.name)}
            >
              <div
                className="profileElements"
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <div
                  className="imageBlock"
                  style={{ height: "45px", width: "50px" }}
                >
                  {conv.other_user.image ? (
                    <img
                      src={conv.other_user.image}
                      alt="profile"
                      style={{ width: "100%", height: "100%" }}
                    />
                  ) : (
                    <img
                      src="/images/man.png"
                      alt=""
                      style={{ width: "100%", height: "100%" }}
                    />
                  )}
                </div>
                <div className="usernameBlock">{conv.other_user.username}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ForwardMessagePopup;
