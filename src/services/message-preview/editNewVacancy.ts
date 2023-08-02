import VacancyModel from "../../schemas/vacancy";
import { TVacancyCreationAttributes } from "../../types/vacancy";
import logger from "../logger";
import { createNewVacancy } from "./createNewVacancy";

export const editNewVacancy = async ({
  vacancy,
  messageId,
  chatId,
  fromUsername,
}: {
  vacancy: TVacancyCreationAttributes;
  messageId: number;
  chatId: number;
  fromUsername: string;
}) => {
  try {
    if (!chatId || !messageId || !fromUsername) {
      throw Error(`cannot retrieve required info`);
    }

    const existingVacancy = await VacancyModel.findOne({
      where: {
        author_username: fromUsername,
        tg_chat_id: chatId,
        tg_message_id: messageId,
      },
    });

    if (!existingVacancy) {
      logger.info(
        `vacancy for ${messageId}::${chatId}::${fromUsername} doesn't exist, creating the new one`
      );
      await createNewVacancy({ vacancy, messageId, chatId });
      return;
    }

    const newVacancy = await VacancyModel.create(vacancy, {
      isNewRecord: true,
    });

    if (!newVacancy) {
      throw Error("creation failed on DB side");
    }

    logger.info(
      `Vacancy from message ${messageId}::${chatId} succesfully updated - ${newVacancy.id}`
    );
  } catch (err) {
    logger.error(
      `Failed to update vacancy from message ${messageId}::${chatId}::${fromUsername} - ${
        (err as Error)?.message || JSON.stringify(err)
      }`
    );
  }
};
