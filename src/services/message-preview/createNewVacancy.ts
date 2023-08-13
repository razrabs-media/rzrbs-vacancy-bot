import VacancyModel from "../../schemas/vacancy";
import { TVacancyCreationAttributes } from "../../types/vacancy";
import { handleLogging } from "../logger";

export const createNewVacancy = async ({
  vacancy,
  messageId,
  chatId,
}: {
  vacancy: TVacancyCreationAttributes;
  messageId: number;
  chatId: number;
}) => {
  const { logInfo, logError } = handleLogging(
    "createNewVacancy",
    { fromUsername: vacancy?.author_username, chatId, messageId },
    "Failed to create vacancy"
  );

  try {
    const newVacancy = await VacancyModel.create(vacancy, {
      isNewRecord: true,
    });

    if (!newVacancy) {
      throw Error("creation failed on DB side");
    }

    logInfo(`Vacancy succesfully created - ${newVacancy.id}`);
  } catch (err) {
    logError(err);

    // removes vacancy from DB if it was created, but process finished by error
    const newVacancyToRemove = await VacancyModel.findOne({
      where: {
        tg_message_id: messageId,
        tg_chat_id: chatId,
      },
    });
    if (newVacancyToRemove) {
      logError(`vacancy was created in DB, removing it`);
      await newVacancyToRemove.destroy();
    }

    throw err;
  }
};
