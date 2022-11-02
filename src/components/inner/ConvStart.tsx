import React from "react";

type Props = {
  children: JSX.Element;
};

export const ConvStart = ({ children }: Props) => {
  return (
    <div
      className="startMessage"
      style={{
        // width: "69%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {children}
    </div>
  );
};
