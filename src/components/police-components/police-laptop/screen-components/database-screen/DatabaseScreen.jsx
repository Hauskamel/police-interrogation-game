import { Searchbar } from "./Searchbar";
import { Database } from "./Database";
import { useEffect, useCallback, useState, use } from "react";


export function DatabaseScreen () {
    const [searchInput, setSearchInput] = useState("");

    const handleSearchInput = (input) => {
        setSearchInput(input)
    }

    return (
        <>
            <Searchbar setInput={handleSearchInput} />
            <Database userInput={searchInput} />
        </>
    )
}