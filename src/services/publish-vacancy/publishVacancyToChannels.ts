import { VACANCY_IS_PUBLISHED } from "../../constants/labels";
import bot from "../../launchBot";
import VacancyModel from "../../schemas/vacancy";
import { IPublishQueueModel } from "../../types/publish_queue";
import config from "../../utils/config";
import { handleLogging } from "../logger";
import { sendVacancyToContact } from "./sendVacancyToContact";

export const publishVacancyToChannels = async (
  publishQueueItem: IPublishQueueModel
) => {
  const { logError } = handleLogging(
    "publishVacancyToChannels",
    undefined,
    `Failed to publish ${publishQueueItem?.vacancy_id} vacancy`
  );
  try {
    if (!publishQueueItem) {
      throw Error("publishQueueItem is empty");
    }

    const vacancy = await VacancyModel.findOne({
      where: {
        id: publishQueueItem.vacancy_id,
      },
    });

    if (!vacancy) {
      throw Error("vacancy not found");
    }

    if (!config.botContactsList.length) {
      throw Error("contact list is empty");
    }

    for (const contactId of config.botContactsList) {
      await sendVacancyToContact(vacancy, contactId);
    }

    await publishQueueItem.set({
      published: true,
    });
    await publishQueueItem.save();

    await bot.telegram.sendMessage(vacancy.tg_chat_id, VACANCY_IS_PUBLISHED, {
      reply_to_message_id: vacancy.tg_message_id,
    });
  } catch (err) {
    logError(err);
  }
};
