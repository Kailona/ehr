import { BaseResourceService } from '@kailona/core';
import mapFromFHIR from '../mappers/mapFromFHIR';
import mapToFHIR from '../mappers/mapToFHIR';

export default class ActivitiesService extends BaseResourceService {
    constructor() {
        super('Observation');
    }

    async fetchData(params) {
        const data = await super.fetchData([
            {
                patient: `Patient/${this.patientId}`,
                category: 'http://hl7.org/fhir/ValueSet/observation-category|activity',
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
        const observationToUpsert = mapToFHIR(data);
        return await super.upsertData(observationToUpsert);
    }

    async upsertDataFromGoogleFit(data, params) {
        const checkIsDataValid = await this.fetchData(params);
        if (!!checkIsDataValid.length) return;

        const observationToUpsert = mapToFHIR(data);
        return await super.upsertData(observationToUpsert);
    }
}
