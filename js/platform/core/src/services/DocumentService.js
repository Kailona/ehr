import axios from 'axios';
import ConfigManager from '../managers/ConfigManager';
import ProfileManager from '../managers/ProfileManager';

export default class DocumentService {
    constructor() {
        this.baseUrl = ConfigManager.appConfig.settings.documentBaseUrl;
    }

    async import(file) {
        const url = `${this.baseUrl}/import`;
        const parent = ProfileManager.activePatientId;

        const formData = new FormData();
        formData.append('parent', parent);
        formData.append('file', file);

        return await axios.post(url, formData);
    }

    async fetch(offset, limit) {
        const url = `${this.baseUrl}/fetch`;
        const parent = ProfileManager.activePatientId;

        return await axios.post(url, {
            parent,
            offset,
            limit,
        });
    }
}
