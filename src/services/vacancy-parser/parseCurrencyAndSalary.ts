export interface ICurrencyAndSalary {
  currency: string;
  salaryFrom: number;
  salaryTo: number;
}

export const parseCurrencyAndSalary = (part: string): ICurrencyAndSalary => {
  const response = {
    currency: "",
    salaryFrom: 0,
    salaryTo: 0,
  };
  const currency = part.match("/$|€|руб|евро|рублей")?.join("");

  response.currency = currency ? currency : "";

  const salaryFromRegExp = [...part.matchAll(/от \d+ ?\d+/g)].join("");
  const salaryToRegExp = [...part.matchAll(/до \d+ ?\d+/g)].join("");

  let salaryFrom = salaryFromRegExp?.split("от ")[1];
  let salaryTo = salaryToRegExp?.split("до ")[1];

  if (!salaryFrom && !salaryTo) {
    const salary = part.match(/\d+ ?\d+/g)?.join("");

    if (salary) {
      response.salaryFrom = parseInt(salary);
      response.salaryTo = parseInt(salary);
    }
  } else {
    if (salaryFrom && salaryFrom.includes(" "))
      salaryFrom = salaryFrom.split(" ").join("");
    if (salaryTo && salaryTo.includes(" "))
      salaryTo = salaryTo.split(" ").join("");
    response.salaryFrom = salaryFrom ? parseInt(salaryFrom) : 0;
    response.salaryTo = salaryTo ? parseInt(salaryTo) : 0;
  }

  return response;
};
