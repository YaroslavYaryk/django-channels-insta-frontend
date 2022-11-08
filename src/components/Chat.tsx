import React, { useState, useContext, useEffect, useRef } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { AuthContext } from "../contexts/AuthContext";
import InfiniteScroll from "react-infinite-scroll-component";
import { useParams } from "react-router-dom";
import { Message } from "./Message";
import { useHotkeys } from "react-hotkeys-hook";
import { TbMinusVertical } from "react-icons/tb";

import { MessageModel } from "../models/Message";
import { ChatLoader } from "./ChatLoader";
import { ConversationModel } from "../models/Conversation";
import { GoPrimitiveDot } from "react-icons/go";
import { FiImage } from "react-icons/fi";
import { TiTimes } from "react-icons/ti";
import { BsFillReplyFill } from "react-icons/bs";
import EmojiPicker, { EmojiStyle } from "emoji-picker-react";

import { BsEmojiSmile } from "react-icons/bs";

import { JUST_HOST, PORT } from "../config/server";

import { formatMessageTimestamp } from "../services/TimeServices";

// ES6 Modules or TypeScript
import Swal from "sweetalert2";
import { MessageLike } from "../models/MessageLike";

function useRunAfterUpdate() {
  const afterPaintRef = React.useRef<any>(null);
  React.useLayoutEffect(() => {
    if (afterPaintRef.current) {
      afterPaintRef.current();
      afterPaintRef.current = null;
    }
  });
  const runAfterUpdate = (fn: any) => (afterPaintRef.current = fn);
  return runAfterUpdate;
}

type FileBase64 = {
  id: number;
  url: string;
};

