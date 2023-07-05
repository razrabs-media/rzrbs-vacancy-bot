import { message } from "telegraf/filters";

import bot from "../../launchBot";
import { processIncomingMessage } from "../parse-message/processIncomingMessage";

export const subscribeToTextMessage = () => {
  bot.on(message("text"), processIncomingMessage);
};
