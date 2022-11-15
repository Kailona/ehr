import axios from 'axios';
import ConfigManager from '../managers/ConfigManager';

export default class MailService {
    constructor() {
        this.baseUrl = ConfigManager.appConfig.settings.mailBaseUrl;
    }

    async sendRequestData(patientId, fromName, to, body) {
        const url = `${this.baseUrl}/requestdata`;

        const data = {
            patientId,
            fromName,
            to,
            body,
        };

        return await axios.post(url, data);
    }

    async sendExportData(patientId, fromName, to, body) {
        const url = `${this.baseUrl}/sendExportData`;

        const data = {
            patientId,
            fromName,
            to,
            body,
        };

        return await axios.post(url, data);
    }
}
