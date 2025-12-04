import { useEffect, useState } from "react";


export function Searchbar (input) {
    const [value, setValue] = useState("");

    useEffect((e) => {
        setValue(e)
    }, [value])

    

    return (
        <>
            <div className="mb-20">
                <input
                    className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
                    onChange={(e) => setValue(e.target.value)} 
                    value={value}
                />
            </div>
        </>
    )
    
}