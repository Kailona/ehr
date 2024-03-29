import moment from 'moment';
import { ProfileManager } from '@kailona/core';
import convertToFloatWith2Digit from '../../../lib/twoDigitFloatConverter';

export default function mapToFHIR(activitiesData) {
    const fhirPatientId = ProfileManager.activePatientId;
    if (!fhirPatientId) {
        throw new Error('Invalid patient id');
    }

    const { datePeriod, steps, distance, calories } = activitiesData;
    if (!datePeriod || (!steps && !distance && !calories)) {
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
                        code: 'activity',
                        display: 'Activity',
                    },
                ],
            },
        ],
        code: {
            coding: [
                {
                    system: 'http://loinc.org',
                    code: '62812-3',
                    display: 'Physical activity and physical fitness',
                },
            ],
            text: 'Activity',
        },
        subject: {
            reference: `Patient/${fhirPatientId}`,
        },
        effectivePeriod: {
            start: moment(datePeriod.start)
                .utc()
                .toISOString(),
            end: moment(datePeriod.end)
                .utc()
                .toISOString(),
        },
        component: [],
    };

    if (steps) {
        observation.component.push({
            code: {
                coding: [
                    {
                        system: 'http://loinc.org',
                        code: '55423-8',
                        display: 'Number of steps in unspecified time Pedometer',
                    },
                ],
                text: 'Steps',
            },
            valueQuantity: {
                value: parseInt(steps, 10),
            },
        });
    }

    if (distance) {
        observation.component.push({
            code: {
                coding: [
                    {
                        system: 'http://loinc.org',
                        code: '55430-3',
                        display: 'Walking distance',
                    },
                ],
                text: 'Distance',
            },
            valueQuantity: {
                value: convertToFloatWith2Digit(distance),
                unit: 'm',
                system: 'http://unitsofmeasure.org',
                code: 'm',
            },
        });
    }

    if (calories) {
        observation.component.push({
            code: {
                coding: [
                    {
                        system: 'http://loinc.org',
                        code: '55421-2',
                        display: 'Calories burned',
                    },
                ],
                text: 'Calories',
            },
            valueQuantity: {
                value: convertToFloatWith2Digit(calories),
                unit: 'cal',
                system: 'http://unitsofmeasure.org',
                code: 'cal',
            },
        });
    }

    if (activitiesData.id) {
        observation.id = activitiesData.id;
    }

    return observation;
}
