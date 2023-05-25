import PublishQueueItemModel from "../../schemas/publish_queue";
import VacancyModel from "../../schemas/vacancy";
import logger from "../logger";
import { updateButtonsUnderMessage } from "./updateButtonsUnderMessage";

export const onPublishVacancy = async (ctx) => {
  try {
    if (!ctx.update.callback_query.message) {
      logger.error("Publish: Failed to get vacancy info from message");
      return;
    }

    logger.info(ctx.update.callback_query);

    const { message_id, chat } = ctx.update.callback_query.message;

    const vacancy = await VacancyModel.findOne({
      tg_message_id: message_id,
      tg_chat_id: chat.id,
    });

    if (!vacancy) {
      logger.error(
        `Publish: Failed to fetch vacancy in DB for message ${message_id}`
      );
      return;
    }

    const newQueueItem = await PublishQueueItemModel.create({
      vacancy,
      // TODO: add custom time
      time_to_publish: Date.now(),
    });

    if (!newQueueItem) {
      logger.error(
        `Publish: Failed to add vacancy ${vacancy._id} to publish queue`
      );
      return;
    }

    logger.info(
      `Publish: vacancy ${vacancy._id} successfully added to publish queue`
    );

    await updateButtonsUnderMessage(ctx);
  } catch (err) {
    logger.error(
      `Publish: Failed to add vacancy to publish queue - ${JSON.stringify(err)}`
    );
  }
};
