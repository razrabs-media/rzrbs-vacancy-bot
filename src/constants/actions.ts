export enum BotActions {
  EditVacancy = "edit",
  RevokeVacancy = "revoke",
  PublishVacancy = "publish",
  CancelVacancy = "cancel",
  RetryParsing = "retry_parsing",
}

export const ActionButtonLabels: Record<BotActions, string> = {
  [BotActions.EditVacancy]: "Редактировать",
  [BotActions.PublishVacancy]: "Опубликовать",
  [BotActions.RevokeVacancy]: "Отозвать вакансию",
  [BotActions.CancelVacancy]: "Отменить",
  [BotActions.RetryParsing]: "Попробовать еще раз",
};

export enum BotCommands {
  Template = "template",
}

export const BotCommandDescription: Record<BotCommands, string> = {
  [BotCommands.Template]: "Показывает шаблон вакансии",
};
