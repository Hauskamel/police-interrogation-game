// ##### Forgery Types
// -----> Beschreibt konkrete Arten von bewussten Dokumentmanipulationen.
// ---> Die Werte werden vom Presented-Generator genutzt, um einzelne sichtbare Felder zu verändern.
export const DOCUMENT_FORGERY_TARGETS = {
    DRIVER: "npc",
    VEHICLE: "vehicle",
    INSURANCE: "insurance"
};

export const NPC_DOCUMENT_FORGERY_TYPES = {
    WRONG_ADDRESS: "wrong_address",
    WRONG_BIRTH_DATE: "wrong_birth_date",
    WRONG_LICENSE_NUMBER: "wrong_license_number",
    WRONG_NAME: "wrong_name",
    WRONG_EYE_COLOR: "wrong_eye_color",
    WRONG_PHOTO: "wrong_photo"
};

export const VEHICLE_DOCUMENT_FORGERY_TYPES = {
    PLATE_MISMATCH: "plate_mismatch",
    WRONG_REGISTRATION_NUMBER: "wrong_registration_number",
    WRONG_VEHICLE_MODEL: "wrong_vehicle_model"
};

export const INSURANCE_DOCUMENT_FORGERY_TYPES = {
    WRONG_POLICY_NUMBER: "wrong_policy_number",
    WRONG_INSURED_PLATE: "wrong_insured_plate"
};
