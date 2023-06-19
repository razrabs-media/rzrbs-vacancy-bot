import { Telegraf } from "telegraf";

import { IContact } from "../../types/bot_contact";
import { BotContext } from "../../types/context";
import { IVacancy } from "../../types/vacancy";
import logger from "../logger";
import { IPublishQueueItem } from "../../types/publish_queue";
import VacancyModel from "../../schemas/vacancy";
import config from "../../utils/config";
import { wait } from "../../utils/wait";
import { buildMessageFromVacancy } from "../../utils/buildMessageFromVacancy";

const sendToContact = async (
  vacancy: IVacancy,
  { chat_id, chat_title, chat_type }: IContact,
  bot: Telegraf<BotContext>
) => {
  try {
    logger.info(
      `Sending ${vacancy.id} vacancy to ${chat_title}::${chat_type}::${chat_id}...`
    );

    const message = await bot.telegram?.sendMessage(
      chat_id,
      buildMessageFromVacancy(vacancy),
      {
        parse_mode: "HTML",
      }
    );

    if (!message) {
      throw Error(`failed to send message`);
    }

    const vacancyInstance = await VacancyModel.findOne({
      where: {
        id: vacancy.id,
      },
    });

    if (!vacancyInstance) {
      throw Error("failed to mark vacancy as published in DB");
    }

    await vacancyInstance.set({
      published: true,
      publishedAt: new Date(message.date * 1000),
      published_tg_chat_id: [
        ...(vacancyInstance.published_tg_chat_id || []),
        String(message.chat.id),
      ],
      published_tg_message_id: [
        ...(vacancyInstance.published_tg_message_id || []),
        String(message.message_id),
      ],
    });

    await vacancyInstance.save();
    logger.info(
      `Success: ${vacancy.id} vacancy sent to ${chat_title}::${chat_type}::${chat_id}`
    );
  } catch (err) {
    logger.error(
      `Failed to publish ${vacancy.id} vacancy to ${chat_title}::${chat_type}::${chat_id} - ${err}`
    );
  }
};

export const publishVacancyToChannel = async (
  publishQueueItem: IPublishQueueItem,
  contacts: IContact[],
  bot: Telegraf<BotContext>
) => {
  try {
    const vacancy = await VacancyModel.findOne({
      where: {
        id: publishQueueItem.vacancy_id,
      },
    });

    if (!vacancy) {
      throw Error("vacancy not found");
    }

    const whitelistedContacts = contacts.filter(({ chat_id }) =>
      config.botContactsWhitelist.includes(chat_id)
    );
    for (const contact of whitelistedContacts) {
      await sendToContact(vacancy, contact, bot);
    }

    // waits MINUTES_BETWEEN_PUBLISHING minutes
    await wait(config.minsBetweenPublishing * 60 * 1000);
  } catch (err) {
    logger.error(
      `Failed to publish ${publishQueueItem.vacancy_id} vacancy - ${err}`
    );
  }
};
