import PhysicalDataPlugin from '@kailona/plugin-physical-data';
import ActivitiesPlugin from '@kailona/plugin-activities';

export default {
    basename: '/apps/ehr',
    plugins: [PhysicalDataPlugin, ActivitiesPlugin],
    settings: {
        fhirBaseUrl: OC.generateUrl('/apps/ehr'),
        adminSettingsUrl: `${OC.generateUrl('/apps/ehr')}/settings/admin`,
    },
    currentUser: {
        id: OC.getCurrentUser().uid,
        name: OC.getCurrentUser().displayName,
    },
};
