import {useState} from "react";
import BaseDocument from "../driverDocuments/BaseDocument.jsx";
import {DocumentBar} from "./../DocumentBar";

import {DriversLicence} from "./../driverDocuments/DriversLicence";
import {CarDocuments} from "./../driverDocuments/CarDocuments.jsx"

export function DocumentManager({selectedCar}) {
    const [currentDoc, setCurrentDoc] = useState(null);
    const [docIsVisible, setDocIsVisible] = useState(false);

    const activeDocs = ["driversLicense", "carDocs"];

    const toggleDoc = (doc) => {
        if (currentDoc === doc) {
            setDocIsVisible((prev) => !prev);
        } else {
            setCurrentDoc(doc);
            setDocIsVisible(true);
        }
    };

    let documentContent = null;

    if (docIsVisible) {
        if (currentDoc === "driversLicense") {
            documentContent = (
                <DriversLicence profile={selectedCar?.profileInformation}/>
            );
        } else if (currentDoc === "carDocs") {
            documentContent = (
                <CarDocuments profile={selectedCar?.profileInformation}></CarDocuments>
            );
        }
    }

    return (
        <>
            <BaseDocument isVisible={docIsVisible}>
                {documentContent}
            </BaseDocument>

            <DocumentBar
                activeDocs={activeDocs}
                currentDoc={currentDoc}
                onSelect={toggleDoc}
                isVisible={docIsVisible}
            />
        </>
    );
}