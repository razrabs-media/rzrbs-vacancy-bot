export const getRoundDate = ({
  hour = 0,
  day,
  daysToAdd,
}: {
  hour?: number;
  day?: number;
  daysToAdd?: number;
}): Date => {
  const date = new Date();

  if (daysToAdd !== undefined) date.setDate(date.getDate() + daysToAdd);
  if (day !== undefined) date.setDate(day);

  date.setHours(hour);
  date.setMinutes(0);
  date.setSeconds(0);
  date.setMilliseconds(0);

  return date;
};
