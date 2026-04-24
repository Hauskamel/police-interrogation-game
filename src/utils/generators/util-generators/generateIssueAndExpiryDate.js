import { faker } from "@faker-js/faker";

export function generateIssueAndExpiryDate (birthdate) {
    const date = new Date(birthdate);
    date.setFullYear(date.getFullYear() + 18);
    const minIssueDate = date.toISOString().split('T')[0];

    const today = new Date().toJSON().slice(0, 10);
    const maxIssueDate = today;


    console.log("birthday: " + birthdate)
    console.log("from: " + minIssueDate);

    console.log("to: " + maxIssueDate);



    const issueDate = faker.date.between({ from: minIssueDate, to: maxIssueDate });
    

    const formattedIssueDate = issueDate.toISOString().split('T')[0];

    const vDate = new Date(formattedIssueDate); // validation date -- copy of original birthdate
    vDate.setFullYear(vDate.getFullYear() + 15); // license valid for 15 years
    const formattedExpiryDate = vDate.toISOString().split('T')[0];

    const documentDates = {
        formattedIssueDate,
        formattedExpiryDate
    }
    return  documentDates
}