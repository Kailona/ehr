import { FHIRService, ProfileManager, readFileAsText } from '@kailona/core';

function replacePatientIds(fhirResource, fhirPatientId) {
    if (fhirResource.resourceType === 'Observation') {
        fhirResource.subject = {
            reference: `Patient/${fhirPatientId}`,
        };
    }

    // TODO: Add patient id replacement for other resources

    if (fhirResource.resourceType === 'Bundle' && fhirResource.entry) {
        fhirResource.entry.forEach(entry => {
            if (entry && entry.resource) {
                replacePatientIds(entry.resource, fhirPatientId);
            }
        });
    }
}

export async function importJSON(file) {
    const fileAsText = await readFileAsText(file);
    const fhirResource = JSON.parse(fileAsText);

    const { resourceType, type } = fhirResource || {};
    if (!resourceType) {
        console.error('Invalid FHIR data');
        return false;
    }

    const fhirPatientId = ProfileManager.activePatientId;
    if (!fhirPatientId) {
        console.error('Invalid FHIR Patient Id');
        return false;
    }

    try {
        let bundleResource;

        replacePatientIds(fhirResource, fhirPatientId);

        if (resourceType === 'Bundle' && (type === 'transaction' || type === 'batch')) {
            bundleResource = fhirResource;
        } else {
            bundleResource = {
                resourceType: 'Bundle',
                type: 'transaction',
                entry: [
                    {
                        resource: fhirResource,
                        request: {
                            method: 'POST',
                            url: resourceType,
                        },
                    },
                ],
            };
        }

        const fhirService = new FHIRService();
        await fhirService.transaction(bundleResource);

        return true;
    } catch (error) {
        console.error('Failed to import data', error);
    }

    return false;
}
