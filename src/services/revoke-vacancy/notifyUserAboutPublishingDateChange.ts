import bot from "../../launchBot";
import VacancyModel from "../../schemas/vacancy";
import { getVacancyWillBePublishedText } from "../../utils/getVacancyWillBePublishedText";
import { countNextAvailableTimeslotToPublish } from "../publish-queue";
import { getPublishQueueItems } from "../publish-queue/getPublishQueueItems";

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

    await bot.telegram.sendMessage(
      vacancy.tg_chat_id,
      // FIXME: store date in DB and notify only on change
      getVacancyWillBePublishedText(
        await countNextAvailableTimeslotToPublish({
          publishQueueLength: publishQueueItemIndex + 1,
        })
      ),
      {
        reply_to_message_id: vacancy.tg_message_id,
      }
    );
  });
};
