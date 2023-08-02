import { validationFailedMessage } from "../../constants/messages";
import { parseNewVacancyWithAI } from "../ai/parseNewVacancyWithAI";

export const parseMessageToVacancy = async (text: string, ctx) => {
  const parsedMessage = await parseNewVacancyWithAI(text);

  if (!parsedMessage) {
    await ctx.sendMessage(validationFailedMessage);

    throw Error("failed to parse vacancy with AI");
  }

  return parsedMessage;
};
