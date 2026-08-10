import { create } from "zustand";

const emptyOfficialRegistry = {
    peopleById: {},
    driverLicensesByNumber: {},
    residencePermitsByNumber: {},
    workPermitsByNumber: {},
    vehiclesById: {},
    insurancePoliciesById: {}
};

// ##### Official Registry Store
// -----> Speichert amtliche Verwaltungsdaten ohne Straftaten, Fahndungen oder World Truth.
// ---> Der Police Laptop darf diese Register fuer konkrete Dokumentabfragen verwenden.
export const useOfficialRegistryStore = create((set) => ({
    officialRegistry: emptyOfficialRegistry,

    registerOfficialRecords: ({
        peopleById = {},
        driverLicensesByNumber = {},
        residencePermitsByNumber = {},
        workPermitsByNumber = {},
        vehiclesById = {},
        insurancePoliciesById = {}
    } = {}) => {
        set((state) => ({
            officialRegistry: {
                peopleById: {
                    ...state.officialRegistry.peopleById,
                    ...peopleById
                },
                driverLicensesByNumber: {
                    ...state.officialRegistry.driverLicensesByNumber,
                    ...driverLicensesByNumber
                },
                residencePermitsByNumber: {
                    ...state.officialRegistry.residencePermitsByNumber,
                    ...residencePermitsByNumber
                },
                workPermitsByNumber: {
                    ...state.officialRegistry.workPermitsByNumber,
                    ...workPermitsByNumber
                },
                vehiclesById: {
                    ...state.officialRegistry.vehiclesById,
                    ...vehiclesById
                },
                insurancePoliciesById: {
                    ...state.officialRegistry.insurancePoliciesById,
                    ...insurancePoliciesById
                }
            }
        }));
    },

    resetOfficialRegistry: () => {
        set({ officialRegistry: emptyOfficialRegistry });
    }
}));

// ##### Criminal Database Registry Seed
// -----> Uebernimmt nur amtliche Stammdaten aus den beim Spielstart erzeugten Polizeirecords.
// ---> Crime- und Wanted-Informationen werden absichtlich nicht in das Register kopiert.
export function registerCriminalDatabaseOfficialRecords(criminalDatabase) {
    const peopleById = {};
    const driverLicensesByNumber = {};
    const residencePermitsByNumber = {};
    const workPermitsByNumber = {};
    const vehiclesById = { ...(criminalDatabase?.vehiclesById ?? {}) };

    Object.values(criminalDatabase?.npcsById ?? {}).forEach((npc) => {
        const officialPerson = createOfficialPersonRecord(npc);
        peopleById[npc.npcId] = officialPerson;

        if (npc.driversLicense) {
            driverLicensesByNumber[npc.driversLicense.licenseNumber] = {
                ...npc.driversLicense,
                npcId: npc.npcId
            };
        }

        registerImmigrationDocuments({
            person: npc,
            residencePermitsByNumber,
            workPermitsByNumber
        });
    });

    useOfficialRegistryStore.getState().registerOfficialRecords({
        peopleById,
        driverLicensesByNumber,
        residencePermitsByNumber,
        workPermitsByNumber,
        vehiclesById
    });
}

// ##### Traffic Entity Registry Commit
// -----> Registriert echte Fahrer-, Halter-, Fahrzeug- und Versicherungsdaten beim Welt-Spawn.
// ---> Presented-Profile und unbekannte Straftaten gelangen niemals in das amtliche Register.
export function registerTrafficEntityOfficialRecords(trafficEntity) {
    const people = [
        trafficEntity.driverProfile?.real,
        trafficEntity.vehicleOwnerProfile?.real
    ].filter(Boolean);
    const peopleById = {};
    const driverLicensesByNumber = {};
    const residencePermitsByNumber = {};
    const workPermitsByNumber = {};

    people.forEach((person) => {
        peopleById[person.npcId] = createOfficialPersonRecord(person);

        if (person.driversLicense) {
            driverLicensesByNumber[person.driversLicense.licenseNumber] = {
                ...person.driversLicense,
                npcId: person.npcId
            };
        }


        registerImmigrationDocuments({
            person,
            residencePermitsByNumber,
            workPermitsByNumber
        });
    });

    const vehicle = trafficEntity.vehicleProfile?.real;
    const insurancePolicy = trafficEntity.insuranceProfile?.real;

    useOfficialRegistryStore.getState().registerOfficialRecords({
        peopleById,
        driverLicensesByNumber,
        residencePermitsByNumber,
        workPermitsByNumber,
        vehiclesById: vehicle
            ? { [vehicle.vehicleId]: vehicle }
            : {},
        insurancePoliciesById: insurancePolicy
            ? { [insurancePolicy.policyId]: insurancePolicy }
            : {}
    });
}

// Amtliche Personenrecords enthalten Identitaetsdaten, aber keine polizeilichen Beziehungen.
function createOfficialPersonRecord(person) {
    return {
        npcId: person.npcId,
        sex: person.sex,
        firstName: person.firstName,
        lastName: person.lastName,
        address: person.address,
        age: person.age,
        birthYear: person.birthYear,
        birthDate: person.birthDate,
        height: person.height,
        hairColor: person.hairColor,
        eyeColor: person.eyeColor,
        distinguishingMarks: [...(person.distinguishingMarks ?? [])],
        npcImage: person.npcImage,
        countryOfOrigin: person.countryOfOrigin ?? null,
        driversLicenseNumber: person.driversLicense?.licenseNumber ?? null,
        residencePermitNumber: person.residencePermit?.permitNumber ?? null,
        workPermitNumber: person.workPermit?.permitNumber ?? null
    };
}

function registerImmigrationDocuments({
    person,
    residencePermitsByNumber,
    workPermitsByNumber
}) {
    if (person.residencePermit) {
        residencePermitsByNumber[person.residencePermit.permitNumber] = {
            ...person.residencePermit,
            holderNpcId: person.npcId
        };
    }

    if (person.workPermit) {
        workPermitsByNumber[person.workPermit.permitNumber] = {
            ...person.workPermit,
            holderNpcId: person.npcId
        };
    }
}
