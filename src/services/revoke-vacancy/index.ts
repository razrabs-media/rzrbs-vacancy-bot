export const onVacancyRevoke = (ctx) => {
  ctx.editMessageReplyMarkup(undefined); // removes buttons
  // ctx.editMessageText("You clicked on Decline")
};
