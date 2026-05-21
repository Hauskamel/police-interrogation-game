import {useState} from "react";
import BaseDocument from "../base-components/BaseDocument.jsx";
import {DocumentBar} from "./../DocumentBar";

import {DriversLicense} from "./../driverDocuments/DriversLicense";
import {CarDocuments} from "./../driverDocuments/CarDocuments.jsx";
import { ProofOfInsurance } from "../driverDocuments/ProofOfInsurcance.jsx";
import { useCarStore } from "../../store.js";

export function DocumentManager() {
    const selectedCar = useCarStore(state => state.selectedCar)

    const activeDocs = ["driversLicense", "carDocuments", "proofOfInsurance"];
    const [openDocs, setOpenDocs] = useState(() =>
        Object.fromEntries(activeDocs.map(doc => [doc, false])) // returns an object: { driversLicense: false, carDocuments: false } 
    );                                                          // https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Object/fromEntries
    
    
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