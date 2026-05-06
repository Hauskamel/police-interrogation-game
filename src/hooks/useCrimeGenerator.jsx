import { useNpcStore } from "../store";

export function useCrimeGenerator () {
    const criminalNpcIds = useNpcStore(state => state.criminalNpcIds)

    
    console.log(criminalNpcIds);
    
}