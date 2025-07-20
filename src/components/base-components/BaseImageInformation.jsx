// Used in the wanted list component

export const BaseImageInformation = ({persona}) => {
    

    function handleClick () {
        console.log(persona)
    }


    return (
        <div
            className="flex mb-5"
            onClick={handleClick}>
            <img src={`/images/driver/${persona.driverProfile.licenceImage}`} className="w-20 h-20"/>
            <div>
                    <p className="text-gray-500 text-xs">{persona.driverProfile.firstName} {persona.driverProfile.lastName}</p>
                    <p className="text-gray-500 text-xs">Größe: {persona.driverProfile.height}</p>
                </div>
        </div>
    )
    
}