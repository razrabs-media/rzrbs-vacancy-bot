import VacancyModel from "../../../schemas/vacancy";
import config from "../../../utils/config";

export const isVacancyPublishingAllowedToday = async () => {
  const startOfADay = new Date().setHours(0);

  const { count: vacanciesPublishedTodayAmount } =
    await VacancyModel.findAndCountAll({
      where: {
        published: true,
        removed: false,
        revoked: false,
        publishedAt: {
          // greater than
          $gt: startOfADay,
          // less than
          $lt: new Date(),
        },
      },
      order: [["publishedAt", "ASC"]],
    });

  return vacanciesPublishedTodayAmount < config.publishConfig.dailyVacancyLimit;
};
