import { MessageEntityType } from "../constants/messages";

interface IMessageEntity {
  offset: number;
  length: number;
  type: MessageEntityType;
  url?: string;
}

export interface IParsedMessageEntity {
  word: string;
  value: string;
  entity_type: MessageEntityType;
}

const SUPPORTED_MSG_ENTITIES = [MessageEntityType.TextLink];

export const parseMessageEntities = (
  messageText: string,
  entities: IMessageEntity[]
): IParsedMessageEntity[] => {
  const supportedEntities: IMessageEntity[] = entities.filter(({ type }) =>
    SUPPORTED_MSG_ENTITIES.includes(type)
  );
  return supportedEntities.reduce(
    (acc, { url, offset, length, type }) => [
      ...acc,
      {
        word: messageText.slice(offset, offset + length - 1),
        value: url || "",
        entity_type: type,
      },
    ],
    [] as IParsedMessageEntity[]
  );
};
