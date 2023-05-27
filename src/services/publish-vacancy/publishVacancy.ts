import PublishQueueItemModel from "../../schemas/publish_queue";
import VacancyModel from "../../schemas/vacancy";
import logger from "../logger";
import { updateButtonsUnderMessage } from "./updateButtonsUnderMessage";

export const onPublishVacancy = async (ctx) => {
  const { message_id, chat } = ctx?.update?.callback_query?.message || {};

  try {
    if (!message_id || !chat?.id || !chat?.username) {
      throw Error("Failed to get vacancy info from message");
    }

    const vacancy = await VacancyModel.findOne({
      tg_message_id: message_id,
      tg_chat_id: chat?.id,
      "author.username": chat?.username,
    });

    if (!vacancy) {
      throw Error("vacancy not found");
    }

    const newQueueItem = await PublishQueueItemModel.create({
      vacancy,
      // TODO: add custom time
      time_to_publish: Date.now(),
    });

    if (!newQueueItem) {
      throw Error(`Failed to add vacancy ${vacancy._id} to publish queue`);
    }

    logger.info(
      `Publish: vacancy ${vacancy._id} successfully added to publish queue`
    );

    await updateButtonsUnderMessage(ctx);
  } catch (err) {
    logger.error(
      `Publish: Failed to add vacancy ${chat?.username}::${
        chat?.id
      }::${message_id} to publish queue - ${
        (err as Error).message || JSON.stringify(err)
      }`
    );
  }
};
