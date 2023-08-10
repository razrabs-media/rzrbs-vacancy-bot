import { getVacancyWillBePublishedText } from "../getVacancyWillBePublishedText";

describe("getVacancyWillBePublishedText", () => {
  it("should return string with date", () => {
    const mockDate = new Date(1466424490000);
    const result = getVacancyWillBePublishedText(mockDate);
    expect(
      // unix system result
      result ===
        "Вакансия будет опубликована примерно: 20 июня 2016 г. в 15:08" ||
        // github ci result
        result ===
          "Вакансия будет опубликована примерно: 20 июня 2016 г., 15:08"
    ).toBe(true);
  });
});
