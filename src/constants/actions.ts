export enum BotActions {
  EditMessage = "edit",
  DeclineVacancy = "decline",
  PublishVacancy = "publish",
}

export const ActionButtonLabels: Record<BotActions, string> = {
  [BotActions.EditMessage]: "Редактировать",
  [BotActions.PublishVacancy]: "Отправить на публикацию",
  [BotActions.DeclineVacancy]: "Отозвать вакансию",
};
