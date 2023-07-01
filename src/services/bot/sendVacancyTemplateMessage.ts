import { vacancyTemplateHTMLMessageText } from "../../constants/messages";
import logger from "../logger";

export const sendVacancyTemplateMessage = async (ctx) => {
  try {
    const { username } = ctx?.update?.message?.chat || {};

    logger.info(`User @${username} requests for template`);

    await ctx.reply(vacancyTemplateHTMLMessageText, { parse_mode: "HTML" });

    logger.info(`Vacancy template successfully sent to @${username}`);
  } catch (err) {
    logger.error(
      `Failed to send message with vacancy template - ${
        (err as Error)?.message || JSON.stringify(err)
      }`
    );
  }
};
