import VacancyModel from "../../schemas/vacancy";
import { IVacancy } from "../../types/vacancy";
import logger from "../logger";

export const createNewVacancy = async ({
  vacancy,
  messageId,
  chatId,
}: {
  vacancy: IVacancy;
  messageId: number;
  chatId: number;
}) => {
  try {
    const newVacancy = await VacancyModel.create(vacancy);

    logger.info(
      `Vacancy from message ${messageId}::${chatId} succesfully created - ${newVacancy._id}`
    );
  } catch (err) {
    logger.error(
      `Failed to create vacancy from message ${messageId}::${chatId} - ${
        (err as Error)?.message || JSON.stringify(err)
      }`
    );
  }
};
