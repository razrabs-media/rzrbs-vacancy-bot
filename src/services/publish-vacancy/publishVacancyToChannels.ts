import VacancyModel from "../../schemas/vacancy";
import { IPublishQueueModel } from "../../types/publish_queue";
import config from "../../utils/config";
import logger from "../logger";
import { sendVacancyToContact } from "./sendVacancyToContact";

export const publishVacancyToChannels = async (
  publishQueueItem: IPublishQueueModel
) => {
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
  } catch (err) {
    logger.error(
      `Failed to publish ${publishQueueItem?.vacancy_id} vacancy - ${err}`
    );
  }
};
