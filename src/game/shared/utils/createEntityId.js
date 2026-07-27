import { generateUUID } from "three/src/math/MathUtils.js";

const ENTITY_ID_LENGTH = 10;
const issuedEntityIds = new Set();

// ##### Short Entity ID Generator
// -----> Erzeugt einheitliche, lesbare IDs wie npc--5e77eb571e.
// ---> Zehn Hex-Zeichen liefern rund 40 Bit und werden innerhalb der Session auf Duplikate geprüft.
export function createEntityId(prefix) {
    let entityId;

    do {
        const shortId = generateUUID()
            .replaceAll("-", "")
            .slice(0, ENTITY_ID_LENGTH)
            .toLowerCase();

        entityId = `${prefix}--${shortId}`;
    } while (issuedEntityIds.has(entityId));

    issuedEntityIds.add(entityId);
    return entityId;
}
