import React, { useState, useContext, useEffect, useRef } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { AuthContext } from "../contexts/AuthContext";
import InfiniteScroll from "react-infinite-scroll-component";
import { useParams } from "react-router-dom";
import { Message } from "./Message";
import { useHotkeys } from "react-hotkeys-hook";

import { MessageModel } from "../models/Message";
import { ChatLoader } from "./ChatLoader";
import { ConversationModel } from "../models/Conversation";
import { GoPrimitiveDot } from "react-icons/go";
import { FiImage } from "react-icons/fi";
import { TiTimes } from "react-icons/ti";
import EmojiPicker from "emoji-picker-react";
import { BsEmojiSmile } from "react-icons/bs";

import { JUST_HOST, PORT } from "../config/server";

function Chat() {
  const { conversationName } = useParams(); // add this

  const { user } = useContext(AuthContext);
  const [welcomeMessage, setWelcomeMessage] = useState("");
  const [participants, setParticipants] = useState<string[]>([]);
  const [fileBase64, setFileBase64] = useState<string>("");
  const [emojiOpen, setEmojiOpen] = useState(false);

  const [page, setPage] = useState(2);
  const [hasMoreMessages, setHasMoreMessages] = useState(false);
  const [message, setMessage] = useState("");
  const [messageHistory, setMessageHistory] = useState<any>([]);
  const [conversation, setConversation] = useState<ConversationModel | null>(
    null
  );
  const [meTyping, setMeTyping] = useState(false);
  const [typing, setTyping] = useState(false);
  const timeout = useRef<any>();

  function updateTyping(event: { user: string; typing: boolean }) {
    if (event.user !== user!.username) {
      setTyping(event.typing);
    }
  }

  const clearImage = () => {
    setFileBase64("");
  };

  const { readyState, sendJsonMessage } = useWebSocket(
    user ? `ws://${JUST_HOST}:${PORT}/chats/${conversationName}/` : null,
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
          case "welcome_message":
            setWelcomeMessage(data.message);
            break;
          case "greeting_response":
            setWelcomeMessage(data.message);
            break;
          case "read_messages":
            if (user?.username != data.user) {
              var oldMessHistory = [...messageHistory];
              oldMessHistory.map((el: MessageModel) => {
                if (!el.read) {
                  el.read = true;
                }
              });
              setMessageHistory(oldMessHistory);
            }
            break;

          case "last_30_messages":
            console.log(data.has_more);
            setMessageHistory(data.messages);
            setHasMoreMessages(data.has_more);
            break;
          case "chat_message_echo":
            setMessageHistory((prev: any) => [data.message, ...prev]);
            sendJsonMessage({ type: "read_messages" });
            break;
          case "read_message_to_change_icon":
            setMessageHistory((prev: any) =>
              prev.map((item: any) =>
                item.id === data.message ? data.message : item
              )
            );
            break;
          case "user_join":
            setParticipants((pcpts: string[]) => {
              if (!pcpts.includes(data.user)) {
                return [...pcpts, data.user];
              }
              return pcpts;
            });
            break;
          case "user_leave":
            setParticipants((pcpts: string[]) => {
              const newPcpts = pcpts.filter((x) => x !== data.user);
              return newPcpts;
            });
            break;
          case "online_user_list":
            setParticipants(data.users);
            break;

          case "typing":
            updateTyping(data);
            break;
          default:
            console.log(data.type);
            console.error("Unknown message type!");
            break;
        }
      },
    }
  );

  async function fetchMessages() {
    const apiRes = await fetch(
      `http://127.0.0.1:8000/chat/api/messages/?conversation=${conversationName}&page=${page}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      }
    );
    if (apiRes.status === 200) {
      const data: {
        count: number;
        next: string | null; // URL
        previous: string | null; // URL
        results: MessageModel[];
      } = await apiRes.json();
      setHasMoreMessages(data.next !== null);
      setPage(page + 1);
      setMessageHistory((prev: MessageModel[]) => prev.concat(data.results));
    }
  }

  useEffect(() => {
    async function fetchConversation() {
      const apiRes = await fetch(
        `http://127.0.0.1:8000/chat/api/conversation/${conversationName}/`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Token ${user?.token}`,
          },
        }
      );
      if (apiRes.status === 200) {
        const data: ConversationModel = await apiRes.json();
        setConversation(data);
      }
    }
    fetchConversation();
  }, [conversationName, user]);

  function timeoutFunction() {
    setMeTyping(false);
    sendJsonMessage({ type: "typing", typing: false });
  }

  function onType() {
    if (meTyping === false) {
      setMeTyping(true);
      sendJsonMessage({ type: "typing", typing: true });
      timeout.current = setTimeout(timeoutFunction, 5000);
    } else {
      clearTimeout(timeout.current);
      timeout.current = setTimeout(timeoutFunction, 5000);
    }
  }

  useEffect(() => () => clearTimeout(timeout.current), []);

  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];

  useEffect(() => {
    if (connectionStatus === "Open") {
      sendJsonMessage({
        type: "read_messages",
      });
    }
  }, [connectionStatus, sendJsonMessage]);

  const inputReference: any = useHotkeys(
    "enter",
    () => {
      handleSubmit();
    },
    {
      enableOnTags: ["INPUT"],
    }
  );

  useEffect(() => {
    (inputReference.current as HTMLElement).focus();
  }, [inputReference]);

  function handleChangeMessage(e: any) {
    setMessage(e.target.value);
    console.log(e.target.selectionStart);
    onType();
  }

  function handleSubmit() {
    if (message.length > 0 || fileBase64.length > 0) {
      sendJsonMessage({
        type: "chat_message",
        message,
        fileBase64,
      });
      setMessage("");
      setFileBase64("");
      clearTimeout(timeout.current);
      timeoutFunction();
    }
  }

  function convertFile(files: FileList | null) {
    if (files) {
      const fileRef = files[0] || "";
      const fileType: string = fileRef.type || "";
      console.log("This file upload is of type:", fileType);
      const reader = new FileReader();
      reader.readAsBinaryString(fileRef);
      reader.onload = (ev: any) => {
        // convert it to base64
        setFileBase64(`data:${fileType};base64,${btoa(ev.target.result)}`);
      };
    }
  }

  return (
    <div style={{ height: window.innerHeight - 100 }}>
      {conversation && (
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
              }}
            >
              <div
                className="imageBlock"
                style={{ height: "30px", width: "30px", position: "relative" }}
              >
                <img
                  src="/images/man.png"
                  alt=""
                  style={{ width: "100%", height: "100%" }}
                />
                <span
                  className=""
                  style={{
                    position: "absolute",
                    bottom: -5,
                    right: -10,
                  }}
                >
                  {participants.includes(conversation.other_user.username) ? (
                    <GoPrimitiveDot color="green" />
                  ) : (
                    <GoPrimitiveDot color="grey" />
                  )}
                </span>
              </div>
              <h3 className=" font-semibold text-gray-900" style={{}}>
                {conversation.other_user.username}
              </h3>
            </div>
            {typing && (
              <p
                style={{ marginRight: "20px" }}
                className="truncate text-sm text-gray-500"
              >
                typing...
              </p>
            )}
          </div>
        </div>
      )}

      <div
        id="scrollableDiv"
        className={
          " mt-3 flex flex-col-reverse relative w-full border border-gray-200 overflow-y-auto p-6"
        }
        style={{
          height: fileBase64
            ? window.innerHeight - 310
            : window.innerHeight - 250,
        }}
      >
        <div>
          {/* Put the scroll bar always on the bottom */}
          <InfiniteScroll
            dataLength={messageHistory.length}
            next={fetchMessages}
            className="flex flex-col-reverse" // To put endMessage and loader to the top
            inverse={true}
            hasMore={hasMoreMessages}
            loader={<ChatLoader />}
            scrollableTarget="scrollableDiv"
          >
            {messageHistory.map((message: MessageModel) => (
              <Message key={message.id} message={message} />
            ))}
          </InfiniteScroll>
        </div>
      </div>
      {fileBase64 && (
        <div
          className="selectedImageBlock"
          style={{
            marginBottom: "10px",
            border: "1px solid #B2B2B2",
            borderRadius: "5px",
          }}
        >
          <div
            className="blockInner"
            style={{
              width: "50px",
              height: "50px",
              position: "relative",
              padding: "5px",
            }}
          >
            <img src={fileBase64} alt="" />
            <span
              style={{
                position: "absolute",
                top: -8,
                right: -8,
                cursor: "pointer",
              }}
            >
              <TiTimes color="black" onClick={clearImage} />
            </span>
          </div>
        </div>
      )}

      <div className="flex w-full items-center justify-between border border-gray-200 p-3">
        <div className="blockEmojiPick" style={{ position: "relative" }}>
          <BsEmojiSmile
            size={20}
            style={{ cursor: "pointer" }}
            onClick={() => {
              setEmojiOpen(!emojiOpen);
            }}
          />
          {emojiOpen && (
            <div style={{ position: "absolute", top: -500 }}>
              <EmojiPicker
                height={500}
                onEmojiClick={(event, emojiObject) => {
                  console.log(emojiObject, event);
                }}
              />
            </div>
          )}
        </div>
        <input
          type="text"
          placeholder="Message"
          className="block w-full  bg-gray-100 py-2 outline-none focus:text-gray-700"
          style={{ paddingLeft: "15px" }}
          name="message"
          value={message}
          onChange={handleChangeMessage}
          required
          ref={inputReference}
          maxLength={511}
          onGotPointerCaptureCapture={(e) => {
            console.log(e, "pointer capture");
          }}
        />
        <div
          className="rightBlock"
          style={{ display: "flex", alignItems: "center" }}
        >
          <div
            className="imageBlock"
            style={{
              fontFamily: "sans-serif",
              textAlign: "center",
              display: "flex",
            }}
          >
            <label className="custom-file-upload">
              <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => convertFile(e.target.files)}
              />
              <FiImage size={30} />
            </label>
          </div>
          <button
            className="ml-2 bg-gray-300 px-2 py-1"
            style={{ fontSize: "14px", borderRadius: "5px" }}
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chat;
