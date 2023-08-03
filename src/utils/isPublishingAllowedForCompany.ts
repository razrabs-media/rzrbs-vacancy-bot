import VacancyModel from "../schemas/vacancy";
import config from "./config";

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
        company_name: companyName,
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
    vacanciesPublishedByUserAmount <
    config.publishConfig.companyMonthVacancyLimit
  );
};
