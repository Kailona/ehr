const GlucoseSystemCodes = {
    blood: 'http://loinc.org|15074-8', // Laboratory
    capillaryBloodByGlucometer: 'http://loinc.org|14743-9', // Glucometer
    bodyFluid: 'http://loinc.org|14745-4', // Continuous Glucose Monitoring (CGM) Device
};

function getGlucoseMeter(glucoseSystem) {
    switch (glucoseSystem) {
        case 'blood':
            return t('ehr', 'Laboratory');
        case 'capillaryBloodByGlucometer':
            return t('ehr', 'Glucometer');
        case 'bodyFluid':
            return t('ehr', 'CGM (Continuous Glucose Monitoring) Device');
        default:
            return t('ehr', 'Unknown');
    }
}

function getGlucoseSystemDisplay(glucoseSystem) {
    switch (glucoseSystem) {
        case 'blood':
            return 'Glucose [Moles/volume] in Blood';
        case 'capillaryBloodByGlucometer':
            return 'Glucose [Moles/volume] in Capillary blood by Glucometer';
        case 'bodyFluid':
            return 'Glucose [Moles/volume] in Body fluid';
        default:
            return 'Unknown';
    }
}

export { GlucoseSystemCodes, getGlucoseMeter, getGlucoseSystemDisplay };
