import { SUPPORTED_MSG_ENTITIES } from "../constants/common";
import { TelegramMessageEntity } from "../types/telegram";

export const filterSupportedTelegramEntities = (
  entities: TelegramMessageEntity[]
) => entities.filter(({ type }) => SUPPORTED_MSG_ENTITIES.includes(type));
