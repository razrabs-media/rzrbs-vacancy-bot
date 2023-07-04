declare global {
  // eslint-disable-next-line no-var
  var __app_dailyPublishInterval: NodeJS.Timer | number | undefined;

  // eslint-disable-next-line no-var
  var __app_publishQueueMonitoringInterval: NodeJS.Timer | number | undefined;
}