function Chat() {
  const { conversationName } = useParams(); // add this

  const { user } = useContext(AuthContext);
  const [welcomeMessage, setWelcomeMessage] = useState("");
  const [participants, setParticipants] = useState<string[]>([]);
  const [filesBase64, setFilesBase64] = useState<FileBase64[]>([]);
  const [emojiOpen, setEmojiOpen] = useState(false);

  const [isEdit, setIsEdit] = useState(false);
  const [editedId, setEditedId] = useState<string | null>("");

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
  const [query, setQuery] = useState(0);
  const [isReply, setIsReply] = useState(false);
  const [repliedMessageId, setRepliedMessageId] = useState<string | null>("");

  const runAfterUpdate = useRunAfterUpdate();

  function updateTyping(event: { user: string; typing: boolean }) {
    if (event.user !== user!.username) {
      setTyping(event.typing);
    }
  }

  const clearImage = (id: number) => {
    // setFfilesBase64();
    console.log(filesBase64, id);
    setFilesBase64((old) => old.filter((el) => el.id !== id));
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
          case "delete_message":
            setMessageHistory((prev: any) =>
              prev.filter((el: any) => el.id !== data.message_id)
            );
            break;

          case "edit_message":
            console.log("here");
            var oldMessages = [...messageHistory];
            var index = oldMessages.findIndex(
              (el) => el.id === data.message.id
            );
            console.log(data.message);
            oldMessages[index] = data.message;
            setMessageHistory([...oldMessages]);
            break;

          case "message_like":
            var oldMessages = [...messageHistory];
            var index = oldMessages.findIndex(
              (el) => el.id === data.message_id
            );
            console.log(data, "hre is data");
            var oldMessage: MessageModel = oldMessages[index];
            console.log(oldMessage);
            oldMessage.likes = data.message_likes;
            oldMessages[index] = oldMessage;
            setMessageHistory(oldMessages);
            break;

          case "last_30_messages":
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
            setQuery(Math.random() + Math.random() + Math.random());
            // var oldConversation:ConversationModel = {...conversation}
            // oldConversation.other_user = data.updated_user
            // setConversation({...oldConversation})

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
  }, [conversationName, user, query]);

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
    console.log("on change");
    setMessage(e.target.value);
    onType();
  }

  function handleSubmit() {
    if (message.length > 0 || filesBase64.length > 0) {
      if (isEdit) {
        sendJsonMessage({
          type: "edit_message",
          messageId: editedId,
          message: message,
          filesBase64: filesBase64,
        });
      } else {
        sendJsonMessage({
          type: "chat_message",
          message,
          filesBase64: filesBase64,
          parent: repliedMessageId,
        });
      }
      setMessage("");
      setFilesBase64([]);
      clearTimeout(timeout.current);
      timeoutFunction();
      setIsEdit(false);
      setEditedId(null);
      setRepliedMessageId(null);
      setIsReply(false);
    }
  }

  const deleteMessage = (messageId: string) => {
    sendJsonMessage({
      type: "delete_message",
      messageId,
    });
  };

  const replyMessage = (messageId: string) => {
    setRepliedMessageId(messageId);
    setIsReply(true);
  };

  const editMessage = (messageId: string) => {
    setIsEdit(true);
    setEditedId(messageId);
    var message: MessageModel = messageHistory.find(
      (el: any) => el.id === messageId
    );
    console.log(message.images);
    setMessage(message.content);
    setFilesBase64(
      message.images.map((el) => ({
        url: el,
        id: Math.random() + Math.random(),
      }))
    );
  };

  const likeMessage = (messageId: string) => {
    var message: MessageModel = messageHistory.find(
      (el: any) => el.id === messageId
    );
    const messageLike = message.likes.find(
      (el: MessageLike) => el.user === user?.username
    );
    if (messageLike) {
      sendJsonMessage({
        type: "delete_message_like",
        messageId,
        user: user?.username,
      });
    } else {
      sendJsonMessage({
        type: "create_message_like",
        messageId,
        user: user?.username,
      });
    }
  };

  const getMessageById = (messageId: string): MessageModel => {
    return messageHistory.find((el: MessageModel) => el.id === messageId);
  };

  function convertFile(files: FileList | null) {
    if (files?.length && files.length > 4) {
      Swal.fire({
        icon: "error",
        text: "You cant attach more than 4 pictures",
      });
      return;
    }
    var pictures: FileBase64[] = [];
    if (files) {
      for (var i = 0; i < files.length; i++) {
        const fileRef = files[i] || "";
        const fileType: string = fileRef.type || "";
        const reader = new FileReader();
        reader.readAsBinaryString(fileRef);
        reader.onload = (ev: any) => {
          // convert it to base64
          pictures.push({
            id: Math.random() + Math.random() + Math.random(),
            url: `data:${fileType};base64,${btoa(ev.target.result)}`,
          });
          setFilesBase64([...pictures]);
        };
      }
    }
  }

  const handleChoseEmoji = (emoji: any, event: MouseEvent) => {
    var start = inputReference.current.selectionStart;
    var end = inputReference.current.selectionStart;

    if (
      inputReference.current.selectionStart ==
      inputReference.current.selectionEnd
    ) {
      setMessage(
        `${message.slice(0, start)}${emoji.emoji}${message.slice(start)}`
      );
    } else {
      setMessage(
        `${message.slice(0, start)}${emoji.emoji}${message.slice(end)}`
      );
    }

    runAfterUpdate(() => {
      inputReference.current.selectionStart = end + 2;
      inputReference.current.selectionEnd = end + 2;
    });

    inputReference.current.focus();
  };

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
                  src={
                    conversation.other_user.image
                      ? conversation.other_user.image
                      : "/images/man.png"
                  }
                  alt=""
                  style={{ width: "100%", height: "100%", borderRadius: "50%" }}
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
                {!participants.includes(conversation.other_user.username) && (
                  <span
                    style={{
                      display: "block",
                      fontSize: "10px",
                      fontWeight: "400",
                    }}
                  >
                    Seen at{" "}
                    {formatMessageTimestamp(conversation.other_user.last_login)}
                  </span>
                )}
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
          height:
            filesBase64.length > 0 && isReply
              ? window.innerHeight - 364
              : filesBase64.length > 0
              ? window.innerHeight - 312
              : isReply
              ? window.innerHeight - 302
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
              <Message
                key={message.id}
                message={message}
                deleteMessage={deleteMessage}
                editMessage={editMessage}
                likeMessage={likeMessage}
                getMessageById={getMessageById}
                replyMessage={replyMessage}
              />
            ))}
          </InfiniteScroll>
        </div>
      </div>
      {isReply && (
        <div
          className="replyBlock"
          style={{
            marginBottom: "10px",
            border: "1px solid #B2B2B2",
            borderRadius: "5px",
          }}
        >
          <div
            className="replyBlockInner"
            style={{
              display: "flex",
              // gap: "10px",
              alignItems: "center",
              gap: "0px",
              position: "relative",
            }}
          >
            <BsFillReplyFill size={30} />
            <TbMinusVertical size={40} />
            {getMessageById(repliedMessageId!).content ? (
              <div>
                {getMessageById(repliedMessageId!)?.content.length > 80
                  ? `${getMessageById(repliedMessageId!)?.content.slice(
                      0,
                      81
                    )}...`
                  : getMessageById(repliedMessageId!)?.content}
              </div>
            ) : (
              <div
                className="imagesBlock"
                style={{ display: "flex", gap: "10px", alignItems: "center" }}
              >
                {getMessageById(repliedMessageId!)?.images.map((el: string) => (
                  <div style={{ width: "30px", height: "30px" }}>
                    <img
                      style={{ height: "100%", width: "100%" }}
                      className="pickedMessageImage"
                      src={el}
                      alt=""
                    />
                  </div>
                ))}
              </div>
            )}
            <span
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                cursor: "pointer",
              }}
            >
              {" "}
              <TiTimes
                color="black"
                onClick={() => {
                  setIsReply(false);
                  setRepliedMessageId(null);
                }}
              />
            </span>
          </div>
        </div>
      )}
      {filesBase64.length > 0 && (
        <div
          className="selectedImageBlock"
          style={{
            marginBottom: "10px",
            border: "1px solid #B2B2B2",
            borderRadius: "5px",
          }}
        >
          <div className="blockInner" style={{ display: "flex", gap: "10px" }}>
            {filesBase64.map((el) => (
              <div
                className="block"
                key={el.id}
                style={{
                  width: "50px",
                  height: "50px",
                  position: "relative",
                  padding: "5px",
                }}
              >
                <img
                  src={el.url}
                  className="pickedMessageImage"
                  alt=""
                  style={{ height: "100%", width: "100%" }}
                />
                <span
                  style={{
                    position: "absolute",
                    top: -8,
                    right: -8,
                    cursor: "pointer",
                  }}
                >
                  <TiTimes
                    color="black"
                    onClick={() => {
                      clearImage(el.id);
                    }}
                  />
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex w-full items-center justify-between border border-gray-200 p-3">
        <div className="blockEmojiPick" style={{ position: "relative" }}>
          <BsEmojiSmile
            size={20}
            style={{ cursor: "pointer" }}
            onClick={() => {
              inputReference.current.focus();
              setEmojiOpen(!emojiOpen);
              inputReference.current.focus();
            }}
          />
          {emojiOpen && (
            <div style={{ position: "absolute", top: -500 }}>
              <EmojiPicker
                height={500}
                emojiStyle={EmojiStyle.GOOGLE}
                onEmojiClick={(emojiObject, event) => {
                  handleChoseEmoji(emojiObject, event);
                }}
              />
            </div>
          )}
        </div>
        <input
          type="text"
          placeholder="Message"
          className="block w-full  bg-gray-100 py-2 outline-none focus:text-gray-700"
          key="message"
          style={{ paddingLeft: "15px" }}
          name="message"
          value={message}
          onChange={handleChangeMessage}
          required
          autoFocus
          ref={inputReference}
          maxLength={511}
          onPaste={(e) => {
            console.log(e.clipboardData);
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
                multiple
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
