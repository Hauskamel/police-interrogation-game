import {useState} from "react";
import BaseDocument from "../base-components/BaseDocument.jsx";
import {DocumentBar} from "./../DocumentBar";

import {DriversLicense} from "./../driverDocuments/DriversLicense";
import {CarDocuments} from "./../driverDocuments/CarDocuments.jsx";
import { ProofOfInsurance } from "../driverDocuments/ProofOfInsurcance.jsx";
import { useCarStore } from "../../store.js";

export function DocumentManager() {
    const activeDocs = ["driversLicense", "carDocs", "proofOfInsurance"];
    const selectedCar = useCarStore(state => state.selectedCar)

    const [openDocs, setOpenDocs] = useState(() =>
        Object.fromEntries(activeDocs.map(doc => [doc, false])) // returns an object: { driversLicense: false, carDocs: false } 
                                                                // https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Object/fromEntries
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
        carDocs: (
            <CarDocuments
                key={"carDocs"}
                car={selectedCar?.carProfile}
                driver={selectedCar?.driverProfile}>
            </CarDocuments>
        ),
        proofOfInsurance: (
            <ProofOfInsurance
                key={"proofOfInsurance"}
                car={selectedCar?.carProfile}
                driver={selectedCar?.driverProfile}>
            </ProofOfInsurance>
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