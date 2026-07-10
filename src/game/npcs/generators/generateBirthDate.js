import { faker } from "@faker-js/faker";

export function generateBirthDate () {
  const startYear = 1945;
  const currentYear = new Date().getFullYear();
  const endYear = currentYear - 16;

  const birthday = faker.date.between({
    from: `${startYear}-01-01`,
    to: `${endYear}-01-01`
  }).toISOString().split('T')[0];

  return birthday
}