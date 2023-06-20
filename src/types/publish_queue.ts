import { IVacancy } from "./vacancy";

export interface IPublishQueueItem {
  time_to_publish: Date;
  id: number;
  vacancy_id: number;
  removed: boolean;
  published: boolean;
  tg_group_message_link?: string;
}
