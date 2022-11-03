import React, { useState } from "react";
import { FiSend } from "react-icons/fi";
import { IconContext } from "react-icons";
import { FaBars } from "react-icons/fa";
import ChooseConversationPopup from "./ChooseConversationPopup";

export const ConversationStart = () => {
  const [isOpen, setIsOpen] = useState(false);

  const togglePopup = () => {
    console.log("here");
    setIsOpen(!isOpen);
  };

  return (
    <div style={{}}>
      <div className="block" style={{ textAlign: "center" }}>
        <div
          className="imageBlock"
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <FiSend size={100} />
        </div>
        <p className="mb-3 mt-3"> Your Messages</p>
        <p className="mb-7" style={{ fontWeight: "400", color: "#8C8C8C" }}>
          Send private messages to a friend.
        </p>

        <input
          className="mt-5"
          type="button"
          value="Send Message"
          style={{
            padding: 7,
            background: "#0195f7",
            color: "white",
            fontSize: "14px",
            borderRadius: "5px",
          }}
          onClick={togglePopup}
        />
      </div>
      {isOpen && <ChooseConversationPopup handleClose={togglePopup} />}
    </div>
  );
};
