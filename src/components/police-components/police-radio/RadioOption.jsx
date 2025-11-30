export function Radiooption ({title, index, activeOptionIndex}) {


    return (
        <span className={`${activeOptionIndex === index ? "bg-orange-300" : ""} text-md text-black uppercase`}>
            {title}
        </span>

    )
}