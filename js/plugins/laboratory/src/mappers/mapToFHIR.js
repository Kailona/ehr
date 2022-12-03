import moment from 'moment';
import { ProfileManager } from '@kailona/core';
import convertToFloatWith2Digit from '../../../lib/twoDigitFloatConverter';

function mapToFHIRLeukocytes(labsData) {
    const fhirPatientId = ProfileManager.activePatientId;
    if (!fhirPatientId) {
        throw new Error('Invalid patient id');
    }

    const { date, leukocytes } = labsData;
    if (!date || !leukocytes) {
        return null;
    }

    const observation = {
        resourceType: 'Observation',
        status: 'final',
        category: [
            {
                coding: [
                    {
                        system: 'http://hl7.org/fhir/ValueSet/observation-category',
                        code: 'laboratory',
                        display: 'Laboratory',
                    },
                ],
            },
        ],
        code: {
            coding: [
                {
                    system: 'http://loinc.org',
                    code: '6690-2',
                    display: 'Leukocytes',
                },
            ],
            text: 'Leukocytes',
        },
        subject: {
            reference: `Patient/${fhirPatientId}`,
        },
        effectiveDateTime: moment(date)
            .utc()
            .toISOString(),
        valueQuantity: {
            value: convertToFloatWith2Digit(leukocytes),
            unit: '10^3/μl',
            system: 'http://unitsofmeasure.org',
            code: '10^3/μl',
        },
    };

    const { idMap } = labsData;
    if (idMap && idMap.leukocytes) {
        observation.id = idMap.leukocytes;
    }

    return observation;
}

function mapToFHIRHemoglobin(labsData) {
    const fhirPatientId = ProfileManager.activePatientId;
    if (!fhirPatientId) {
        throw new Error('Invalid patient id');
    }

    const { date, hemoglobin } = labsData;
    if (!date || !hemoglobin) {
        return null;
    }

    const observation = {
        resourceType: 'Observation',
        status: 'final',
        category: [
            {
                coding: [
                    {
                        system: 'http://hl7.org/fhir/ValueSet/observation-category',
                        code: 'laboratory',
                        display: 'Laboratory',
                    },
                ],
            },
        ],
        code: {
            coding: [
                {
                    system: 'http://loinc.org',
                    code: '718-7',
                    display: 'Hemoglobin [Mass/volume] in Blood',
                },
            ],
            text: 'Hemoglobin [Mass/volume] in Blood',
        },
        subject: {
            reference: `Patient/${fhirPatientId}`,
        },
        effectiveDateTime: moment(date)
            .utc()
            .toISOString(),
        valueQuantity: {
            value: convertToFloatWith2Digit(hemoglobin),
            unit: 'g/dl',
            system: 'http://unitsofmeasure.org',
            code: 'g/dL',
        },
    };

    const { idMap } = labsData;
    if (idMap && idMap.hemoglobin) {
        observation.id = idMap.hemoglobin;
    }

    return observation;
}

function mapToFHIRPlatelets(labsData) {
    const fhirPatientId = ProfileManager.activePatientId;
    if (!fhirPatientId) {
        throw new Error('Invalid patient id');
    }

    const { date, platelets } = labsData;
    if (!date || !platelets) {
        return null;
    }

    const observation = {
        resourceType: 'Observation',
        status: 'final',
        category: [
            {
                coding: [
                    {
                        system: 'http://hl7.org/fhir/ValueSet/observation-category',
                        code: 'laboratory',
                        display: 'Laboratory',
                    },
                ],
            },
        ],
        code: {
            coding: [
                {
                    system: 'http://loinc.org',
                    code: '32623-1',
                    display: 'Platelet mean volume [Entitic volume] in Blood by Automated count',
                },
            ],
            text: 'Platelet mean volume [Entitic volume] in Blood by Automated count',
        },
        subject: {
            reference: `Patient/${fhirPatientId}`,
        },
        effectiveDateTime: moment(date)
            .utc()
            .toISOString(),
        valueQuantity: {
            value: convertToFloatWith2Digit(platelets),
            unit: '10^3/μl',
            system: 'http://unitsofmeasure.org',
            code: '10^3/μl',
        },
    };

    const { idMap } = labsData;
    if (idMap && idMap.platelets) {
        observation.id = idMap.platelets;
    }

    return observation;
}

