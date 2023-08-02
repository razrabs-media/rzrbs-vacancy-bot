export enum BotActions {
  EditVacancy = "edit",
  RevokeVacancy = "revoke",
  PublishVacancy = "publish",
  CancelVacancy = "cancel",
}

export const ActionButtonLabels: Record<BotActions, string> = {
  [BotActions.EditVacancy]: "Редактировать",
  [BotActions.PublishVacancy]: "Опубликовать",
  [BotActions.RevokeVacancy]: "Отозвать вакансию",
  [BotActions.CancelVacancy]: "Отменить",
};

export enum BotCommands {
  Template = "template",
  Help = "help",
}

export const BotCommandDescription: Record<BotCommands, string> = {
  [BotCommands.Template]: "Показывает шаблон вакансии",
  [BotCommands.Help]: "Как работать с ботом",
};
