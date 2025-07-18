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
                {
                    data.map(([paragraph], index) => {
                        console.log(Object.values(paragraph)[index]);
                        console.log(index);
                        return (
                            <p>{Object.values(paragraph)}</p>
                        )

                    })
                }
                <p>
                    <strong className="upper">{information.headline}</strong>
                </p>
            </div>
        </>
    )

}