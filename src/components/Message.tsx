import React, { useContext, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { MessageModel } from "../models/Message";
import { BiCheckDouble, BiCheck } from "react-icons/bi";
import Modal from "react-modal";
import Lightbox, { ImagesListType } from "react-spring-lightbox";
import { formatMessageTimestamp } from "../services/TimeServices";
import { BsThreeDotsVertical } from "react-icons/bs";

export function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

export function Message({
  message,
  deleteMessage,
  editMessage,
}: {
  message: MessageModel;
  deleteMessage: (id: string) => void;
  editMessage: (id: string) => void;
}) {
  const { user } = useContext(AuthContext);
  const [hoverOpen, setHoverOpen] = useState(false);

  const [isOpen, setIsopen] = useState(false);
  const [messageOptionsOpen, setMessageOptionsOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState("");

  return (
    <li
      className={classNames(
        "mt-1 mb-3 flex",
        user!.username === message.to_user.username
          ? "justify-start"
          : "justify-end"
      )}
    >
      <div
        className={classNames("")}
        onMouseEnter={() => {
          if (!messageOptionsOpen) {
            setHoverOpen(!hoverOpen);
          }
        }}
        onMouseLeave={() => {
          if (!messageOptionsOpen) {
            setHoverOpen(!hoverOpen);
          }
        }}
        style={{
          paddingLeft: user!.username !== message.to_user.username ? "30px" : 0,
          paddingRight:
            user!.username === message.to_user.username ? "30px" : 0,
          position: "relative",
        }}
      >
        {hoverOpen &&
          (user!.username !== message.to_user.username ? (
            <span
              className="imageDots"
              style={{ position: "absolute", bottom: 0, left: 0 }}
            >
              <BsThreeDotsVertical
                onClick={() => {
                  setMessageOptionsOpen(!messageOptionsOpen);
                }}
              />
            </span>
          ) : (
            <span
              className="imageDots"
              style={{ position: "absolute", bottom: 0, right: 0 }}
            >
              <BsThreeDotsVertical
                onClick={() => {
                  setMessageOptionsOpen(!messageOptionsOpen);
                }}
              />
            </span>
          ))}
        {messageOptionsOpen &&
          (user!.username !== message.to_user.username ? (
            <div
              className="messageOptionsOpen"
              style={{
                position: "absolute",
                bottom: 30,
                left: -100,
                height: "60px",
                width: "100px",
              }}
            >
              <ul
                style={{
                  fontSize: "13px",
                  border: "1px solid #B7B2B2",
                  padding: "5px",
                  borderTopRightRadius: "10px",
                  borderTopLeftRadius: "10px",
                  borderBottomLeftRadius: "10px",
                }}
              >
                <li className="imageOption">Reply</li>
                <li
                  className="imageOption"
                  onClick={() => {
                    editMessage(message.id);
                    setHoverOpen(false);
                    setMessageOptionsOpen(false);
                  }}
                >
                  Edit
                </li>
                <li
                  onClick={() => {
                    deleteMessage(message.id);
                    setHoverOpen(false);
                    setMessageOptionsOpen(false);
                  }}
                  className="imageOption"
                >
                  Delete
                </li>
              </ul>
            </div>
          ) : (
            <div
              className="messageOptionsOpen"
              style={{
                position: "absolute",
                bottom: 30,
                right: -100,
                height: "60px",
                width: "100px",
              }}
            >
              <ul
                style={{
                  fontSize: "13px",
                  border: "1px solid #B7B2B2",
                  padding: "5px",
                  borderTopRightRadius: "10px",
                  borderTopLeftRadius: "10px",
                  borderBottomRightRadius: "10px",
                }}
              >
                <li className="imageOption">Reply</li>
                <li className="imageOption">Like</li>
              </ul>
            </div>
          ))}

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
