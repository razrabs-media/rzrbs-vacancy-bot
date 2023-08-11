import VacancyModel from "../../schemas/vacancy";
import { TelegramMessageParams } from "../../types/telegram";
import { TVacancyCreationAttributes } from "../../types/vacancy";
import { handleLogging } from "../logger";
import { createNewVacancy } from "./createNewVacancy";

export const editNewVacancy = async ({
  vacancy,
  messageId,
  chatId,
  fromUsername,
}: {
  vacancy: TVacancyCreationAttributes;
} & TelegramMessageParams) => {
  const { logInfo, logError } = handleLogging(
    "editNewVacancy",
    { fromUsername, chatId, messageId },
    "Failed to update vacancy"
  );

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
      logInfo(`vacancy doesn't exist, creating the new one`);
      await createNewVacancy({ vacancy, messageId, chatId });
      return;
    }

    const newVacancy = await VacancyModel.create(vacancy, {
      isNewRecord: true,
    });

    if (!newVacancy) {
      throw Error("creation failed on DB side");
    }

    logInfo(`Vacancy succesfully updated - ${newVacancy.id}`);
  } catch (err) {
    logError(err);
  }
};
