import { DataTypes } from "sequelize";

import db from "../connectToDatabase";
import { IPublishQueueModel } from "../types/publish_queue";

export const PublishQueueItemModel = db.define<IPublishQueueModel>(
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
  },
  {
    timestamps: true,
    indexes: [{ unique: true, fields: ["vacancy_id"] }],
  }
);

export default PublishQueueItemModel;
