import VacancyModel from "../../schemas/vacancy";
import { IVacancy } from "../../types/vacancy";

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

  console.info(
    `Vacancy from message ${messageId}::${chatId} succesfully created - ${newVacancy._id}`
  );
};
