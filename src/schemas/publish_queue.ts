import mongoose from "mongoose";
import { VacancySchema } from "./vacancy";
import { IPublishQueueItem } from "../types/publish_queue";

export const PublishQueueItem = new mongoose.Schema<IPublishQueueItem>(
  {
    time_to_publish: { type: Date, required: true },
    vacancy: { type: VacancySchema, required: true },
    removed: { type: Boolean, default: false, required: true },
    published: { type: Boolean, default: false, required: true },
    tg_group_message_link: String,
  },
  {
    validateBeforeSave: true,
    timestamps: true,
  }
);

const PublishQueueItemModel = mongoose.model<IPublishQueueItem>(
  "PublishQueue",
  PublishQueueItem
);

export default PublishQueueItemModel;
