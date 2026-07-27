import { useState } from "react";

import {
    BaseDocument,
    CarDocuments,
    DocumentBar,
    DriversLicense,
    ProofOfInsurance
} from "../components";
import { useTrafficStore } from "@stores";

/**
 * ##### Document Manager
 * -----> Verwaltet, welche Fahrzeug- und Fahrerdokumente aktuell geöffnet sind.
 */
export function DocumentManager() {
    const selectedTrafficEntity = useTrafficStore(state => state.selectedTrafficEntity)

    const activeDocs = ["driversLicense", "carDocuments", "proofOfInsurance"];
    const [openDocs, setOpenDocs] = useState(() =>
        Object.fromEntries(activeDocs.map(doc => [doc, false]))
    );
    
    
    const toggleDoc = (doc) => {
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
