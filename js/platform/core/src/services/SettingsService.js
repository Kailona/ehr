import axios from 'axios';

export default class SettingsService {
    constructor(options) {
        const { adminSettingsUrl } = options || {};
        this.adminSettingsUrl = adminSettingsUrl || `${OC.generateUrl('/apps/ehr')}/settings/admin`;
    }

    async retrieveAdminSettings() {
        return await axios.get(this.adminSettingsUrl);
    }

    async saveAdminSettings(settings) {
        return await axios.post(this.adminSettingsUrl, settings);
    }
}
