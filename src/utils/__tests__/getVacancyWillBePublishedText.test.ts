import { getVacancyWillBePublishedText } from "../getVacancyWillBePublishedText";

describe("getVacancyWillBePublishedText", () => {
  it("should return string with date", () => {
    const mockDate = new Date(1466424490000);
    expect(getVacancyWillBePublishedText(mockDate)).toBe(
      "Вакансия будет опубликована примерно: 20 июня 2016 г. в 15:08"
    );
  });
});
