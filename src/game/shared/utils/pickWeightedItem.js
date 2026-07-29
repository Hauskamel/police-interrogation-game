// ##### Weighted Random Helper
// -----> Wählt einen Eintrag anhand seines numerischen weight-Werts aus.
// ---> Wird von mehreren Domains genutzt, damit alle gewichteten Ziehungen gleich funktionieren.
export function pickWeightedItem(items) {
    const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
    let remainingWeight = Math.random() * totalWeight;

    for (const item of items) {
        remainingWeight -= item.weight;

        if (remainingWeight <= 0) {
            return item;
        }
    }

    // Fängt Rundungsabweichungen bei Fließkommazahlen ab.
    return items[items.length - 1];
}
