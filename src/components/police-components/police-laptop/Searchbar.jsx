import { useEffect, useState } from "react";


export function Searchbar () {
    const [value, setValue] = useState("");

    useEffect((e) => {
        setValue(e)
    }, [value])

    return (
        <>
            <div className="w-100 mb-50">
                <input
                    onChange={(e) => setValue(e.target.value)} 
                    value={value}
                />
            </div>
        </>
    )
    
}