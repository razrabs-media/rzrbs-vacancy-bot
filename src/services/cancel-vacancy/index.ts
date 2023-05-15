export const onVacancyCancel = (ctx) => {
  ctx.editMessageReplyMarkup(undefined); // removes buttons
  ctx.deleteMessage();
};
