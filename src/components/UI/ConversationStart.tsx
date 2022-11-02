import React from "react";
import { FiSend } from "react-icons/fi";
import { IconContext } from "react-icons";
import { FaBars } from "react-icons/fa";

export const ConversationStart = () => {
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
        <a
          className="mt-5"
          style={{
            padding: 7,
            background: "#0195f7",
            color: "white",
            fontSize: "14px",
            borderRadius: "5px",
          }}
          href=""
        >
          Send Message
        </a>
      </div>
    </div>
  );
};
