export function DriversLicence ({ profile }) {

    return (
        <>
            <div className="w-[450px] h-[250px] bg-[url(/images/drivers-licence-bg.jpg)] bg-contain border-2 border-white rounded-2xl shadow-md p-4">
                <div>
                    <div className="font-bold text-lg text-gray-800">Führerschein</div>
                    <div className="text-xs italic text-gray-700">Republik Arcadia</div>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-4">
                    <div className="col-span-1 flex flex-col items-center justify-center">
                        <div className="border-2 border-gray-600 flex items-center justify-center text-xs text-gray-700">
                            <img
                                src={`/images/driver/${profile.licenceImage}`}
                                alt="Licence Photo"
                                className="col-span-2 w-28 h-28"
                            />
                        </div>
                        {/* Todo: create randomized licence classes with one matching the vehicle */}
                        <div className="mt-1">
                            <div className="font-semibold text-sm text-gray-800">D / M</div>
                        </div>
                    </div>

                    <div className="col-span-2 flex flex-col text-gray-800 text-sm text-left">
                        <div className="mt-1">
                            <div><strong>Name: </strong>{profile.firstName} {profile.lastName}</div>
                            <div><strong>Geburtsdatum: </strong>{profile.birthDate}</div>
                            <div><strong>Lizenznummer: </strong>{profile.licenseNumber}</div>
                            <div><strong>Ausgabedatum: </strong>{profile.issueDate}</div>
                        </div>
                        <div className="mt-4 flex justify-between w-4/5">
                            <span>
                                <strong>AugF</strong><br/>
                                {profile.eyeColor}
                            </span>
                            <span>
                                <strong>G</strong><br/>
                                {profile.gender}
                            </span>
                            <span>
                                <strong>H in cm</strong><br/>
                                {profile.height}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}