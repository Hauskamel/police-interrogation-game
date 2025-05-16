import AnimatedDocument from "./driverDocuments/AnimatedDocument";
import {DocumentDock} from "./DocumentDock";
import {DriversLicence} from "./driverDocuments/DriversLicence";
import {useState} from "react";

function DocumentManager({ selectedCar }) {
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
        if (currentDoc === "driversLicense" && selectedCar) {
            documentContent = (
                <DriversLicence profile={selectedCar.profileInformation} />
            );
        } else if (currentDoc === "carDocs") {
            // Todo: add carDocs component here
        }
    }

    return (
        <>
            <AnimatedDocument isVisible={docIsVisible}>
                {documentContent}
            </AnimatedDocument>

            <DocumentDock
                activeDocs={activeDocs}
                currentDoc={currentDoc}
                onSelect={toggleDoc}
                isVisible={docIsVisible}
            />
        </>
    );
}

export {DocumentManager}