import { faker } from "@faker-js/faker";

import { createEntityId } from "@game/shared";

// ##### Immigration Document Generator
// -----> Erzeugt nur die Erlaubnisse, die das kanonische MigrationProfile verlangt.
// ---> Die Arbeitserlaubnis referenziert die zugehoerige Aufenthaltserlaubnis relational.
export function generateImmigrationDocuments({ npcId, migrationProfile }) {
    if (!migrationProfile?.requiresResidencePermit) {
        return {
            residencePermit: null,
            workPermit: null
        };
    }

    const residencePermit = createResidencePermit({
        npcId,
        migrationProfile
    });
    const workPermit = migrationProfile.requiresWorkPermit
        ? createWorkPermit({
            npcId,
            migrationProfile,
            residencePermit
        })
        : null;

    return {
        residencePermit,
        workPermit
    };
}

function createResidencePermit({ npcId, migrationProfile }) {
    return {
        permitId: createEntityId("residence-permit"),
        permitNumber: createPermitNumber("AE"),
        holderNpcId: npcId,
        countryOfOrigin: migrationProfile.countryOfOrigin,
        purpose: migrationProfile.requiresWorkPermit
            ? "Beschäftigung"
            : "Privater Aufenthalt",
        localAddress: migrationProfile.localAddress,
        validFrom: migrationProfile.arrivalDate,
        validUntil: migrationProfile.departureDate,
        issuingAuthority: "Einwanderungsamt Westmark",
        status: "active"
    };
}

function createWorkPermit({ npcId, migrationProfile, residencePermit }) {
    return {
        permitId: createEntityId("work-permit"),
        permitNumber: createPermitNumber("AR"),
        holderNpcId: npcId,
        residencePermitId: residencePermit.permitId,
        residencePermitNumber: residencePermit.permitNumber,
        employer: migrationProfile.employment.employer,
        occupation: migrationProfile.employment.occupation,
        validFrom: migrationProfile.arrivalDate,
        validUntil: migrationProfile.departureDate,
        issuingAuthority: "Arbeitsbehörde Westmark",
        status: "active"
    };
}

function createPermitNumber(prefix) {
    return `${prefix}-${faker.string.alphanumeric({
        length: 8,
        casing: "upper"
    })}`;
}
