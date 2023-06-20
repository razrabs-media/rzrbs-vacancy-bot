import VacancyModel from "../../schemas/vacancy";
import { TVacancyCreationAttributes } from "../../types/vacancy";
import logger from "../logger";

export const createNewVacancy = async ({
  vacancy,
  messageId,
  chatId,
}: {
  vacancy: TVacancyCreationAttributes;
  messageId: number;
  chatId: number;
}) => {
  try {
    const newVacancy = await VacancyModel.create(vacancy, {
      isNewRecord: true,
    });

    if (!newVacancy) {
      throw Error("creation failed on DB side");
    }

    logger.info(
      `Vacancy from message ${messageId}::${chatId} succesfully created - ${newVacancy.id}`
    );
  } catch (err) {
    logger.error(
      `Failed to create vacancy from message ${messageId}::${chatId} - ${
        (err as Error)?.message || JSON.stringify(err)
      }`
    );
  }
};
