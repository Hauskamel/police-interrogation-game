// This component is used in the drivers licence and car documents

import { useEffect, useState } from "react"


export const BaseHeadlineValueText = ({headline, data}) => {
    const [information, setInformation] = useState({})




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