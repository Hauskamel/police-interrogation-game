import { useEffect, useState } from "react"


export const BaseHeadlineValueText = ({headline, data, image}) => {
    const [information, setInformation] = useState({})


    if (image !== undefined) {
        setInformation({
            image: image
        })
    }

    
    



    const handleClick = () => {
        setInformation({
            ...information,
            headline: headline,
            data: data
        })
    }



    useEffect(() => {
        console.log(information);
    }, [information])


    
    

    
    


    return (
        <>
            <div onClick={handleClick}>

                <strong>{headline}</strong>

                {
                   Array.isArray(data) ? (
                        data.map(paragraph => {
                            
                            
                                return Object.values(paragraph)[0]
                        })
                   ) : (
                        <p>{data}</p>
                   )
                }
                <p>
                    <strong className="upper">{information.headline}</strong>
                </p>
            </div>
        </>
    )

}