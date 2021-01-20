import { Logger, ConfigManager, FHIRService, ProfileManager, fhirDataFormatter } from '@kailona/core';

const logger = new Logger('main.initFHIRPatients');

const getRelatedPatients = async (patientFhirService, relatedPersons) => {
    if (!relatedPersons || !relatedPersons.length) {
        return [];
    }

    const promises = [];
    relatedPersons.forEach(relatedPerson => {
        const { patient, relationship } = relatedPerson; // TODO: pass relationship
        const [, patientId] = patient.reference.split('/');
        if (!patientId) {
            return;
        }

        const promise = patientFhirService.read(patientId);
        promises.push(promise);
    });

    const responses = await Promise.all(promises);
    return responses.map(res => res.data);
};

export default async function initFHIRPatients() {
    try {
        const { id: appUserId, name: appUserName } = ConfigManager.appConfig.currentUser;
        const patientFhirService = new FHIRService('Patient');

        // Set app user id
        ProfileManager.userId = appUserId;

        const { data: patientBundle } = await patientFhirService.search([
            {
                identifier: appUserId,
                _include: 'Patient:link',
            },
        ]);

        // Skip if patient exists in FHIR server
        if (patientBundle && patientBundle.entry && patientBundle.entry.length) {
            // Set active fhir patient id
            const { resource: patient } = patientBundle.entry.find(e => e.resource.resourceType === 'Patient');
            ProfileManager.activePatientId = patient.id;

            // Get fhir patient profiles
            const relatedPersons = patientBundle.entry
                .filter(e => e.resource.resourceType === 'RelatedPerson')
                .map(p => p.resource);

            const relatedPatients = await getRelatedPatients(patientFhirService, relatedPersons);

            ProfileManager.profiles = [patient, ...relatedPatients].map(p => ({
                patientId: p.id,
                patientFullName: fhirDataFormatter.formatPatientName(p.name),
                relationship:
                    p.id === patient.id ? t('ehr', 'self') : fhirDataFormatter.formatCodeableConcept(p.relationship),
            }));

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

        // Set active fhir patient id and profiles
        const { resource: newPatient } = newPatientBundle.entry[0];
        ProfileManager.activePatientId = newPatient.id;
        ProfileManager.profiles = [newPatient].map(p => ({
            patientId: p.id,
            patientFullName: fhirDataFormatter.formatPatientName(p.name),
            relationship: t('ehr', 'self'),
        }));
    } catch (error) {
        logger.error('Failed to initialize FHIR Patients by user data', error);
    }
}
