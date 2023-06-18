import { DataTypes, Model } from "sequelize";
import db from "../connectToDatabase";
import { IPublishQueueItem } from "../types/publish_queue";

export const PublishQueueItemModel = db.define<
  Model<
    IPublishQueueItem,
    Omit<IPublishQueueItem, "id" | "removed" | "published">
  >
>(
  "PublishQueue",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    time_to_publish: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: { notEmpty: true },
    },
    vacancy_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { notEmpty: true },
    },
    removed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
      validate: { notEmpty: true },
    },
    published: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
      validate: { notEmpty: true },
    },
    tg_group_message_link: DataTypes.STRING,
  },
  {
    timestamps: true,
    indexes: [{ unique: true, fields: ["vacancy_id"] }],
  }
);

export default PublishQueueItemModel;
