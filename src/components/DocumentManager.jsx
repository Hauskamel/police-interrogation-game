import {useState} from "react";
import AnimatedDocument from "./driverDocuments/AnimatedDocument";
import {DocumentDock} from "./DocumentDock";

import {DriversLicence} from "./driverDocuments/DriversLicence";
import {CarDocuments} from "./driverDocuments/CarDocuments.jsx";

function DocumentManager({selectedCar}) {
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
            <AnimatedDocument>
                {documentContent}
            </AnimatedDocument>

            <DocumentDock
                activeDocs={activeDocs}
                openDocs={openDocs}
                onSelect={toggleDoc}
            />
        </>
    );
}

export {DocumentManager}