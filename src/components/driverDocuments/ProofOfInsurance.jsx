export function ProofOfInsurance ({driver, car}) {


    // NOTE: nur ein Versuch es so noch etwas übersichtlicher zu machen
    // Informatoin wird zuerst ins Objekt gespeichert und dann daraus aufgerufen
    const proofOfInsuranceInterface = {
        driverName: driver?.firstName + " " + driver?.lastName,
        vin: car?.vin,
        brandName: car?.brandName,
        insuranceValidFrom: car?.insuranceValidFrom,
        insuranceValidTo: car?.insuranceValidTo
    }



    console.log(proofOfInsuranceInterface);
    
    



    return (
        <>
            <div
                className="w-[350px] h-[200px] bg-[url(/images/proof-of-insurance-bg.jpg)] bg-contain border-2 border-white rounded-2xl shadow-md p-4">
                <div className="text-black text-left">
                    <h3>Versicherungsnachweis</h3>
                </div>


                <div className="col-span-2 flex flex-col text-gray-800 text-sm text-left">
                    <div className="mt-5">

                        <div>
                            <p><strong>{proofOfInsuranceInterface.driverName}</strong></p>
                            <p>Fahrzeughalter</p>
                        </div>

                        <div className="mt-3">
                            <p><strong>{proofOfInsuranceInterface.vin}</strong></p>
                            <p className="lower">vin</p>
                        </div>

                        <div className="flex">
                            <div className="w-1/3 mt-3">
                                <p><strong>{proofOfInsuranceInterface.brandName}</strong></p>
                                <p>Hersteller</p>
                            </div>
                        
                            <div className="w-2/3 mt-3">
                                <p><strong>{proofOfInsuranceInterface.insuranceValidFrom}</strong></p>
                                <p>Verischert seit</p>
                            </div>
                            
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}