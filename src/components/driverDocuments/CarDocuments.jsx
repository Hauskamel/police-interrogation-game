export function CarDocuments ({driver, car}) {



    


    return (
        <>
            <div
                className="w-[300px] h-[450px] bg-[url(/images/vehicle-document-bg.jpg)] bg-contain border-2 border-white rounded-2xl shadow-md p-4">
                <div className="text-black text-left">
                    <h4>Fahrzeugschein</h4>
                    <h3>Republik</h3>
                    <h1>Arcadia</h1>
                </div>

                <div className="col-span-2 flex flex-col text-gray-800 text-sm text-left">
                    <div className="mt-5">

                        <div>
                            <p>{driver?.firstName} {driver?.lastName}</p>
                            <p>
                                <strong className="upper">Fahrzeughalter</strong>
                            </p>
                        </div>

                        <div className="mt-3">
                            <p>{car?.plateNumber}</p>
                            <p>
                                <strong className="upper">Nummernschild</strong>
                            </p>
                        </div>

                        <div className="flex">
                            <div className="w-2/3 mt-3">
                                <p>{car?.brandName}</p>
                                <p>
                                    <strong className="upper">Hersteller</strong>
                                </p>
                            </div>

                            <div className="w-1/3 mt-3">
                                <p>{car?.brandModel}</p>
                                <p>
                                    <strong className="upper">Modell</strong>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </>
    )
}