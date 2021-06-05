import { BaseResourceService } from '@kailona/core';
import mapFromFHIR from '../mappers/mapFromFHIR';
import { mapToFHIRLeukocytes, mapToFHIRHemoglobin, mapToFHIRPlatelets, mapToFHIRSBCPanel } from '../mappers/mapToFHIR';

export default class LaboratoryService extends BaseResourceService {
    constructor() {
        super('Observation');
    }

    async fetchData(params) {
        const data = await super.fetchData([
            {
                patient: `Patient/${this.patientId}`,
                category: 'http://hl7.org/fhir/ValueSet/observation-category|laboratory',
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

        // Leukocytes
        const leukocytesObservationToUpsert = mapToFHIRLeukocytes(data);
        idMap.leukocytes = await super.upsertData(leukocytesObservationToUpsert);

        // Hemoglobin
        const hemoglobinObservationToUpsert = mapToFHIRHemoglobin(data);
        idMap.hemoglobin = await super.upsertData(hemoglobinObservationToUpsert);

        // Platelets
        const plateletsObservationToUpsert = mapToFHIRPlatelets(data);
        idMap.platelets = await super.upsertData(plateletsObservationToUpsert);

        // Short Blood Count Panel
        const observationIds = Object.values(idMap).filter(v => !!v);
        const sbcPanelObservationToUpsert = mapToFHIRSBCPanel(data, observationIds);
        idMap.panel = await super.upsertData(sbcPanelObservationToUpsert);

        return idMap;
    }
}
