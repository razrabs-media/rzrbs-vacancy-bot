import VacancyModel from "../schemas/vacancy";
import config from "./config";
import { getRoundDate } from "./getRoundDate";

export const isPublishingAllowedForUser = async (
  telegramUsername: string
): Promise<boolean> => {
  if (!telegramUsername) {
    throw Error(`isPublishingAllowedForUser: telegramUsername is required`);
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
    vacanciesPublishedByUserAmount < config.publishConfig.userMonthVacancyLimit
  );
};
