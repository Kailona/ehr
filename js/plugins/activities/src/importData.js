import { Logger, readFileAsText, FHIRService } from '@kailona/core';
import mapTCXtoFHIR from './mappers/mapTCXtoFHIR';

const logger = new Logger('Activities.importData');

/**
 * Import activities data from TCX file
 *
 * @param file
 */
export default async function importData(file) {
    try {
        const fileAsText = await readFileAsText(file);

        // Map TCX into FHIR Observations
        const observations = mapTCXtoFHIR(fileAsText);

        // Store FHIR Observations
        const fhirCreateObservationsBundle = {
            resourceType: 'Bundle',
            type: 'transaction',
            entry: observations.map(resource => ({
                resource,
                request: {
                    method: 'POST',
                    url: 'Observation',
                },
            })),
        };

        const fhirService = new FHIRService();
        await fhirService.transaction(fhirCreateObservationsBundle);

        return true;
    } catch (error) {
        logger.error('Failed to import data', error);
    }

    return false;
}
