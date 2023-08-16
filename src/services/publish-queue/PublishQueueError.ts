import { PUBLISH_QUEUE_ERROR } from "../../constants/errors";

export default class PublishQueueError extends Error {
  constructor(message) {
    super(message);

    this.name = PUBLISH_QUEUE_ERROR;
    this.message = message;
  }
}
