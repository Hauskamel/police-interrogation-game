import { getCurrentGameDate } from "@game/shared";

export function getNpcAge (birthDateString) {
    // ISO string to Date object
    const birthDate = new Date(birthDateString);
    
    const today = getCurrentGameDate();

    let age = today.getFullYear() - birthDate.getFullYear();

    const hasNotHadBirthdayThisYear = today.getUTCMonth() < birthDate.getUTCMonth()
        || (
            today.getUTCMonth() === birthDate.getUTCMonth()
            && today.getUTCDate() < birthDate.getUTCDate()
        );

    if (hasNotHadBirthdayThisYear) age--;
    
    return age;
}
