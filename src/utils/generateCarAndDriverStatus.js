export function generateCarAndDriverStatus () {
    const drunk = Math.random() < .2;

    const status = {
        drunk,
        high: Math.random() < .2,
        wanted: Math.random() < .2,
    }

    // conditionally rendered
    if (drunk) {
        status.alcoholLevel = (Math.random() * 0.15 + 0.05).toFixed(2) // range of 0.05 - 0.20
    }

    return status
}