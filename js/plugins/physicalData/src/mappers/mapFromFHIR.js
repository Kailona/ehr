import moment from 'moment';

function _getValueQuantity(observation) {
    const { valueQuantity } = observation;
    const { value, unit } = valueQuantity || {};

    if (!value || !unit) {
        return {};
    }

    return `${value} ${unit}`;
}

function _mapObservations(observations, panelObservation) {
    let physicalData = {};

    observations.forEach(observation => {
        const { coding } = (observation && observation.code) || {};
        const { code, system } = (coding && !!coding.length && coding[0]) || {};
        if (!code || !system) {
            return;
        }

        if (!observation.effectiveDateTime) {
            return;
        }

        physicalData.idMap = physicalData.idMap || {};

        physicalData.date =
            physicalData.date ||
            moment(observation.effectiveDateTime)
                .local()
                .format(`ddd, MMM D, YYYY, HH:mm`);

        // Weight
        if (system === 'http://loinc.org' && code === '29463-7') {
            physicalData.idMap.bodyWeight = observation.id;
            physicalData = Object.assign({}, physicalData, {
                bodyWeight: _getValueQuantity(observation),
            });
        }

        // Height
        if (system === 'http://loinc.org' && code === '8302-2') {
            physicalData.idMap.bodyHeight = observation.id;
            physicalData = Object.assign({}, physicalData, {
                bodyHeight: _getValueQuantity(observation),
            });
        }

        // BMI
        if (system === 'http://loinc.org' && code === '39156-5') {
            physicalData.idMap.bmi = observation.id;
            physicalData = Object.assign({}, physicalData, {
                bmi: _getValueQuantity(observation),
            });
        }

        // Set Physical Data Panel id if it belongs to one
        if (
            panelObservation &&
            panelObservation.hasMember &&
            panelObservation.hasMember.some(hm => hm.reference === `Observation/${observation.id}`)
        ) {
            physicalData.idMap.panel = panelObservation.id;
        }
    });

    if (!Object.keys(physicalData).length) {
        return null;
    }

    return physicalData;
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

    const physicalDataList = [];

    // Find physical data panel and add its id into each physical data items (weight, height and bmi)
    Object.values(observationsByDateTime).forEach(observations => {
        // Get physical data panels
        const physicalDataPanelObservations = observations.filter(obs => {
            const { coding } = (obs && obs.code) || {};
            const { code, system } = (coding && !!coding.length && coding[0]) || {};
            // Vital signs, weight and height panel
            return system === 'http://loinc.org' && code === '34565-2';
        });

        // Get individual physical data items (weight, height and bmi) from physical data panel
        physicalDataPanelObservations.forEach(physicalDataPanelObservation => {
            const physicalDataObservations = observations.filter(
                obs =>
                    !physicalDataPanelObservation ||
                    physicalDataPanelObservation.hasMember.some(hm => hm.reference === `Observation/${obs.id}`)
            );

            const physicalData = _mapObservations(physicalDataObservations, physicalDataPanelObservation);
            if (!physicalData) {
                return;
            }

            physicalDataList.push(physicalData);
        });
    });

    return physicalDataList;
}
