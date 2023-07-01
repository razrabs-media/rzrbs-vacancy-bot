import { Model } from "sequelize";

export interface IPublishQueueItem {
  id: number;
  vacancy_id: number;
  removed: boolean;
  published: boolean;
}

// interface is not the same with IPublishQueueItem
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IPublishQueueItemCreationAttributes
  extends Omit<IPublishQueueItem, "id" | "removed" | "published"> {}

export interface IPublishQueueModel
  extends Model<IPublishQueueItem, IPublishQueueItemCreationAttributes>,
    IPublishQueueItem {}
