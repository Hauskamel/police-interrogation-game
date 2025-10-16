import { useDiscrepandancyCompareStore } from "../../store";

import { BaseTextbox } from "../textboxes/BaseTextbox";

export function DiscrepancyTextbox () {

    const compareArray = useDiscrepandancyCompareStore(state => state.compareArray);


    // const text =  hier dann überprüfen, ob
    //              A) global-ids in compareArray gleich sind und
    //              B) die Daten übereinstimmen oder abweichen
    

    return (
        <>
            <BaseTextbox title={"Check vorbei"} margin="bottom-60" isCloseable={false}>
                <p className="text-black text-xs">Das ist Text aus der neuen Textbox.</p>
            </BaseTextbox>
        </>
    )

};