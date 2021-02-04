import { BaseResourceService } from '@kailona/core';
import mapFromFHIR from '../mappers/mapFromFHIR';
import {
    mapToFHIRBodyWeight,
    mapToFHIRBodyHeight,
    mapToFHIRBMI,
    mapToFHIRPhysicalDataPanel,
} from '../mappers/mapToFHIR';

export default class PhysicalDataService extends BaseResourceService {
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

        // Body Weight
        const bodyWeightObservationToUpsert = mapToFHIRBodyWeight(data);
        idMap.bodyWeight = await super.upsertData(bodyWeightObservationToUpsert);

        // Body Height
        const bodyHeightObservationToUpsert = mapToFHIRBodyHeight(data);
        idMap.bodyHeight = await super.upsertData(bodyHeightObservationToUpsert);

        // BMI
        const bodyWeightHeightIds = [idMap.bodyWeight, idMap.bodyHeight].filter(v => !!v);
        const bmiObservationToUpsert = mapToFHIRBMI(data, bodyWeightHeightIds);
        idMap.bmi = await super.upsertData(bmiObservationToUpsert);

        // Physical Data Panel
        const observationIds = Object.values(idMap).filter(v => !!v);
        const physicalDataPanelObservationToUpsert = mapToFHIRPhysicalDataPanel(data, observationIds);
        idMap.panel = await super.upsertData(physicalDataPanelObservationToUpsert);

        return idMap;
    }
}
