export function CarDocuments ({profile}) {



    return (
        <>
            <div
                // TODO: HIER MARGIN LEFT WIEDER ENTFERNEN
                className="w-[300px] h-[450px] bg-[url(/images/vehicle-document-bg.jpg)] bg-contain border-2 border-white rounded-2xl shadow-md p-4">
                <div className="text-black text-left">
                    <h4>Fahrzeugschein</h4>
                    <h3>Republik</h3>
                    <h1>Arcadia</h1>
                </div>

                <div className="col-span-2 flex flex-col text-gray-800 text-sm text-left">
                    <div className="mt-5">

                        <div>
                            <p>{profile.firstName} {profile.lastName}</p>
                            <p>
                                <strong className="upper">Fahrzeughalter</strong>
                            </p>
                        </div>

                        <div className="mt-3">
                            <p>{profile.plateNumber}</p>
                            <p>
                                <strong className="upper">Nummernschild</strong>
                            </p>
                        </div>

                        <div className="mt-3">
                            <p>{profile.vehicleName}</p>
                            <p>
                                <strong className="upper">Fahrzeug</strong>
                            </p>
                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}