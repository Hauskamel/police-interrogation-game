import { useCarStore } from "../store";
import { useFrame } from "@react-three/fiber";


export function useTextboxAnimation (car, carRef) {
    const carPosition = useCarStore((state) => state.carPosition)
    // NOTE: Hier vllt mit dem Cars Array aus dem Store arbeiten -> Anzahl an Autos = Anzahl an Textboxen (1:1)

    // useFrame(() => {
        // if (!carRef.current) return;
    // })

}