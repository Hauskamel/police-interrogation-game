import { npcVehicles } from "../../data/npcVehicles";

export function getRandomVehicleGlb (type) {
    const glbFiles = Object.values(npcVehicles[type]);

    const randomglbFile = glbFiles[Math.floor(Math.random() * glbFiles.length)]    

    return randomglbFile 
}