import PhysicalDataPlugin from '@kailona/plugin-physical-data';
import ActivitiesPlugin from '@kailona/plugin-activities';
import VitalsPlugin from '@kailona/plugin-vitals';
import DocumentsPlugin from '@kailona/plugin-documents';

export default {
    basename: '/apps/ehr',
    plugins: [PhysicalDataPlugin, ActivitiesPlugin, VitalsPlugin, DocumentsPlugin],
    settings: {
        fhirBaseUrl: OC.generateUrl('/apps/ehr/fhir'),
        adminSettingsUrl: OC.generateUrl('/apps/ehr/settings/admin'),
        mailBaseUrl: OC.generateUrl('/apps/ehr/mail'),
        documentBaseUrl: OC.generateUrl('/apps/ehr/documents'),
    },
    currentUser: {
        id: OC.getCurrentUser().uid,
        name: OC.getCurrentUser().displayName,
    },
};
