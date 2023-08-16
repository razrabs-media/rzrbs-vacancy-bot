import VacancyModel from "../schemas/vacancy";
import config from "./config";
import { getRoundDate } from "./getRoundDate";

export const isPublishingAllowedForCompany = async (
  telegramUsername: string,
  companyName: string
): Promise<boolean> => {
  if (!telegramUsername) {
    throw Error(`isPublishingAllowedForCompany: telegramUsername is required`);
  }

  if (!companyName) {
    throw Error(`isPublishingAllowedForCompany: companyName is required`);
  }

  const today = new Date();
  const firstDayOfMonth = getRoundDate({ day: 1 });

  const { count: vacanciesPublishedByUserAmount } =
    await VacancyModel.findAndCountAll({
      where: {
        published: true,
        removed: false,
        revoked: false,
        author_username: telegramUsername,
        company_name: companyName,
        publishedAt: {
          // greater than
          $gt: firstDayOfMonth,
          // less than
          $lt: today,
        },
      },
      order: [["publishedAt", "ASC"]],
    });

  return (
    vacanciesPublishedByUserAmount <
    config.publishConfig.companyMonthVacancyLimit
  );
};
