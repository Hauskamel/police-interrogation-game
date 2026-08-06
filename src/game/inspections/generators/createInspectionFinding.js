import { createEntityId, getCurrentGameTimestamp } from "@game/shared";

// ##### Inspection Finding Factory
// -----> Erstellt einen nachvollziehbaren Beleg statt nur einer losen Finding-ID.
// ---> evidence enthält ausschließlich Angaben, die der Spieler in dieser Kontrolle benutzt hat.
export function createInspectionFinding({
    findingId,
    discoveredVia,
    evidence = [],
    sourceRecordId = null
}) {
    return {
        id: createEntityId("finding"),
        findingId,
        discoveredVia,
        evidence: evidence.map((item) => ({ ...item })),
        sourceRecordId,
        discoveredAt: getCurrentGameTimestamp()
    };
}
