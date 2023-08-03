import { onVacancyEdit } from "../edit-vacancy";

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
  const { messageId, updatedVacancyText, isEditedExistingVacancy } =
    getEditedMessageInfo(ctx?.update?.message?.text, ctx?.botInfo?.username);

  if (isEditedExistingVacancy && updatedVacancyText && messageId) {
    await onVacancyEdit(ctx, {
      messageId: Number(messageId),
      updatedText: updatedVacancyText,
    });
  }
};
