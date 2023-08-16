import PublishQueueItemModel from "../../schemas/publish_queue";

export const getNearestPublishQueueItem = async () => {
  const [publishQueueItem] = await PublishQueueItemModel.findAll({
    where: {
      published: false,
      removed: false,
    },
    order: [["createdAt", "ASC"]],
    limit: 1,
  });

  return publishQueueItem;
};
