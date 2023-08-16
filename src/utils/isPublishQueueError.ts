import { PUBLISH_QUEUE_ERROR } from "../constants/errors";

export const isPublishQueueError = (error: unknown): boolean =>
  (error as Error)?.name === PUBLISH_QUEUE_ERROR;
