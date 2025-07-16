import {useState} from "react";
import BaseDocument from "../driverDocuments/BaseDocument.jsx";
import {DocumentBar} from "./../DocumentBar";

import {DriversLicence} from "./../driverDocuments/DriversLicence";
import {CarDocuments} from "./../driverDocuments/CarDocuments.jsx"
import { ProofOfInsurance } from "../driverDocuments/ProofOfInsurance.jsx";

export function DocumentManager({selectedCar}) {
    const activeDocs = ["proofOfInsurance", "driversLicense", "carDocs"];

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
            <DriversLicence 
                key="driversLicense"
                profile={selectedCar?.driverProfile}
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
                driver={selectedCar?.driverProfile}
                >
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