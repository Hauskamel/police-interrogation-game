import {BaseTextbox} from "./textboxes/BaseTextbox.jsx";

// component is only visible on stopped car since no information about driver or vehicle is known or relevant
export function DriverLicence ( {selectedCar} ) {

    // check if no car has been stopped OR user clicked on a car that is not the stopped car

    return (
        <>
            <BaseTextbox title={"Führerschein"} className="driver-licence-textbox">
                <div className="flex">
                    <img src="/images/people/felix-baumgartner.png" />
                    <div className="">
                        <span>Name</span>
                        <span>Geburtsdatum</span>
                        <span>Noch irgendwas</span>
                    </div>
                </div>
            </BaseTextbox>
        </>
    )
}