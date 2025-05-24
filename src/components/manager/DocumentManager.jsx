import {useState} from "react";
import BaseDocument from "../driverDocuments/BaseDocument.jsx";
import {DocumentBar} from "./../DocumentBar";

import {DriversLicence} from "./../driverDocuments/DriversLicence";
import {CarDocuments} from "./../driverDocuments/CarDocuments.jsx"

export function DocumentManager({selectedCar}) {
    const activeDocs = ["driversLicense", "carDocs"];

    const [openDocs, setOpenDocs] = useState(() => 
        Object.entries(activeDocs.map(doc => [doc, false]))
    );
    




    const toggleDoc = (doc) => {
        setOpenDocs(prev => ({
            ...prev,
            [doc]: !prev[doc]
        }))
    };

    let documentContent = [];
    
    if (openDocs["driversLicense"]) {
        documentContent.push(
            <DriversLicence 
                key="driversLicense"
                profile={selectedCar.profileInformation}
            />
        )  
    }
    if (openDocs["carDocs"]) {
        documentContent.push(
            <CarDocuments 
                key={"carDocs"}
                profile={selectedCar.profileInformation}>
            </CarDocuments>
        )
    }
    

    return (
        <>

            {
                
                documentContent.map((openDocument,i) => {

                    console.log(openDocument);
                    

                    return (
                        <BaseDocument key={openDocument.key}>
                            {openDocument}
                        </BaseDocument>
                    )
                    
                })
            }

            <DocumentBar
                activeDocs={activeDocs}
                openDocs={openDocs}
                onSelect={toggleDoc}
            />
        </>
    );
}