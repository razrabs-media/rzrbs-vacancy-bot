export enum BotActions {
  EditMessage = "edit",
  RevokeVacancy = "revoke",
  PublishVacancy = "publish",
  CancelVacancy = "cancel",
}

export const ActionButtonLabels: Record<BotActions, string> = {
  [BotActions.EditMessage]: "Редактировать",
  [BotActions.PublishVacancy]: "Опубликовать",
  [BotActions.RevokeVacancy]: "Отозвать вакансию",
  [BotActions.CancelVacancy]: "Отменить",
};
