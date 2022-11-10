import React, { useRef, RefObject, createRef } from "react";
import { UserModel } from "./User";
import { MessageLike } from "./MessageLike";

export interface MessageModel {
  id: string;
  room: string;
  from_user: UserModel;
  to_user: UserModel;
  content: string;
  timestamp: string;
  read: boolean;
  edited: boolean;
  forwarded: boolean;
  images: string[];
  likes: MessageLike[];
  parent: string;
  ref: RefObject<HTMLDivElement>;
  scroll: boolean;
}
