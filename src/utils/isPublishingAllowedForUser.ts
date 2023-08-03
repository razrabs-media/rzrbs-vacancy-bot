import VacancyModel from "../schemas/vacancy";
import config from "./config";

export const isPublishingAllowedForUser = async (
  telegramUsername: string
): Promise<boolean> => {
  if (!telegramUsername) {
    throw Error(`isPublishingAllowedForUser: telegramUsername is required`);
  }

  // FIXME: check from first to last day of month, NOT 30 last days
  const today = new Date();
  const dayOneMonthAgo = new Date(today.setMonth(today.getMonth() - 1));

  const { count: vacanciesPublishedByUserAmount } =
    await VacancyModel.findAndCountAll({
      where: {
        published: true,
        removed: false,
        revoked: false,
        author_username: telegramUsername,
        publishedAt: {
          // greater than
          $gt: dayOneMonthAgo,
          // less than
          $lt: new Date(),
        },
      },
      order: [["publishedAt", "ASC"]],
    });

  return (
    vacanciesPublishedByUserAmount < config.publishConfig.userMonthVacancyLimit
  );
};
