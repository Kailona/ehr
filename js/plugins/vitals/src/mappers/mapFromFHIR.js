import moment from 'moment';

function _mapBloodPressure(observation) {
    let systolicBloodPressure = null;
    let diastolicBloodPressure = null;

    const { component } = observation;
    component.forEach(componentItem => {
        const { code: componentCode, valueQuantity } = componentItem;

        const { coding } = componentCode || {};
        const { code, system } = (coding && !!coding.length && coding[0]) || {};

        const { value, unit } = valueQuantity || {};

        if (!code || !system || !value || !unit) {
            return;
        }

        if (system === 'http://loinc.org' && code === '8480-6') {
            systolicBloodPressure = `${value} ${unit}`;
        } else if (system === 'http://loinc.org' && code === '8462-4') {
            diastolicBloodPressure = `${value} ${unit}`;
        }
    });

    if (!systolicBloodPressure || !diastolicBloodPressure) {
        return {};
    }

    return {
        systolicBloodPressure,
        diastolicBloodPressure,
    };
}

function _mapHeartRate(observation) {
    const { valueQuantity } = observation;
    const { value, unit } = valueQuantity || {};

    if (!value || !unit) {
        return {};
    }

    return {
        heartRate: `${value} ${unit}`,
    };
}

function _mapOxygenSaturation(observation) {
    const { valueQuantity } = observation;
    const { value, unit } = valueQuantity || {};

    if (!value || !unit) {
        return {};
    }

    return {
        oxygenSaturation: `${value} ${unit}`,
    };
}

function _mapObservations(observations, panelObservation) {
    let vitalsData = {};

    observations.forEach(observation => {
        const { coding } = (observation && observation.code) || {};
        const { code, system } = (coding && !!coding.length && coding[0]) || {};
        if (!code || !system) {
            return;
        }

        if (!observation.effectiveDateTime) {
            return;
        }

        vitalsData.idMap = vitalsData.idMap || {};

        vitalsData.date =
            vitalsData.date ||
            moment(observation.effectiveDateTime)
                .local()
                .format(`ddd, MMM D, YYYY, HH:mm`);

        // Blood Pressure
        if (system === 'http://loinc.org' && code === '85354-9') {
            vitalsData.idMap.bloodPressure = observation.id;
            vitalsData = Object.assign({}, vitalsData, _mapBloodPressure(observation));
        }

        // Heart Rate
        if (system === 'http://loinc.org' && code === '8867-4') {
            vitalsData.idMap.heartRate = observation.id;
            vitalsData = Object.assign({}, vitalsData, _mapHeartRate(observation));
        }

        // Oxygen Saturation
        if (system === 'http://loinc.org' && code === '2708-6') {
            vitalsData.idMap.oxygenSaturation = observation.id;
            vitalsData = Object.assign({}, vitalsData, _mapOxygenSaturation(observation));
        }

        // Set Vitals Panel id if it belongs to one
        if (
            panelObservation &&
            panelObservation.hasMember &&
            panelObservation.hasMember.some(hm => hm.reference === `Observation/${observation.id}`)
        ) {
            vitalsData.idMap.panel = panelObservation.id;
        }
    });

    if (!Object.keys(vitalsData).length) {
        return null;
    }

    return vitalsData;
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

    const vitalsDataList = [];

    // Find vitals panel and add its id into each vitals data
    Object.values(observationsByDateTime).forEach(observations => {
        const vitalsPanelObservation = observations.find(obs => {
            const { coding } = (obs && obs.code) || {};
            const { code, system } = (coding && !!coding.length && coding[0]) || {};
            return system === 'http://loinc.org' && code === '85353-1';
        });

        const vitalsObservations = observations.filter(
            obs => !vitalsPanelObservation || obs.id !== vitalsPanelObservation.id
        );

        const vitalsData = _mapObservations(vitalsObservations, vitalsPanelObservation);
        if (!vitalsData) {
            return;
        }

        vitalsDataList.push(vitalsData);
    });

    return vitalsDataList;
}