function mapToFHIRLymphocytes(labsData) {
    const fhirPatientId = ProfileManager.activePatientId;
    if (!fhirPatientId) {
        throw new Error('Invalid patient id');
    }

    const { date, lymphocytes } = labsData;
    if (!date || !lymphocytes) {
        return null;
    }

    const observation = {
        resourceType: 'Observation',
        status: 'final',
        category: [
            {
                coding: [
                    {
                        system: 'http://hl7.org/fhir/ValueSet/observation-category',
                        code: 'laboratory',
                        display: 'Laboratory',
                    },
                ],
            },
        ],
        code: {
            coding: [
                {
                    system: 'http://loinc.org',
                    code: '26474-7',
                    display: 'Lymphocytes mean volume [Entitic volume] in Blood by Automated count',
                },
            ],
            text: 'Lymphocytes mean volume [Entitic volume] in Blood by Automated count',
        },
        subject: {
            reference: `Patient/${fhirPatientId}`,
        },
        effectiveDateTime: moment(date)
            .utc()
            .toISOString(),
        valueQuantity: {
            value: convertToFloatWith2Digit(lymphocytes),
            unit: '10^3/μl',
            system: 'http://unitsofmeasure.org',
            code: '10^3/μl',
        },
    };

    const { idMap } = labsData;
    if (idMap && idMap.lymphocytes) {
        observation.id = idMap.lymphocytes;
    }

    return observation;
}

function mapToFHIRNeutrophils(labsData) {
    const fhirPatientId = ProfileManager.activePatientId;
    if (!fhirPatientId) {
        throw new Error('Invalid patient id');
    }

    const { date, neutrophils } = labsData;
    if (!date || !neutrophils) {
        return null;
    }

    const observation = {
        resourceType: 'Observation',
        status: 'final',
        category: [
            {
                coding: [
                    {
                        system: 'http://hl7.org/fhir/ValueSet/observation-category',
                        code: 'laboratory',
                        display: 'Laboratory',
                    },
                ],
            },
        ],
        code: {
            coding: [
                {
                    system: 'http://loinc.org',
                    code: '26499-4',
                    display: 'Neutrophil mean volume [Entitic volume] in Blood by Automated count',
                },
            ],
            text: 'Neutrophil mean volume [Entitic volume] in Blood by Automated count',
        },
        subject: {
            reference: `Patient/${fhirPatientId}`,
        },
        effectiveDateTime: moment(date)
            .utc()
            .toISOString(),
        valueQuantity: {
            value: convertToFloatWith2Digit(neutrophils),
            unit: '10^3/μl',
            system: 'http://unitsofmeasure.org',
            code: '10^3/μl',
        },
    };

    const { idMap } = labsData;
    if (idMap && idMap.neutrophils) {
        observation.id = idMap.neutrophils;
    }

    return observation;
}

function mapToFHIREosinophils(labsData) {
    const fhirPatientId = ProfileManager.activePatientId;
    if (!fhirPatientId) {
        throw new Error('Invalid patient id');
    }

    const { date, eosinophils } = labsData;
    if (!date || !eosinophils) {
        return null;
    }

    const observation = {
        resourceType: 'Observation',
        status: 'final',
        category: [
            {
                coding: [
                    {
                        system: 'http://hl7.org/fhir/ValueSet/observation-category',
                        code: 'laboratory',
                        display: 'Laboratory',
                    },
                ],
            },
        ],
        code: {
            coding: [
                {
                    system: 'http://loinc.org',
                    code: '26449-9',
                    display: 'Eosinophil mean volume [Entitic volume] in Blood by Automated count',
                },
            ],
            text: 'Eosinophil mean volume [Entitic volume] in Blood by Automated count',
        },
        subject: {
            reference: `Patient/${fhirPatientId}`,
        },
        effectiveDateTime: moment(date)
            .utc()
            .toISOString(),
        valueQuantity: {
            value: convertToFloatWith2Digit(eosinophils),
            unit: '10^3/μl',
            system: 'http://unitsofmeasure.org',
            code: '10^3/μl',
        },
    };

    const { idMap } = labsData;
    if (idMap && idMap.eosinophils) {
        observation.id = idMap.eosinophils;
    }

    return observation;
}

