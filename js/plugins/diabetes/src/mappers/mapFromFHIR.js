import moment from 'moment';
import { GlucoseSystemCodes, getGlucoseMeasurer } from '../lib/GlucoseSystemCodes';

function _getValueQuantity(observation) {
    const { valueQuantity } = observation;
    const { value, unit } = valueQuantity || {};

    if (!value || !unit) {
        return {};
    }

    return `${value} ${unit}`;
}

function _mapObservations(observations) {
    let diabetes = {};

    observations.forEach(observation => {
        const { coding } = (observation && observation.code) || {};
        const { code, system } = (coding && !!coding.length && coding[0]) || {};
        if (!code || !system) {
            return;
        }

        if (!observation.effectiveDateTime) {
            return;
        }

        diabetes.idMap = diabetes.idMap || {};

        diabetes.date =
            diabetes.date ||
            moment(observation.effectiveDateTime)
                .local()
                .format(`ddd, MMM D, YYYY, HH:mm`);

        // Glucose
        const glucoseSystem = Object.keys(GlucoseSystemCodes).find(k => GlucoseSystemCodes[k] === `${system}|${code}`);
        diabetes.idMap.glucose = observation.id;
        diabetes = Object.assign({}, diabetes, {
            glucoseValue: _getValueQuantity(observation),
            glucoseSystem,
            glucoseMeasurer: getGlucoseMeasurer(glucoseSystem),
        });
    });

    if (!Object.keys(diabetes).length) {
        return null;
    }

    return diabetes;
}

export default function mapFromFHIR(observationBundleEntry) {
    // Group observations by effectiveDateTime
    const observationsByDateTime = observationBundleEntry.reduce((acc, obs) => {
        const { resource } = obs || {};
        const { effectiveDateTime } = resource || {};
        if (!effectiveDateTime) {
            return acc;
        }

        acc[effectiveDateTime] = acc[effectiveDateTime] || [];
        acc[effectiveDateTime].push(resource);
        return acc;
    }, {});

    const glucoseList = [];

    // Find Diabetes values in Observations
    Object.values(observationsByDateTime).forEach(observations => {
        // Glucose
        const glucoseObservations = observations.filter(obs => {
            const { coding } = (obs && obs.code) || {};
            const { code, system } = (coding && !!coding.length && coding[0]) || {};
            return Object.values(GlucoseSystemCodes).includes(`${system}|${code}`);
        });

        const glucose = _mapObservations(glucoseObservations);
        if (glucose) {
            glucoseList.push(glucose);
        }
    });

    return glucoseList;
}
