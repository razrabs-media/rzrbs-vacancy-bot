export const onVacancyDecline = (ctx) => {
  ctx.editMessageReplyMarkup(undefined); // removes buttons
  // ctx.editMessageText("You clicked on Decline")
};
