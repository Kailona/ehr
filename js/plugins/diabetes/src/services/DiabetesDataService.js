import { BaseResourceService } from '@kailona/core';
import mapFromFHIR from '../mappers/mapFromFHIR';
import { mapToFHIRGlucose } from '../mappers/mapToFHIR';

export default class DiabetesDataService extends BaseResourceService {
    constructor() {
        super('Observation');

        this.glucoseSystemCodes = {
            blood: 'http://loinc.org|15074-8', // Laboratory
            capillaryBloodByGlucometer: 'http://loinc.org|14743-9', // Glucose Test Strip
            bodyFluid: 'http://loinc.org|14745-4', // Continuous Glucose Monitoring (CGM) Device
        };
    }

    async fetchData(params) {
        const data = await super.fetchData([
            {
                patient: `Patient/${this.patientId}`,
                code: Object.values(this.glucoseSystemCodes).join(','),
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

        // Body Weight
        const bodyWeightObservationToUpsert = mapToFHIRGlucose(data);
        idMap.glucose = await super.upsertData(bodyWeightObservationToUpsert);

        return idMap;
    }
}
