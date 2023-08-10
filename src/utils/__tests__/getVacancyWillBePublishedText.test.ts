import { getVacancyWillBePublishedText } from "../getVacancyWillBePublishedText";

describe("getVacancyWillBePublishedText", () => {
  it("should return string with date", () => {
    const mockDate = new Date(1466424490000);
    expect(getVacancyWillBePublishedText(mockDate)).toBe(
      "Вакансия будет опубликована примерно: 6/20/2016, 2:08:10 PM"
    );
  });
});
