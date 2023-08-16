import { getVacancyWillBePublishedText } from "../getVacancyWillBePublishedText";

describe("getVacancyWillBePublishedText", () => {
  it("should return string with date", () => {
    const mockDate = new Date(1466424490000);
    const result = getVacancyWillBePublishedText(mockDate);
    expect(
      // macos system result
      result === "Вакансия будет опубликована: 20 июня 2016 г. в 15:08" ||
        // github ci result (ubuntu-latest)
        result === "Вакансия будет опубликована: 20 июня 2016 г., 15:08"
    ).toBe(true);
  });
});
