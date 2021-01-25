import { UserManager, FHIRService } from '@kailona/core';

export default class ActivitiesService {
    constructor() {
        const fhirPatientId = UserManager.patientId;
        if (!fhirPatientId) {
            throw new Error('Invalid patient id');
        }

        this.patientId = fhirPatientId;
    }

    async fetchActivities(params) {
        const fhirService = new FHIRService('Observation');

        const { data: bundle } = await fhirService.search([
            {
                patient: `Patient/${this.patientId}`,
                category: 'http://hl7.org/fhir/ValueSet/observation-category|activity',
            },
            ...params,
        ]);

        if (!bundle || !bundle.entry) {
            return [];
        }

        return bundle.entry.map(e => e.resource);
    }
}
