export const onPublishVacancy = (ctx) => {
  ctx.editMessageReplyMarkup(undefined); // removes buttons
  // ctx.editMessageText("You clicked on Publish")
};
