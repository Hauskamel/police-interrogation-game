/**
 * ##### Base Image
 * -----> Einheitliche Bildanzeige fuer Dokument- und Personenbilder.
 */
export function BaseImage ({ data }) {
    return (
        <>
            <div className="inline-block">
                <img src={`/images/driver/${data}`} className="w-20" alt="" />
            </div>
        </>
    )

}
