import { readFileAsText, FHIRService } from '@kailona/core';

export async function importJSON(file) {
    const fileAsText = await readFileAsText(file);
    const fileAsJSON = JSON.parse(fileAsText);
    const { resourceType, type } = fileAsJSON;

    try {
        if (!resourceType) {
            throw 'File must have a resourceType value';
        }

        let transactionFile;

        if (resourceType === 'Bundle' && type && type === 'transaction') {
            transactionFile = fileAsJSON;
        } else {
            transactionFile = {
                resourceType: 'Bundle',
                type: 'transaction',
                entry: [
                    {
                        resource: { ...fileAsJSON },
                        request: {
                            method: 'POST',
                            url: resourceType, // resourceType
                        },
                    },
                ],
            };
        }

        const fhirService = new FHIRService();
        await fhirService.transaction(transactionFile);
        return true;
    } catch (error) {
        console.error('Failed to import data', error);
    }
    return false;
}
