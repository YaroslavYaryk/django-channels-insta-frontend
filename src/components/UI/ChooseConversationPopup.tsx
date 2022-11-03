import React from "react";
import { FaTimes } from "react-icons/fa";

type Props = {
  handleClose: () => void;
};

const ChooseConversationPopup = (props: Props) => {
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
          <div className="profileBlock" onClick={() => console.log("click 1")}>
            <div
              className="profileElements"
              style={{ display: "flex", alignItems: "center", gap: "10px" }}
            >
              <div
                className="imageBlock"
                style={{ height: "45px", width: "50px" }}
              >
                <img
                  src="/images/man.png"
                  alt=""
                  style={{ width: "100%", height: "100%" }}
                />
              </div>
              <div className="usernameBlock">ivv.kr</div>
            </div>
          </div>
          <div className="profileBlock">
            <div
              className="profileElements"
              style={{ display: "flex", alignItems: "center", gap: "10px" }}
            >
              <div
                className="imageBlock"
                style={{ height: "45px", width: "50px" }}
              >
                <img
                  src="/images/man.png"
                  alt=""
                  style={{ width: "100%", height: "100%" }}
                />
              </div>
              <div className="usernameBlock">ivv.kr</div>
            </div>
          </div>
          <div className="profileBlock">
            <div
              className="profileElements"
              style={{ display: "flex", alignItems: "center", gap: "10px" }}
            >
              <div
                className="imageBlock"
                style={{ height: "45px", width: "50px" }}
              >
                <img
                  src="/images/man.png"
                  alt=""
                  style={{ width: "100%", height: "100%" }}
                />
              </div>
              <div className="usernameBlock">ivv.kr</div>
            </div>
          </div>
          <div className="profileBlock">
            <div
              className="profileElements"
              style={{ display: "flex", alignItems: "center", gap: "10px" }}
            >
              <div
                className="imageBlock"
                style={{ height: "45px", width: "50px" }}
              >
                <img
                  src="/images/man.png"
                  alt=""
                  style={{ width: "100%", height: "100%" }}
                />
              </div>
              <div className="usernameBlock">ivv.kr</div>
            </div>
          </div>
          <div className="profileBlock">
            <div
              className="profileElements"
              style={{ display: "flex", alignItems: "center", gap: "10px" }}
            >
              <div
                className="imageBlock"
                style={{ height: "45px", width: "50px" }}
              >
                <img
                  src="/images/man.png"
                  alt=""
                  style={{ width: "100%", height: "100%" }}
                />
              </div>
              <div className="usernameBlock">ivv.kr</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChooseConversationPopup;
