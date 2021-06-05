import moment from 'moment';
import { ProfileManager } from '@kailona/core';

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
            value: parseInt(leukocytes, 10),
            unit: '10*9/L',
            system: 'http://unitsofmeasure.org',
            code: '10*9/L',
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
            value: parseInt(hemoglobin, 10),
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
            value: parseInt(platelets, 10),
            unit: 'mg/dl',
            system: 'http://unitsofmeasure.org',
            code: 'mg/dL',
        },
    };

    const { idMap } = labsData;
    if (idMap && idMap.platelets) {
        observation.id = idMap.platelets;
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

export { mapToFHIRLeukocytes, mapToFHIRHemoglobin, mapToFHIRPlatelets, mapToFHIRSBCPanel };
