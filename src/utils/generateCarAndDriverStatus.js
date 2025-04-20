export function generateCarAndDriverStatus () {
    return {
        drunk: Math.random() < .2,
        high: Math.random() < .2,
        wanted: Math.random() < .2,
    }
}