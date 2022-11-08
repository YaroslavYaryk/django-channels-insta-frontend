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
  images: string[];
  likes: MessageLike[];
  parent: string;
}
