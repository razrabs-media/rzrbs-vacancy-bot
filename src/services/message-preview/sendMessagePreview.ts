import { Markup } from "telegraf";
import { ActionButtonLabels, BotActions } from "../../constants/actions";
import { IVacancy } from "../../types/vacancy";
import { EmploymentType, FormatOfWork } from "../../constants/vacancy";
import { getParsedVacancyPreviewMsg } from "./getParsedVacancyPreviewMsg";
import { createNewVacancy } from "./createNewVacancy";

const MOCK_VACANCY: Omit<IVacancy, "tg_message_id"> = {
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
  published: false,
  edited: false,
  revoked: false,
  company: {
    name: "Company of your dreams LLC",
  },
  format_of_work: {
    title: FormatOfWork.Hybrid,
    description: "2 days/week from office",
  },
  contact_info: "@marylorian",
  type_of_employment: EmploymentType.FullTime,
};

export const sendMessagePreview = async (
  ctx,
  parsedVacancy: Omit<IVacancy, "tg_message_id"> = MOCK_VACANCY
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

  try {
    const response = await ctx.replyWithPhoto(
      "https://picsum.photos/200/300/?random", // TODO: remove it
      {
        caption: getParsedVacancyPreviewMsg(parsedVacancy),
        ...replyMarkupButtons,
      }
    );

    if (response.message_id) {
      await createNewVacancy({
        vacancy: { ...parsedVacancy, tg_message_id: response.message_id },
        messageId: response.message_id,
        chatId: response.chat.id,
      });
    } else {
      console.error(
        `Failed to create vacancy from message - ${ctx.update.message_id}. Preview wasn't sent`
      );
    }
  } catch (err) {
    console.error(
      `Failed to create vacancy from message - ${
        ctx.update.message_id
      }. ${JSON.stringify(err)}`
    );
  }
};
