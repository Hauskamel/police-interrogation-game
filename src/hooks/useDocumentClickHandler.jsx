import { useDiscrepandancyCompareStore } from "../store";

const setInformationToCompareArray = useDiscrepandancyCompareStore(state => state.setInformationToCompareArray);
const removeInformationFromCompareArray = useDiscrepandancyCompareStore(state => state.removeInformationFromCompareArray);
const lastClickedUseCase = useDiscrepandancyCompareStore(state => state.lastClickedUseCase);
const setLastClickedUseCase = useDiscrepandancyCompareStore(state => state.setLastClickedUseCase);
const clearLastClickedUseCase = useDiscrepandancyCompareStore(state => state.clearLastClickedUseCase);

export function useDocumentClickHandler () {
    if (isSelected) clearLastClickedUseCase();

        // checks whether 'BaseHeadlineWithText' can be clicked to compare
        // disables possiblity to check two datasets from the same document) return;
        if (((gameState !== gameStates.DISCREPANCY) || compareArray.length > 1) && !isSelected || (!isSelected && lastClickedUseCase === useCase)) return;

        // check if Headline/Text was already selected (already in compareArray)...
        if (!isSelected) {
            // ... if not save set it to 'isSelected', add the information to the 'compareArray'
            setIsSelected(prev => !prev);
            setInformationToCompareArray({
                id: id,
                documentDataField: documentDataField,
                useCase: useCase,
                headline: headline,
                data: data
            })
            setLastClickedUseCase(useCase)
            return
        }

        // finds the clicked object by searching the useCase (e.g. 'driversLicence') and the id
        const obj = compareArray.find(item => item.useCase === useCase && item.id === id);
        if (obj) removeInformationFromCompareArray(obj.useCase, obj.id);
        if (isSelected) removeInformationFromCompareArray(obj.useCase, obj.id);
        
        setIsSelected(prev => !prev); // switches between true and false
        return // return so not set again to compareArray
}