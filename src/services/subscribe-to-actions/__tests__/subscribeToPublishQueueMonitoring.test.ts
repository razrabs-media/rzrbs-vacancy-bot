import config from "../../../utils/config";
import * as GetCurrentHoursModule from "../../../utils/time";
import * as WaitModule from "../../../utils/wait";
import logger from "../../logger";
import * as MonitorPublishQueueByTimerModule from "../../publish-queue/monitorPublishQueueByTimer";
import { subscribeToPublishQueueMonitoring } from "../subscribeToPublishQueueMonitoring";

jest.mock("../../logger");

const waitSpy = jest.spyOn(WaitModule, "wait").mockResolvedValue();
const monitorPublishQueueByTimerSpy = jest.spyOn(
  MonitorPublishQueueByTimerModule,
  "monitorPublishQueueByTimer"
);

const getCurrentMinutesSpy = jest
  .spyOn(GetCurrentHoursModule, "getCurrentMinutes")
  .mockReturnValue(0);

const setIntervalSpy = jest
  .spyOn(global, "setInterval")
  .mockImplementation((cb, ms) => ms as unknown as NodeJS.Timer);

describe("subscribeToPublishQueueMonitoring", () => {
  it.each([0, null, undefined])(
    "should throw an exception if publishInterval is %s",
    async (publishIntervalValue) => {
      config.publishConfig.publishInterval = publishIntervalValue as number;

      let error;
      try {
        await subscribeToPublishQueueMonitoring();
      } catch (err) {
        error = err;
      }
      expect(error?.message).toBe(
        "ERROR: Publish queue won't work until PUBLISH_INTERVAL is set"
      );
      expect(monitorPublishQueueByTimerSpy).toHaveBeenCalledTimes(0);
      expect(setIntervalSpy).toHaveBeenCalledTimes(0);
    }
  );

  it("should wait for next round hour for initial execution and then run publish monitoring", async () => {
    config.publishConfig.publishInterval = 2;
    getCurrentMinutesSpy.mockReturnValueOnce(10);

    await subscribeToPublishQueueMonitoring();

    expect(logger.info).toHaveBeenCalledWith(
      "Waiting 50mins before starting to monitor publish queue"
    );
    expect(waitSpy).toHaveBeenCalledWith(50 * 60 * 1000);
    expect(logger.info).toHaveBeenCalledWith(
      "Subscribed to check publish queue by timer"
    );
    expect(monitorPublishQueueByTimerSpy).toHaveBeenCalledWith({
      initialExecution: true,
    });
    expect(setIntervalSpy).toHaveBeenCalledWith(
      monitorPublishQueueByTimerSpy,
      1 * 60 * 60 * 1000
    );
  });

  it("should run initial publish monitoring and subscribe for next hours", async () => {
    config.publishConfig.publishInterval = 2;

    await subscribeToPublishQueueMonitoring();

    expect(logger.info).toHaveBeenCalledWith(
      "Subscribed to check publish queue by timer"
    );
    expect(waitSpy).toHaveBeenCalledTimes(0);
    expect(monitorPublishQueueByTimerSpy).toHaveBeenCalledWith({
      initialExecution: true,
    });
    expect(setIntervalSpy).toHaveBeenCalledWith(
      monitorPublishQueueByTimerSpy,
      1 * 60 * 60 * 1000
    );
  });
});
