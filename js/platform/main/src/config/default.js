import ProfilePlugin from '@kailona/plugin-profile';

export default {
    plugins: [ProfilePlugin],
    settings: {
        fhirBaseUrl: OC.generateUrl('/apps/ehr'),
        adminSettingsUrl: `${OC.generateUrl('/apps/ehr')}/settings/admin`,
    },
    currentUser: {
        id: OC.getCurrentUser().uid,
        name: OC.getCurrentUser().displayName,
    },
};
