import Vacancy from "../../schemas/vacancy";
import { handleLogging } from "../logger";

export const onVacancyCancel = async (ctx) => {
  const { message_id, chat } = ctx?.update?.callback_query?.message || {};
  const { username } = chat || {};
  const { logInfo, logError } = handleLogging(
    "sendVacancyTemplateMessage",
    { fromUsername: username, chatId: chat?.id, messageId: message_id },
    `Failed to cancel vacancy`
  );

  try {
    if (!message_id || !chat?.id || !chat?.username) {
      throw Error("cannot retrieve message_id, chat.id or chat.username");
    }

    const vacancy = await Vacancy.findOne({
      where: {
        tg_message_id: message_id,
        tg_chat_id: chat.id,
        author_username: chat.username,
      },
    });

    if (!vacancy) {
      throw Error(`Vacancy from was not found`);
    }

    vacancy.set({
      removed: true,
    });

    await vacancy.save();
    logInfo(`Vacancy ${vacancy.id} marked as removed`);

    // removes buttons
    await ctx.editMessageReplyMarkup(undefined);
    await ctx.deleteMessage();
  } catch (err) {
    logError(err);
    // FIXME: feedback?
  }
};
