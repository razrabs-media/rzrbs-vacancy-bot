import { Markup } from "telegraf";
import { ActionButtonLabels, BotActions } from "../../constants/actions";

const MOCK_TEXT = `
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
`;

export const sendMessagePreview = async (
  ctx,
  messageText: string = MOCK_TEXT
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

  await ctx.telegram.sendMessage(
    ctx.message.chat.id,
    messageText,
    replyMarkupButtons
  );
};
