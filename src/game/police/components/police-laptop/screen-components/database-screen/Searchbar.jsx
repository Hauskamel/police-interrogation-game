import { useCallback, useState } from "react";


export function Searchbar ({setInput}) {
    const [value, setValue] = useState("");


    const handleChange = useCallback((e) => {
        setValue(e.target.value)
    }, [])

    const handleKeyDown = useCallback((e) => {
        const keyCode = e.keyCode;
        if (keyCode == 13) setInput(value)
    }, [value, setInput])

    
    return (
        <>
            <div className="mb-20">
                <input
                    className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
                    onKeyDown={handleKeyDown}
                    onChange={handleChange} 
                    value={value}
                />
            </div>
        </>
    )
}
