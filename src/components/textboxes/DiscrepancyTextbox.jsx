import { useDiscrepandancyCompareStore } from "../../store";

import { BaseTextbox } from "../textboxes/BaseTextbox";

export function DiscrepancyTextbox () {
    const compareArray = useDiscrepandancyCompareStore(state => state.compareArray);
    const comparedDocumentDataField = compareArray.map(field => field.documentDataField);
    const dataFieldsAreEqual = comparedDocumentDataField.every(dataField => dataField === comparedDocumentDataField[0]);

    const comparedData = compareArray.map(field => field.data);
    const dataValuesAreEqual = comparedData.every(data => data === comparedData[0]);

    const renderTextDependingOnDataField = () => {
        if (dataValuesAreEqual) {
            return <p className="text-black text-xs">Die beiden Werte passen</p>;
        } else {
            return <p className="text-black text-xs">--- Diese Textbox nach Einbauen einer Animation bitte entfernen ----</p>;
        }
    }

    // TODO: hier weiter an den dynamischen Textboxen bauen
    return (
        <>
            <BaseTextbox title={"Check vorbei"} margin="bottom-60" isCloseable={false}>
                {renderTextDependingOnDataField()}
            </BaseTextbox>
        </>
    )
}