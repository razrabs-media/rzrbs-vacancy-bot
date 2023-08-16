import { MessageEntityType } from "../constants/messages";
import { TelegramMessageEntity } from "../types/telegram";
import { filterSupportedTelegramEntities } from "./filterSupportedTelegramEntities";

export interface IParsedMessageEntity {
  word: string;
  value: string;
  entity_type: MessageEntityType;
}

export const parseMessageEntities = (
  messageText: string,
  entities: TelegramMessageEntity[]
): IParsedMessageEntity[] => {
  return filterSupportedTelegramEntities(entities).reduce(
    (acc, { url, offset, length, type }) => [
      ...acc,
      {
        word: messageText
          .slice(offset, offset + length)
          .trim()
          .replace("\n", ""),
        value: url || "",
        entity_type: type,
      },
    ],
    [] as IParsedMessageEntity[]
  );
};
