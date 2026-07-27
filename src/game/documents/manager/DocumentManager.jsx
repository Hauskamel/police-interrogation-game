import { useState } from "react";

import {
    BaseDocument,
    CarDocuments,
    DocumentBar,
    DriversLicense,
    ProofOfInsurance
} from "../components";
import { useTrafficStore } from "@stores";

// ##### Driver Identity Documents
// -----> Nur Dokumente mit Daten des Fahrers duerfen dessen Identitaet im Kontrollpanel aufdecken.
// ---> Der Fahrzeugschein zaehlt nicht pauschal, weil dort der Halter und nicht zwingend der Fahrer steht.
const DRIVER_IDENTITY_DOCUMENTS = new Set([
    "driversLicense",
    "proofOfInsurance"
]);

/**
 * ##### Document Manager
 * -----> Verwaltet, welche Fahrzeug- und Fahrerdokumente aktuell geöffnet sind.
 */
export function DocumentManager() {
    const selectedTrafficEntity = useTrafficStore(state => state.selectedTrafficEntity)
    const revealDriverIdentity = useTrafficStore(state => state.revealDriverIdentity);

    const activeDocs = ["driversLicense", "carDocuments", "proofOfInsurance"];
    const [openDocs, setOpenDocs] = useState(() =>
        Object.fromEntries(activeDocs.map(doc => [doc, false]))
    );
    
    
    const toggleDoc = (doc) => {
        const documentWillOpen = !openDocs[doc];

        // Bereits gelesene Identitaetsdaten bleiben fuer die laufende Kontrolle bekannt.
        if (
            documentWillOpen
            && DRIVER_IDENTITY_DOCUMENTS.has(doc)
            && selectedTrafficEntity?.id
            && selectedTrafficEntity?.npcId
        ) {
            revealDriverIdentity(
                selectedTrafficEntity.id,
                selectedTrafficEntity.npcId
            );
        }

        setOpenDocs(prev => ({
            ...prev,
            [doc]: !prev[doc]
        }))
    };

    const docComponents = {
        driversLicense: (
            <DriversLicense 
                key={"driversLicense"}
                driver={selectedTrafficEntity?.driverProfile}
            />
        ),
        carDocuments: (
            <CarDocuments
                key={"carDocuments"}
                car={selectedTrafficEntity?.vehicleProfile}
                owner={selectedTrafficEntity?.vehicleOwnerProfile}
            />
        ),
        proofOfInsurance: (
            <ProofOfInsurance
                key={"proofOfInsurance"}
                car={selectedTrafficEntity?.vehicleProfile}
                driver={selectedTrafficEntity?.driverProfile}
            />
        )
    }

    return (
        <>
            {activeDocs
                    .filter(doc => openDocs[doc])
                    .map(doc => (
                        <BaseDocument key={doc}>
                            {docComponents[doc]}
                        </BaseDocument>
                ))
            }

            <DocumentBar
                activeDocs={activeDocs}
                openDocs={openDocs}
                onSelect={toggleDoc}
            />
        </>
    );
}
