import { Logger, ConfigManager, FHIRService, UserManager } from '@kailona/core';

const logger = new Logger('main.initFHIRPatients');

export default async function initFHIRPatients() {
    try {
        const { id: appUserId, name: appUserName } = ConfigManager.appConfig.currentUser;
        const patientFhirService = new FHIRService('Patient');

        // Set app user id
        UserManager.userId = appUserId;

        const { data: patientBundle } = await patientFhirService.search([
            {
                identifier: appUserId,
            },
        ]);

        // Skip if patient exists in FHIR server
        if (patientBundle && patientBundle.entry && patientBundle.entry.length) {
            // Set fhir patient id
            const { id: patientId } = patientBundle.entry[0].resource;
            UserManager.patientId = patientId;
            return;
        }

        // Create patient in FHIR server
        await patientFhirService.create({
            resourceType: 'Patient',
            identifier: [
                {
                    use: 'usual',
                    value: appUserId,
                },
            ],
            active: true,
            name: [
                {
                    given: [appUserName],
                },
            ],
        });

        const { data: newPatientBundle } = await patientFhirService.search([
            {
                identifier: appUserId,
            },
        ]);

        // Set fhir patient id
        const { id: newPatientId } = newPatientBundle.entry[0].resource;
        UserManager.patientId = newPatientId;
    } catch (error) {
        logger.error('Failed to initialize FHIR Patients by user data', error);
    }
}
