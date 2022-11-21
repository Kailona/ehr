import moment from 'moment';
import { ProfileManager } from '@kailona/core';

export default function mapTCXtoFHIR(tcxData) {
    const fhirPatientId = ProfileManager.activePatientId;
    if (!fhirPatientId) {
        throw new Error('Invalid patient id');
    }

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(tcxData, 'text/xml');

    const fhirObservations = [];

    const fhirBaseObservation = {
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
    };

    // TrainingCenterDatabase
    const trainingCenterDatabase = xmlDoc.getElementsByTagName('TrainingCenterDatabase')[0];

    // Author
    const author = trainingCenterDatabase.getElementsByTagName('Author')[0];
    const authorName = author.getElementsByTagName('Name')[0].textContent;

    // Activities
    const activities = trainingCenterDatabase.getElementsByTagName('Activities')[0];
    activities.getElementsByTagName('Activity').forEach(activity => {
        const notes = activity.getElementsByTagName('Notes')[0].textContent;

        const fhirBaseObservationActivity = Object.assign(fhirBaseObservation, {
            note: [
                {
                    authorString: authorName,
                    text: notes,
                },
            ],
        });

        activity.getElementsByTagName('Lap').forEach(lap => {
            const startTimeAttribute = lap.attributes['StartTime'];
            const startTime = startTimeAttribute && startTimeAttribute.value;
            if (!startTime) {
                return;
            }

            const totalTimeSecondsElements = lap.getElementsByTagName('TotalTimeSeconds');
            const totalTimeSeconds =
                totalTimeSecondsElements.length && parseInt(totalTimeSecondsElements[0].textContent);
            if (!totalTimeSeconds) {
                return;
            }

            const startTimeMoment = moment(startTime);
            const endTimeMoment = startTimeMoment.clone().add(totalTimeSeconds, 'seconds');

            const component = [];

            lap.childNodes.forEach(lapChildNode => {
                switch (lapChildNode.nodeName) {
                    case 'DistanceMeters':
                        component.push({
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
                                value: parseFloat(lapChildNode.textContent),
                                unit: 'm',
                                system: 'http://unitsofmeasure.org',
                                code: 'm',
                            },
                        });
                        break;
                    case 'Calories':
                        component.push({
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
                                value: parseFloat(lapChildNode.textContent),
                                unit: 'cal',
                                system: 'http://unitsofmeasure.org',
                                code: 'cal',
                            },
                        });
                        break;
                }
            });

            fhirObservations.push(
                Object.assign(fhirBaseObservationActivity, {
                    effectivePeriod: {
                        start: startTimeMoment.toISOString(),
                        end: endTimeMoment.toISOString(),
                    },
                    component,
                })
            );
        });
    });

    return fhirObservations;
}
