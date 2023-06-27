import { Markup } from "telegraf";

import { ActionButtonLabels, BotActions } from "../../constants/actions";
import { EmploymentType, FormatOfWork } from "../../constants/vacancy";
import { IVacancyParsed } from "../../types/vacancy";
import { buildMessageFromVacancy } from "../../utils/buildMessageFromVacancy";
import logger from "../logger";
import { createNewVacancy } from "./createNewVacancy";

const MOCK_VACANCY: IVacancyParsed = {
  title: "Mock vacancy title",
  description: `
Lorem ipsum dolor sit amet. Aut itaque inventore quo aspernatur possimus et possimus quidem. 
Ut modi internos et blanditiis asperiores sed galisum rerum.\n\n
Est atque quos eos modi deleniti rem dolor galisum ut assumenda velit cum dignissimos amet. 
Et nihil nihil et accusantium optio et consequatur galisum sit necessitatibus possimus quo 
quia velit cum fuga perferendis. Non iure quia vel ipsum debitis At necessitatibus reprehenderit 
in alias velit? Est autem aperiam eum natus ipsum rem excepturi corporis ab voluptas libero 
ad dolores atque qui minus repellat.\n\n
Aut consequatur molestiae aut veniam inventore nam iusto accusantium ut doloremque aperiam qui 
explicabo dicta. Et impedit omnis qui internos aliquam qui facilis perferendis ut vero quia vel 
doloremque adipisci vel voluptatem amet sit nobis dicta.
  `,
  company_name: "Company of your dreams LLC",
  format_of_work_title: FormatOfWork.Hybrid,
  format_of_work_description: "2 days/week from office",
  contact_info: "@marylorian",
  type_of_employment: EmploymentType.FullTime,
};

export const sendMessagePreview = async (
  ctx,
  parsedVacancy: IVacancyParsed = MOCK_VACANCY
) => {
  const replyMarkupButtons = Markup.inlineKeyboard([
    Markup.button.callback(
      ActionButtonLabels[BotActions.PublishVacancy],
      BotActions.PublishVacancy
    ),
    Markup.button.callback(
      ActionButtonLabels[BotActions.CancelVacancy],
      BotActions.CancelVacancy
    ),
  ]);

  const { message_id, chat, from } = ctx?.update?.message || {};

  try {
    if (!message_id || !chat?.id || !from?.username) {
      throw Error("cannot retrieve message_id, chat.id of from.username");
    }

    const response = await ctx.sendMessage(
      buildMessageFromVacancy(parsedVacancy),
      {
        ...replyMarkupButtons,
      }
    );

    if (!response.message_id) {
      throw Error("preview message sending was failed");
    }

    await createNewVacancy({
      vacancy: {
        ...parsedVacancy,
        author_username: from.username,
        tg_message_id: response.message_id,
        tg_chat_id: response.chat.id,
      },
      messageId: response.message_id,
      chatId: response.chat.id,
    });
  } catch (err) {
    logger.error(
      `Failed to create vacancy from message ${from.username}::${
        chat?.id
      }::${message_id} - ${(err as Error).message || JSON.stringify(err)}`
    );
  }
};
