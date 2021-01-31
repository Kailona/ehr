import PhysicalDataPlugin from '@kailona/plugin-physical-data';
import ActivitiesPlugin from '@kailona/plugin-activities';
import VitalsPlugin from '@kailona/plugin-vitals';

export default {
    basename: '/apps/ehr',
    plugins: [PhysicalDataPlugin, ActivitiesPlugin, VitalsPlugin],
    settings: {
        fhirBaseUrl: OC.generateUrl('/apps/ehr/fhir'),
        adminSettingsUrl: OC.generateUrl('/apps/ehr/settings/admin'),
        mailBaseUrl: OC.generateUrl('/apps/ehr/mail'),
    },
    currentUser: {
        id: OC.getCurrentUser().uid,
        name: OC.getCurrentUser().displayName,
    },
};
