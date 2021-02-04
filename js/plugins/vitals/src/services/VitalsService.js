import { BaseResourceService } from '@kailona/core';
import mapFromFHIR from '../mappers/mapFromFHIR';
import {
    mapToFHIRBloodPressure,
    mapToFHIRHeartRate,
    mapToFHIROxygenSaturation,
    mapToFHIRVitalsPanel,
} from '../mappers/mapToFHIR';

export default class VitalsService extends BaseResourceService {
    constructor() {
        super('Observation');
    }

    async fetchData(params) {
        const data = await super.fetchData([
            {
                patient: `Patient/${this.patientId}`,
                category: 'http://hl7.org/fhir/ValueSet/observation-category|vital-signs',
            },
            ...params,
        ]);
        return mapFromFHIR(data);
    }

    async fetchNextData() {
        const data = await super.fetchNextData();
        return mapFromFHIR(data);
    }

    async upsertData(data) {
        const idMap = {};

        // Blood Pressure
        const bloodPressureObservationToUpsert = mapToFHIRBloodPressure(data);
        idMap.bloodPressure = await super.upsertData(bloodPressureObservationToUpsert);

        // Heart Rate
        const heartRateObservationToUpsert = mapToFHIRHeartRate(data);
        idMap.heartRate = await super.upsertData(heartRateObservationToUpsert);

        // Oxygen Saturation
        const oxygenSaturationObservationToUpsert = mapToFHIROxygenSaturation(data);
        idMap.oxygenSaturation = await super.upsertData(oxygenSaturationObservationToUpsert);

        // Vitals Panel
        const observationIds = Object.values(idMap).filter(v => !!v);
        const vitalsPanelObservationToUpsert = mapToFHIRVitalsPanel(data, observationIds);
        idMap.panel = await super.upsertData(vitalsPanelObservationToUpsert);

        return idMap;
    }
}
