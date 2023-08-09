export const PUBLISH_QUEUE_ERROR = "PUBLISH_QUEUE_ERROR";

export default class PublishQueueError extends Error {
  constructor(message) {
    super(message);

    this.name = PUBLISH_QUEUE_ERROR;
    this.message = message;
  }
}
