import { useState } from "react";

import {
    BaseDocument,
    CarDocuments,
    DocumentBar,
    DriversLicense,
    ProofOfInsurance
} from "../components";
import { useCarStore } from "../../../stores";

/**
 * ##### Document Manager
 * -----> Verwaltet, welche Fahrzeug- und Fahrerdokumente aktuell geöffnet sind.
 */
export function DocumentManager() {
    const selectedCar = useCarStore(state => state.selectedCar)

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
                driver={selectedCar?.driverProfile}
            />
        ),
        carDocuments: (
            <CarDocuments
                key={"carDocuments"}
                car={selectedCar?.carProfile}
                driver={selectedCar?.driverProfile}
            />
        ),
        proofOfInsurance: (
            <ProofOfInsurance
                key={"proofOfInsurance"}
                car={selectedCar?.carProfile}
                driver={selectedCar?.driverProfile}
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
