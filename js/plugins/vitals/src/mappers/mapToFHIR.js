import moment from 'moment';
import { ProfileManager } from '@kailona/core';

function mapToFHIRBloodPressure(vitalsData) {
    const fhirPatientId = ProfileManager.activePatientId;
    if (!fhirPatientId) {
        throw new Error('Invalid patient id');
    }

    const { date, systolicBloodPressure, diastolicBloodPressure } = vitalsData;
    if (!date || !systolicBloodPressure || !diastolicBloodPressure) {
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
                    code: '85354-9',
                    display: 'Blood pressure panel with all children optional',
                },
            ],
            text: 'Blood pressure systolic & diastolic',
        },
        subject: {
            reference: `Patient/${fhirPatientId}`,
        },
        effectiveDateTime: moment(date)
            .utc()
            .toISOString(),
        component: [
            {
                code: {
                    coding: [
                        {
                            system: 'http://loinc.org',
                            code: '8480-6',
                            display: 'Systolic blood pressure',
                        },
                    ],
                },
                valueQuantity: {
                    value: parseInt(systolicBloodPressure, 10),
                    unit: 'mmHg',
                    system: 'http://unitsofmeasure.org',
                    code: 'mm[Hg]',
                },
            },
            {
                code: {
                    coding: [
                        {
                            system: 'http://loinc.org',
                            code: '8462-4',
                            display: 'Diastolic blood pressure',
                        },
                    ],
                },
                valueQuantity: {
                    value: parseInt(diastolicBloodPressure, 10),
                    unit: 'mmHg',
                    system: 'http://unitsofmeasure.org',
                    code: 'mm[Hg]',
                },
            },
        ],
    };

    const { idMap } = vitalsData;
    if (idMap && idMap.bloodPressure) {
        observation.id = idMap.bloodPressure;
    }

    return observation;
}

function mapToFHIRHeartRate(vitalsData) {
    const fhirPatientId = ProfileManager.activePatientId;
    if (!fhirPatientId) {
        throw new Error('Invalid patient id');
    }

    const { date, heartRate } = vitalsData;
    if (!date || !heartRate) {
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
                    code: '8867-4',
                    display: 'Heart rate',
                },
            ],
            text: 'Heart rate',
        },
        subject: {
            reference: `Patient/${fhirPatientId}`,
        },
        effectiveDateTime: moment(date)
            .utc()
            .toISOString(),
        valueQuantity: {
            value: parseInt(heartRate, 10),
            unit: 'beats/minute',
            system: 'http://unitsofmeasure.org',
            code: '/min',
        },
    };

    const { idMap } = vitalsData;
    if (idMap && idMap.heartRate) {
        observation.id = idMap.heartRate;
    }

    return observation;
}

function mapToFHIROxygenSaturation(vitalsData) {
    const fhirPatientId = ProfileManager.activePatientId;
    if (!fhirPatientId) {
        throw new Error('Invalid patient id');
    }

    const { date, oxygenSaturation } = vitalsData;
    if (!date || !oxygenSaturation) {
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
                    code: '2708-6',
                    display: 'Oxygen saturation in Arterial blood',
                },
            ],
            text: 'Oxygen saturation (SpO2)',
        },
        subject: {
            reference: `Patient/${fhirPatientId}`,
        },
        effectiveDateTime: moment(date)
            .utc()
            .toISOString(),
        valueQuantity: {
            value: parseInt(oxygenSaturation, 10),
            unit: '%',
            system: 'http://unitsofmeasure.org',
            code: '%',
        },
    };

    const { idMap } = vitalsData;
    if (idMap && idMap.oxygenSaturation) {
        observation.id = idMap.oxygenSaturation;
    }

    return observation;
}

function mapToFHIRBodyTemperature(vitalsData) {
    const fhirPatientId = ProfileManager.activePatientId;
    if (!fhirPatientId) {
        throw new Error('Invalid patient id');
    }

    const { date, bodyTemperature } = vitalsData;
    if (!date || !bodyTemperature) {
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
                    code: '8310-5',
                    display: 'Body temperature',
                },
            ],
            text: 'Body temperature',
        },
        subject: {
            reference: `Patient/${fhirPatientId}`,
        },
        effectiveDateTime: moment(date)
            .utc()
            .toISOString(),
        valueQuantity: {
            value: parseFloat(bodyTemperature),
            unit: '°C',
            system: 'http://unitsofmeasure.org',
            code: 'Cel',
        },
    };

    const { idMap } = vitalsData;
    if (idMap && idMap.bodyTemperature) {
        observation.id = idMap.bodyTemperature;
    }

    return observation;
}

function mapToFHIRVitalsPanel(vitalsData, observationIds) {
    const fhirPatientId = ProfileManager.activePatientId;
    if (!fhirPatientId) {
        throw new Error('Invalid patient id');
    }

    const { date } = vitalsData;
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
                    code: '85353-1',
                    display: 'Vital signs, weight, height, head circumference, oxygen saturation and BMI panel',
                },
            ],
            text: 'Vital signs panel including blood pressure, heart rate and oxygen saturation',
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

    const { idMap } = vitalsData;
    if (idMap && idMap.panel) {
        observation.id = idMap.panel;
    }

    return observation;
}

export {
    mapToFHIRBloodPressure,
    mapToFHIRHeartRate,
    mapToFHIROxygenSaturation,
    mapToFHIRVitalsPanel,
    mapToFHIRBodyTemperature,
};
