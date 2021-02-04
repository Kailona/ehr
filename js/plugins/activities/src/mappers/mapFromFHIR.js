import moment from 'moment';

function _mapActivityObservation(observation) {
    let datePeriod = null;
    let steps = null;
    let distance = null;
    let calories = null;

    const { start, end } = observation.effectivePeriod || {};
    if (start && end) {
        datePeriod = {
            start: moment(start).local(),
            end: moment(end).local(),
        };
    }

    if (!datePeriod) {
        return null;
    }

    const { component } = observation;
    component.forEach(componentItem => {
        const { code: componentCode, valueQuantity } = componentItem;

        const { coding } = componentCode || {};
        const { code, system } = (coding && !!coding.length && coding[0]) || {};

        const { value, unit = '' } = valueQuantity || {};

        if (!code || !system || !value) {
            return;
        }

        if (system === 'http://loinc.org' && code === '55423-8') {
            steps = value;
        } else if (system === 'http://loinc.org' && code === '55430-3') {
            distance = `${value} ${unit}`;
        } else if (system === 'http://loinc.org' && code === '55421-2') {
            calories = `${value} ${unit}`;
        }
    });

    if (!steps && !distance && !calories) {
        return null;
    }

    return {
        id: observation.id,
        datePeriod,
        steps,
        distance,
        calories,
    };
}

export default function mapFromFHIR(observationBundleEntry) {
    const activities = [];

    observationBundleEntry.forEach(bundleEntry => {
        const { resource: observation } = bundleEntry;
        const activity = _mapActivityObservation(observation);
        if (!activity) {
            return;
        }

        activities.push(activity);
    });

    return activities;
}
