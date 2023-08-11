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
  }
};
