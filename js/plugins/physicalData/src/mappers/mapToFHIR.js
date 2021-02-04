import moment from 'moment';
import { ProfileManager } from '@kailona/core';

function mapToFHIRBodyWeight(physicalData) {
    const fhirPatientId = ProfileManager.activePatientId;
    if (!fhirPatientId) {
        throw new Error('Invalid patient id');
    }

    const { date, bodyWeight } = physicalData;
    if (!date || !bodyWeight) {
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
                        code: 'vital-signs',
                        display: 'Vital Signs',
                    },
                ],
            },
        ],
        code: {
            coding: [
                {
                    system: 'http://loinc.org',
                    code: '29463-7',
                    display: 'Body Weight',
                },
            ],
            text: 'Body Weight',
        },
        subject: {
            reference: `Patient/${fhirPatientId}`,
        },
        effectiveDateTime: moment(date)
            .utc()
            .toISOString(),
        valueQuantity: {
            value: parseInt(bodyWeight, 10),
            unit: 'kg',
            system: 'http://unitsofmeasure.org',
            code: 'kg',
        },
    };

    const { idMap } = physicalData;
    if (idMap && idMap.bodyWeight) {
        observation.id = idMap.bodyWeight;
    }

    return observation;
}

function mapToFHIRBodyHeight(physicalData) {
    const fhirPatientId = ProfileManager.activePatientId;
    if (!fhirPatientId) {
        throw new Error('Invalid patient id');
    }

    const { date, bodyHeight } = physicalData;
    if (!date || !bodyHeight) {
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
                        code: 'vital-signs',
                        display: 'Vital Signs',
                    },
                ],
            },
        ],
        code: {
            coding: [
                {
                    system: 'http://loinc.org',
                    code: '8302-2',
                    display: 'Body height',
                },
            ],
            text: 'Body height',
        },
        subject: {
            reference: `Patient/${fhirPatientId}`,
        },
        effectiveDateTime: moment(date)
            .utc()
            .toISOString(),
        valueQuantity: {
            value: parseInt(bodyHeight, 10),
            unit: 'cm',
            system: 'http://unitsofmeasure.org',
            code: 'cm',
        },
    };

    const { idMap } = physicalData;
    if (idMap && idMap.bodyHeight) {
        observation.id = idMap.bodyHeight;
    }

    return observation;
}

function mapToFHIRBMI(physicalData, observationIds) {
    const fhirPatientId = ProfileManager.activePatientId;
    if (!fhirPatientId) {
        throw new Error('Invalid patient id');
    }

    const { date, bmi } = physicalData;
    if (!date || !bmi) {
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
                        code: 'vital-signs',
                        display: 'Vital Signs',
                    },
                ],
            },
        ],
        code: {
            coding: [
                {
                    system: 'http://loinc.org',
                    code: '39156-5',
                    display: 'Body mass index (BMI) [Ratio]',
                },
            ],
            text: 'Body mass index (BMI)',
        },
        subject: {
            reference: `Patient/${fhirPatientId}`,
        },
        effectiveDateTime: moment(date)
            .utc()
            .toISOString(),
        valueQuantity: {
            value: parseFloat(bmi),
            unit: 'kg/m2',
            system: 'http://unitsofmeasure.org',
            code: 'kg/m2',
        },
    };

    if (observationIds && observationIds.length) {
        observation.derivedFrom = observationIds.map(observationId => ({
            reference: `Observation/${observationId}`,
        }));
    }

    const { idMap } = physicalData;
    if (idMap && idMap.bmi) {
        observation.id = idMap.bmi;
    }

    return observation;
}

function mapToFHIRPhysicalDataPanel(physicalData, observationIds) {
    const fhirPatientId = ProfileManager.activePatientId;
    if (!fhirPatientId) {
        throw new Error('Invalid patient id');
    }

    const { date } = physicalData;
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
                        code: 'vital-signs',
                        display: 'Vital Signs',
                    },
                ],
            },
        ],
        code: {
            coding: [
                {
                    system: 'http://loinc.org',
                    code: '34565-2',
                    display: 'Vital signs, weight and height panel',
                },
            ],
            text: 'Vital signs panel including weight, height and BMI',
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

    const { idMap } = physicalData;
    if (idMap && idMap.panel) {
        observation.id = idMap.panel;
    }

    return observation;
}

export { mapToFHIRBodyWeight, mapToFHIRBodyHeight, mapToFHIRBMI, mapToFHIRPhysicalDataPanel };
