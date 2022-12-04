import moment from 'moment';
import { ProfileManager } from '@kailona/core';
import { GlucoseSystemCodes, getGlucoseSystemDisplay } from '../lib/GlucoseSystemCodes';
import convertToFloatWith2Digit from '../../../lib/twoDigitFloatConverter';

function mapToFHIRGlucose(diabetesData) {
    const fhirPatientId = ProfileManager.activePatientId;
    if (!fhirPatientId) {
        throw new Error('Invalid patient id');
    }

    const { date, glucoseValue, glucoseSystem = 'blood' } = diabetesData;
    if (!date || !glucoseValue) {
        return null;
    }

    const glucoseSystemCode = GlucoseSystemCodes[glucoseSystem];
    const glucoseDisplay = getGlucoseSystemDisplay(glucoseSystem);

    const observation = {
        resourceType: 'Observation',
        status: 'final',
        code: {
            coding: [
                {
                    system: glucoseSystemCode.split('|')[0],
                    code: glucoseSystemCode.split('|')[1],
                    display: glucoseDisplay,
                },
            ],
            text: 'Glucose',
        },
        subject: {
            reference: `Patient/${fhirPatientId}`,
        },
        effectiveDateTime: moment(date)
            .utc()
            .toISOString(),
        issued: moment()
            .utc()
            .toISOString(),
        valueQuantity: {
            value: convertToFloatWith2Digit(glucoseValue),
            unit: 'mmol/L',
            system: 'http://unitsofmeasure.org',
            code: 'mmol/L',
        },
    };

    const { idMap } = diabetesData;
    if (idMap && idMap.glucose) {
        observation.id = idMap.glucose;
    }

    return observation;
}

export { mapToFHIRGlucose };
