import PublishQueueItemModel from "../../schemas/publish_queue";
import VacancyModel from "../../schemas/vacancy";
import { updateButtonsUnderMessage } from "./updateButtonsUnderMessage";

export const onPublishVacancy = async (ctx) => {
  try {
    if (!ctx.update.callback_query.message) {
      console.error("Publish: Failed to get vacancy info from message");
      return;
    }

    const { message_id } = ctx.update.callback_query.message;

    const vacancy = await VacancyModel.findOne({ tg_message_id: message_id });

    if (!vacancy) {
      console.error(
        `Publish: Failed to fetch vacancy in DB for message ${message_id}`
      );
      return;
    }

    const newQueueItem = await PublishQueueItemModel.create({
      vacancy,
      time_to_publish: Date.now(),
    });

    if (!newQueueItem) {
      console.error(
        `Publish: Failed to add vacancy ${vacancy._id} to publish queue`
      );
      return;
    }

    console.log(
      `Publish: vacancy ${vacancy._id} successfully added to publish queue`
    );

    await updateButtonsUnderMessage(ctx);
  } catch (err) {
    console.error(
      `Publish: Failed to add vacancy to publish queue - ${JSON.stringify(err)}`
    );
  }
};
