import { useDiscrepandancyCompareStore } from "../../store";

import { BaseTextbox } from "../textboxes/BaseTextbox";

export function DiscrepancyTextbox () {
    // documentDataField
    // useCase
    // headline
    // data
    // id
    const compareArray = useDiscrepandancyCompareStore(state => state.compareArray);
    
    const comparedDocumentDataField = compareArray.map(field => field.documentDataField);
    const dataFieldsAreEqual = comparedDocumentDataField.every(dataField => dataField === comparedDocumentDataField[0]);

    // NEU: Vergleiche die "data"-Werte im compareArray
    const comparedData = compareArray.map(field => field.data);
    const dataValuesAreEqual = comparedData.every(data => data === comparedData[0]);

    const renderTextDependingOnDataField = () => {
        if (dataValuesAreEqual) {
            return <p className="text-black text-xs">Die beiden Werte passen</p>;
        } else {
            return <p className="text-black text-xs">Hier stimmt was nicht</p>;
        }
    }

    // TODO: hier weiter an den dynamischen Textboxen bauen
    return (
        <>
            <BaseTextbox title={"Check vorbei"} margin="bottom-60" isCloseable={false}>
            {!dataFieldsAreEqual ? 
                <p className="text-black text-xs">Dieser Vergleich macht keinen Sinn.</p> 
                : <p className="text-black text-xs">Ich vergleiche {compareArray[0].headline}</p>
            }
            {renderTextDependingOnDataField()}
            </BaseTextbox>
        </>
    )
}