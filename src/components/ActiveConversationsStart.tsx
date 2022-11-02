import React from "react";
import { ActiveConversations } from "./ActiveConversations";
import { ConvStart } from "./inner/ConvStart";
import { ConversationStart } from "./UI/ConversationStart";

export const ActiveConversationsStart = () => {
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
        <ActiveConversations />
      </div>
      <div
        className="StartMessage"
        style={{
          width: "69%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "row",
        }}
      >
        <ConversationStart />
      </div>
    </div>
  );
};
