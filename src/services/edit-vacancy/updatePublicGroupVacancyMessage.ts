import { IVacancy } from "../../types/vacancy";
import { getParsedVacancyPreviewMsg } from "../message-preview/getParsedVacancyPreviewMsg";

// change message in group
// TODO: https://github.com/openworld-community/rzrbs-vacancy-bot/issues/13
export const updatePublicGroupVacancyMessage = async ({
  ctx,
  vacancy,
}: {
  ctx: any;
  vacancy: IVacancy;
}) => {
  await ctx.telegram.editMessageCaption(
    vacancy.published_tg_chat_id,
    vacancy.published_tg_message_id,
    getParsedVacancyPreviewMsg(vacancy)
  );
};
