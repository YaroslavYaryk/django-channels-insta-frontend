import React from "react";
import { ActiveConversations } from "./ActiveConversations";
import Chat from "./Chat";
import { useParams } from "react-router-dom";

export const ConversationChat = () => {
  const { conversationName } = useParams(); // add this
  console.log(conversationName, "here");

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        height: window.innerHeight - 100,
        border: "0.5px solid #C9C9C9",
      }}
    >
      <div
        className="conversations"
        style={{ width: "30%", borderRight: "1px solid #C9C9C9" }}
      >
        <ActiveConversations conversName={conversationName} />
      </div>
      <div
        className="StartMessage"
        style={{
          width: "69%",
          height: "100%",
        }}
      >
        <Chat />
      </div>
    </div>
  );
};
