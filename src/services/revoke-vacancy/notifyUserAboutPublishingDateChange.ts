import bot from "../../launchBot";
import VacancyModel from "../../schemas/vacancy";
import { getVacancyWillBePublishedText } from "../../utils/getVacancyWillBePublishedText";
import {
  countNextAvailableTimeslotToPublish,
  getPublishQueueItems,
} from "../publish-queue";

export const notifyUsersAboutPublishingDateChange = async () => {
  const publishQueueItems = await getPublishQueueItems();

  publishQueueItems.forEach(async (publishQueueItem, publishQueueItemIndex) => {
    const vacancy = await VacancyModel.findOne({
      where: {
        id: publishQueueItem.vacancy_id,
      },
    });

    if (!vacancy) {
      return;
    }

    const nextTimeslotToPublish = await countNextAvailableTimeslotToPublish({
      publishQueueLength: publishQueueItemIndex + 1,
    });

    // sends message with new publish date only if it's different from previous expected_publish_date
    if (
      vacancy.expected_publish_date &&
      new Date(vacancy.expected_publish_date).getTime() >
        nextTimeslotToPublish.getTime()
    ) {
      await bot.telegram.sendMessage(
        vacancy.tg_chat_id,
        getVacancyWillBePublishedText(nextTimeslotToPublish),
        {
          reply_to_message_id: vacancy.tg_message_id,
        }
      );

      await vacancy.set({ expected_publish_date: nextTimeslotToPublish });
      await vacancy.save();
    }
  });
};
