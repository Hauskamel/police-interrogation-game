import { gameStates } from "../store";

export function useDocumentClickHandler ({
    useCase,
    documentDataField,
    headline,
    data,
    setInformationToCompareArray,
    removeInformationFromCompareArray,
    lastClickedUseCase,
    setLastClickedUseCase,
    clearLastClickedUseCase,
    isSelected,
    setIsSelected,
    gameState,
    compareArray
})  {
    if (isSelected) clearLastClickedUseCase();
        // checks whether 'BaseHeadlineWithText' can be clicked to compare
        // disables possiblity to check two datasets from the same document) return;
        if (((gameState !== gameStates.DISCREPANCY) || compareArray.length > 1) && !isSelected || (!isSelected && lastClickedUseCase === useCase)) return;

        // check if the clicked Information (Text, Image,...) was already selected (already in compareArray)...
        if (!isSelected) {
            // ... if not save set it to 'isSelected', add the information to the 'compareArray'
            setIsSelected(prev => !prev);
            setInformationToCompareArray({
                documentDataField: documentDataField,
                useCase: useCase,
                headline: headline,
                data: data
            })
            setLastClickedUseCase(useCase)
            return
        }

        // finds the clicked object by searching the useCase (e.g. 'driversLicence') and the documentDataField (e.g. 'birthday')
        const obj = compareArray.find(item => item.useCase === useCase && item.documentDataField === documentDataField);
        if (obj) removeInformationFromCompareArray(obj.useCase, obj.documentDataField);
        
        setIsSelected(prev => !prev); // switches between true and false
        return // return so not set again to compareArray
}