function mapToFHIRBasophils(labsData) {
    const fhirPatientId = ProfileManager.activePatientId;
    if (!fhirPatientId) {
        throw new Error('Invalid patient id');
    }

    const { date, basophils } = labsData;
    if (!date || !basophils) {
        return null;
    }

    const observation = {
        resourceType: 'Observation',
        status: 'final',
        category: [
            {
                coding: [
                    {
                        system: 'http://hl7.org/fhir/ValueSet/observation-category',
                        code: 'laboratory',
                        display: 'Laboratory',
                    },
                ],
            },
        ],
        code: {
            coding: [
                {
                    system: 'http://loinc.org',
                    code: '26444-0',
                    display: 'Basophil mean volume [Entitic volume] in Blood by Automated count',
                },
            ],
            text: 'Basophil mean volume [Entitic volume] in Blood by Automated count',
        },
        subject: {
            reference: `Patient/${fhirPatientId}`,
        },
        effectiveDateTime: moment(date)
            .utc()
            .toISOString(),
        valueQuantity: {
            value: convertToFloatWith2Digit(basophils),
            unit: '10^3/μl',
            system: 'http://unitsofmeasure.org',
            code: '10^3/μl',
        },
    };

    const { idMap } = labsData;
    if (idMap && idMap.basophils) {
        observation.id = idMap.basophils;
    }

    return observation;
}

function mapToFHIRMonocytes(labsData) {
    const fhirPatientId = ProfileManager.activePatientId;
    if (!fhirPatientId) {
        throw new Error('Invalid patient id');
    }

    const { date, monocytes } = labsData;
    if (!date || !monocytes) {
        return null;
    }

    const observation = {
        resourceType: 'Observation',
        status: 'final',
        category: [
            {
                coding: [
                    {
                        system: 'http://hl7.org/fhir/ValueSet/observation-category',
                        code: 'laboratory',
                        display: 'Laboratory',
                    },
                ],
            },
        ],
        code: {
            coding: [
                {
                    system: 'http://loinc.org',
                    code: '26484-6',
                    display: 'Monocyte mean volume [Entitic volume] in Blood by Automated count',
                },
            ],
            text: 'Monocyte mean volume [Entitic volume] in Blood by Automated count',
        },
        subject: {
            reference: `Patient/${fhirPatientId}`,
        },
        effectiveDateTime: moment(date)
            .utc()
            .toISOString(),
        valueQuantity: {
            value: convertToFloatWith2Digit(monocytes),
            unit: '10^3/μl',
            system: 'http://unitsofmeasure.org',
            code: '10^3/μl',
        },
    };

    const { idMap } = labsData;
    if (idMap && idMap.monocytes) {
        observation.id = idMap.monocytes;
    }

    return observation;
}

function mapToFHIRSBCPanel(labsData, observationIds) {
    const fhirPatientId = ProfileManager.activePatientId;
    if (!fhirPatientId) {
        throw new Error('Invalid patient id');
    }

    const { date } = labsData;
    if (!date || !observationIds || !observationIds.length) {
        return null;
    }

    const observation = {
        resourceType: 'Observation',
        status: 'final',
        category: [
            {
                coding: [
                    {
                        system: 'http://hl7.org/fhir/ValueSet/observation-category',
                        code: 'laboratory',
                        display: 'Laboratory',
                    },
                ],
            },
        ],
        code: {
            coding: [
                {
                    system: 'http://loinc.org',
                    code: '55429-5',
                    display: 'Short blood count panel - Blood',
                },
            ],
            text: 'Short blood count panel - Blood',
        },
        subject: {
            reference: `Patient/${fhirPatientId}`,
        },
        effectiveDateTime: moment(date)
            .utc()
            .toISOString(),
        hasMember: observationIds.map(observationId => ({
            reference: `Observation/${observationId}`,
        })),
    };

    const { idMap } = labsData;
    if (idMap && idMap.panel) {
        observation.id = idMap.panel;
    }

    return observation;
}

export {
    mapToFHIRLeukocytes,
    mapToFHIRHemoglobin,
    mapToFHIRPlatelets,
    mapToFHIRLymphocytes,
    mapToFHIRNeutrophils,
    mapToFHIREosinophils,
    mapToFHIRBasophils,
    mapToFHIRMonocytes,
    mapToFHIRSBCPanel,
};
