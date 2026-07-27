export function getNpcAge (birthDateString) { 
    // ISO string to Date object
    const birthDate = new Date(birthDateString);
    
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();

    const hasHadBirthdayThisYear = today.getMonth() < birthDate.getMonth() ||
                                  (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());

    if (hasHadBirthdayThisYear) age--;
    
    return age;
}