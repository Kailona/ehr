import axios from 'axios';
import ConfigManager from '../managers/ConfigManager';

export default class MailService {
    constructor() {
        this.baseUrl = ConfigManager.appConfig.settings.mailBaseUrl;
    }

    async sendRequestData(fromName, to, body) {
        const url = `${this.baseUrl}/requestdata`;

        const data = {
            fromName,
            to,
            body,
        };

        return await axios.post(url, data);
    }
}
