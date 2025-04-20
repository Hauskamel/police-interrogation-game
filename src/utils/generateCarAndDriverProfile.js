export function generateCarAndDriverProfile () {
    const drunk = Math.random() < .2;

    const profileInformation = {
        drunk,
        high: Math.random() < .2,
        wanted: Math.random() < .2,
    }

    // conditionally rendered
    if (drunk) {
        profileInformation.alcoholLevel = (Math.random() * 0.15 + 0.05).toFixed(2) // range of 0.05 - 0.20
    }

    return profileInformation
}