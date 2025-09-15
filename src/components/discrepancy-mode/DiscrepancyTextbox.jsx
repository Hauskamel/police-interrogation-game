import { useDiscrepandancyCompareStore } from "../../store";

export function DiscpreancyTextbox () {

    const compareArray = useDiscrepandancyCompareStore(state => state.compareArray);

    console.log(compareArray);
    

    return (
        <>
        
            
        </>
    )

};