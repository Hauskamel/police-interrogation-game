import { Database } from "./Database";
import { Searchbar } from "./Searchbar"


export function PoliceLaptopScreen () {


    function getInput (input) {
        console.log(input)
    }


    return (
        <>
            <div
                className="pl-40 pr-40"
            >
                <Searchbar input={getInput} />
                <Database />
            </div>
            
        </>
    )
    
}