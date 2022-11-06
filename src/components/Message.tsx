import React, { useContext, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { MessageModel } from "../models/Message";
import { BiCheckDouble, BiCheck } from "react-icons/bi";
import Modal from "react-modal";
import Lightbox, { ImagesListType } from "react-spring-lightbox";

export function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    // heigth: "50%",
    // width: "50%",
    transform: "translate(-50%, -50%)",
    padding: "0px",
  },
};

// {position: "absolute",
// border: "1px solid #ccc",
// background: "#fff",
// overflow: "auto",
// WebkitOverflowScrolling: "touch",
// borderRadius: "4px",
// outline: "none",
// padding: "20px",
// width: "50%",}

export function Message({ message }: { message: MessageModel }) {
  const { user } = useContext(AuthContext);

  const [isOpen, setIsopen] = useState(false);
  const [imagePreview, setImagePreview] = useState("");

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
              style={{
                maxWidth: "220px",
                maxHeight: "220px",
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
              }}
            >
              {message.images.map((el) => (
                <img
                  onClick={() => {
                    setImagePreview(el);
                    setIsopen(!isOpen);
                  }}
                  key={el}
                  src={el}
                  alt=""
                  className="messageImage"
                  style={{
                    width: `${
                      (100 - message.images.length + 1) / message.images.length
                    }%`,
                    maxWidth: "220px",
                    maxHeight: "220px",
                  }}
                />
              ))}

              {/* <img src={message.image} alt="49%" style={{ width: "33%" }} /> */}
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
      {/* <Modal
        isOpen={isOpen}
        onRequestClose={() => {
          setIsopen(!isOpen);
        }}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <div
          className="ImageBlock"
          style={{
            overflow: "hidden",
            border: "1px solid red",
            // width: "50%",
            // height: "50%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <img src={imagePreview} style={{}} alt="" />
        </div>
      </Modal> */}
      <Lightbox
        isOpen={isOpen}
        onPrev={() => {}}
        onNext={() => {}}
        images={[{ src: imagePreview, loading: "lazy", alt: "" }]}
        currentIndex={0}
        /* Add your own UI */
        // renderHeader={() => (<CustomHeader />)}
        // renderFooter={() => (<CustomFooter />)}
        // renderPrevButton={() => (<CustomLeftArrowButton />)}
        // renderNextButton={() => (<CustomRightArrowButton />)}
        // renderImageOverlay={() => (<ImageOverlayComponent >)}

        /* Add styling */
        className="cool-class"
        style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
        /* Handle closing */
        onClose={() => {
          setIsopen(!isOpen);
        }}

        /* Use single or double click to zoom */
        // singleClickToZoom

        /* react-spring config for open/close animation */
        // pageTransitionConfig={{
        //   from: { transform: "scale(0.75)", opacity: 0 },
        //   enter: { transform: "scale(1)", opacity: 1 },
        //   leave: { transform: "scale(0.75)", opacity: 0 },
        //   config: { mass: 1, tension: 320, friction: 32 }
        // }}
      />
    </li>
  );
}
