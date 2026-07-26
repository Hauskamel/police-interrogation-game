/**
 * ##### Base Headline With Text
 * -----> Einheitliche Label-/Wert-Anzeige fuer Dokumentfelder.
 */
export const BaseHeadlineWithText = ({ headline, data, individualWidth }) => {
    return (
        <>
            <div className={`${individualWidth === "" ? "w-1/2" : "w-1/1"}`}>
                <strong>{headline ? headline : ""}</strong>
                <p>{data}</p>
            </div>
        </>
    )
}
