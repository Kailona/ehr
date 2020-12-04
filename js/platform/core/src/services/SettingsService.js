import axios from 'axios';
import ConfigManager from '../managers/ConfigManager';

export default class SettingsService {
    constructor() {
        this.adminSettingsUrl = ConfigManager.appConfig.settings.adminSettingsUrl;
    }

    async retrieveAdminSettings() {
        return await axios.get(this.adminSettingsUrl);
    }

    async saveAdminSettings(settings) {
        return await axios.post(this.adminSettingsUrl, settings);
    }
}
