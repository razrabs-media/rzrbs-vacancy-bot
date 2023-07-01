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
