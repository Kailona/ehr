import moment from 'moment';

function _mapLeukocytes(observation) {
    const { valueQuantity } = observation;
    const { value, unit } = valueQuantity || {};

    if (!value || !unit) {
        return {};
    }

    return {
        leukocytes: `${value} ${unit}`,
    };
}

function _mapHemoglobin(observation) {
    const { valueQuantity } = observation;
    const { value, unit } = valueQuantity || {};

    if (!value || !unit) {
        return {};
    }

    return {
        hemoglobin: `${value} ${unit}`,
    };
}

function _mapPlatelets(observation) {
    const { valueQuantity } = observation;
    const { value, unit } = valueQuantity || {};

    if (!value || !unit) {
        return {};
    }

    return {
        platelets: `${value} ${unit}`,
    };
}

function _mapObservations(observations, panelObservation) {
    let labsData = {};

    observations.forEach(observation => {
        const { coding } = (observation && observation.code) || {};
        const { code, system } = (coding && !!coding.length && coding[0]) || {};
        if (!code || !system) {
            return;
        }

        if (!observation.effectiveDateTime) {
            return;
        }

        labsData.idMap = labsData.idMap || {};

        labsData.date =
            labsData.date ||
            moment(observation.effectiveDateTime)
                .local()
                .format(`ddd, MMM D, YYYY, HH:mm`);

        // Leukocytes
        if (system === 'http://loinc.org' && code === '6690-2') {
            labsData.idMap.leukocytes = observation.id;
            labsData = Object.assign({}, labsData, _mapLeukocytes(observation));
        }

        // Hemoglobin
        if (system === 'http://loinc.org' && code === '718-7') {
            labsData.idMap.hemoglobin = observation.id;
            labsData = Object.assign({}, labsData, _mapHemoglobin(observation));
        }

        // Platelets
        if (system === 'http://loinc.org' && code === '32623-1') {
            labsData.idMap.platelets = observation.id;
            labsData = Object.assign({}, labsData, _mapPlatelets(observation));
        }

        // Set Short Blood Count Panel id if it belongs to one
        if (
            panelObservation &&
            panelObservation.hasMember &&
            panelObservation.hasMember.some(hm => hm.reference === `Observation/${observation.id}`)
        ) {
            labsData.idMap.panel = panelObservation.id;
        }
    });

    if (!Object.keys(labsData).length) {
        return null;
    }

    return labsData;
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

    const labsDataList = [];

    // Find blood count panel and add its id into each labs data
    Object.values(observationsByDateTime).forEach(observations => {
        // Get labs panels
        const labsPanelObservations = observations.filter(obs => {
            const { coding } = (obs && obs.code) || {};
            const { code, system } = (coding && !!coding.length && coding[0]) || {};
            //  Short blood count panel - Blood
            return system === 'http://loinc.org' && code === '55429-5';
        });

        if (labsPanelObservations && labsPanelObservations.length) {
            // Get individual labs from labs panel
            labsPanelObservations.forEach(labsPanelObservation => {
                const labsObservations = observations.filter(
                    obs =>
                        !labsPanelObservation ||
                        labsPanelObservation.hasMember.some(hm => hm.reference === `Observation/${obs.id}`)
                );

                const labsData = _mapObservations(labsObservations, labsPanelObservation);
                if (!labsData) {
                    return;
                }

                labsDataList.push(labsData);
            });
        } else {
            // Get individual labs directly since there is no panel
            const labsData = _mapObservations(observations, null);
            if (!labsData) {
                return;
            }

            labsDataList.push(labsData);
        }
    });

    return labsDataList;
}
