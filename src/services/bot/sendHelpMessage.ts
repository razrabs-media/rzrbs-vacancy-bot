import { helpMessageText } from "../../constants/messages";
import logger from "../logger";

export const sendHelpMessage = async (ctx) => {
  try {
    const { username } = ctx?.update?.message?.chat || {};

    logger.info(`User @${username} requests for help`);

    await ctx.reply(helpMessageText, { parse_mode: "HTML" });

    logger.info(`Help message successfully sent to @${username}`);
  } catch (err) {
    logger.error(
      `Failed to send message with help info - ${
        (err as Error)?.message || JSON.stringify(err)
      }`
    );
  }
};
