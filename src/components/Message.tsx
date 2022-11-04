import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { MessageModel } from "../models/Message";
import { BiCheckDouble, BiCheck } from "react-icons/bi";

export function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

export function Message({ message }: { message: MessageModel }) {
  const { user } = useContext(AuthContext);

  function formatMessageTimestamp(timestamp: string) {
    const date = new Date(timestamp);
    var time = date.toLocaleTimeString().slice(0, 7).split(":");
    var betterTime = `${time[0]}:${time[1]} `;
    return (
      betterTime +
      date.toLocaleTimeString().slice(-3, date.toLocaleTimeString().length + 1)
    );
  }

  return (
    <li
      className={classNames(
        "mt-1 mb-3 flex",
        user!.username === message.to_user.username
          ? "justify-start"
          : "justify-end"
      )}
    >
      <div className={classNames("")} style={{}}>
        <div
          className=""
          style={{
            // border: "2px solid red",
            borderTopLeftRadius: "5px",
            borderTopRightRadius: "5px",
            borderBottomLeftRadius: "5px",
            maxWidth: "250px",
            background: "#E8E8E8",
          }}
        >
          {/* <div className="imageBlock"><div/> */}
          <div className="blockMessage">
            <div
              className="imageBlock"
              style={{ maxWidth: "220px", maxHeight: "220px" }}
            >
              <img src={message.image} alt="" style={{ width: "100%" }} />
            </div>
            <div
              className="block"
              style={{ maxWidth: "220px", padding: "5px", minWidth: "100px" }}
            >
              {message.content}
            </div>
          </div>
          <div
            className="timeReadBlock"
            style={{
              display: "flex",
              minWidth: "60px",
              justifyContent: "end",
            }}
          >
            <span
              className="ml-2"
              style={{
                fontSize: "0.6rem",
                lineHeight: "1rem",
                // width: "100%",
              }}
            >
              {formatMessageTimestamp(message.timestamp)}
            </span>
            {user?.username == message.from_user.username && (
              <div className="read">
                {message.read ? <BiCheckDouble color="green" /> : <BiCheck />}
              </div>
            )}
          </div>
        </div>
      </div>
    </li>
  );
}
