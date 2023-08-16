import { MessageEntityType } from "../constants/messages";

export interface TelegramMessageEntity {
  offset: number;
  length: number;
  type: MessageEntityType;
  url?: string;
}

export interface TelegramMessageParams {
  messageId: number;
  chatId: number;
  fromUsername: string;
  text?: string;
  entities?: TelegramMessageEntity[];
}
