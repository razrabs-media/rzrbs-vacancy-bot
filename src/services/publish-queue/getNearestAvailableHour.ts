/**
 * Counts current day timeslots to publish vacancies by configured schedule,
 * returns the nearest hour
 *
 * @param currentHour {number} - current hour
 * @param currentDay [number, number] - current day config in format [from: number, to: number]
 * @param publishInterval {number} - current publishing interval
 * @returns {number} - the nearest hour in schedule to publish vacancy
 */
export const getNearestAvailableHour = (
  currentHour: number,
  currentDay: [number, number],
  publishInterval: number
): number => {
  const [from, to] = currentDay;
  let nearestAvailableHour = from;

  while (nearestAvailableHour <= currentHour && nearestAvailableHour <= to) {
    nearestAvailableHour += publishInterval;
  }
  return nearestAvailableHour;
};
