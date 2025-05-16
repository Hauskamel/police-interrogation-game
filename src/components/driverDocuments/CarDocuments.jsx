export function CarDocuments ({profile}) {



    return (
        <>
            <div
                className="w-[300px] h-[450px] bg-[url(/images/vehicle-document-bg.jpg)] bg-contain rounded-2xl  shadow-md p-4">
                <div className="text-black">
                    <h4>Fahrzeugschein</h4>
                    <h3>Republik</h3>
                    <h1>Arcadia</h1>
                </div>

                <div className="col-span-2 flex flex-col text-gray-800 text-sm text-left">
                    <div className="mt-1">
                        <div><strong>Name: </strong>{profile.firstName} {profile.lastName}</div>
                    </div>
                </div>
            </div>
        </>
    )
}