import { onVacancyEdit } from "../edit-vacancy";
import { handleLogging } from "../logger";

const getEditedMessageInfo = (
  text: string,
  botUsername: string
): {
  messageId?: string;
  updatedVacancyText?: string;
  isEditedExistingVacancy: boolean;
} => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [techInfoLine, disclaimerLine, gapLine, ...updatedVacancyText] =
    text?.split("\n") || [];
  const [, messageId] = techInfoLine?.split(" > ") || [];

  return {
    messageId,
    updatedVacancyText: updatedVacancyText?.join("\n"),
    isEditedExistingVacancy: techInfoLine?.startsWith(`@${botUsername}`),
  };
};

export const processEditingExistingVacancy = async (ctx) => {
  const { from, chat, text } = ctx?.update?.message || {};
  const { messageId, updatedVacancyText, isEditedExistingVacancy } =
    getEditedMessageInfo(text, ctx?.botInfo?.username);
  const { logInfo } = handleLogging("processEditingExistingVacancy", {
    fromUsername: from?.username,
    chatId: chat?.id,
    messageId: Number(messageId),
  });

  logInfo(`Started processing editing message`);

  if (isEditedExistingVacancy && updatedVacancyText && messageId) {
    await onVacancyEdit(ctx, {
      messageId: Number(messageId),
      updatedText: updatedVacancyText,
    });
  }
};
