export const clearDailyPublishInterval = () => {
  if (global.__app_dailyPublishInterval) {
    clearInterval(global.__app_dailyPublishInterval);
    setDailyPublishInterval(undefined);
  }
};

export const setDailyPublishInterval = (
  newPublishInterval: NodeJS.Timer | number | undefined
) => {
  global.__app_dailyPublishInterval = newPublishInterval;
};

export const clearPublishQueueMonitoringInterval = () => {
  if (global.__app_publishQueueMonitoringInterval) {
    clearInterval(global.__app_publishQueueMonitoringInterval);
    setPublishQueueMonitoringInterval(undefined);
  }
};

export const setPublishQueueMonitoringInterval = (
  newPublishQueueMonitoringInterval: NodeJS.Timer | number | undefined
) => {
  global.__app_publishQueueMonitoringInterval =
    newPublishQueueMonitoringInterval;
};
