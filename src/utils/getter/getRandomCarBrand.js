import { carBrands } from "../../data/carBrands";
import { faker } from "@faker-js/faker";

// ---> Handling car brands
const brands = Object.keys(carBrands)
export default function getRandomCarBrand(exclude = null) {
    const carBrand = exclude ? brands.filter(brand => brand !== exclude) : brands;
    return faker.helpers.arrayElement(carBrand);
}