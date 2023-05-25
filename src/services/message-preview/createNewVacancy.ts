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
  const newVacancy = await VacancyModel.create(vacancy);

  logger.info(
    `Vacancy from message ${messageId}::${chatId} succesfully created - ${newVacancy._id}`
  );
};
