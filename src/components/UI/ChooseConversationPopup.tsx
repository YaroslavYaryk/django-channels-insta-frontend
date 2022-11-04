import React, { useContext, useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { UserModelTable } from "../../models/UserModelTable";
import { AuthContext } from "../../contexts/AuthContext";
import { HOST, PORT } from "../../config/server";
import { useNavigate } from "react-router-dom";

type Props = {
  handleClose: () => void;
};

const ChooseConversationPopup = (props: Props) => {
  const { user } = useContext(AuthContext);

  let navigate = useNavigate();

  const [activeUsers, setActiveUsers] = useState<UserModelTable[]>([]);

  useEffect(() => {
    async function fetchUsers() {
      const res = await fetch(`${HOST}:${PORT}/users/api/all/`, {
        headers: {
          Authorization: `Token ${user?.token}`,
        },
      });
      const data = await res.json();
      setActiveUsers(data);
    }
    fetchUsers();
  }, [user]);

  function createConversationName(username: string) {
    const namesAlph = [user?.username, username].sort();
    return `${namesAlph[0]}__${namesAlph[1]}`;
  }

  return (
    <div className="popup-box">
      <div className="box">
        <div className="header">
          <p className="popHeaderTitle">New message</p>
          <span className="close-icon" onClick={props.handleClose}>
            <FaTimes />
          </span>
        </div>
        <div className="middlePart">
          <p className="popHeaderTitle">To: </p>
          <input className="searchInput" type="text" placeholder="Search" />
        </div>
        <div className="contentBlock">
          <div className="suggestedBlock">
            <p className="suggestedBlockText">Suggested</p>
          </div>

          {activeUsers.map((us) => (
            <div
              key={us.id}
              className="profileBlock"
              onClick={() =>
                navigate(`chats/${createConversationName(us.username)}`)
              }
            >
              <div
                className="profileElements"
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <div
                  className="imageBlock"
                  style={{ height: "45px", width: "50px" }}
                >
                  {us.image ? (
                    <img
                      src={us.image}
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
                <div className="usernameBlock">{us.username}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChooseConversationPopup;
