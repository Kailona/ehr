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

    async export(files) {
        const url = `${this.baseUrl}/export`;
        let folderName = '';
        const parent = ProfileManager.activePatientId;

        const formData = new FormData();
        formData.append('parent', parent);

        for (const file of files) {
            formData.append('file', file);
            folderName = await axios.post(url, formData);
        }

        // export the files one by one into same folder. Then create link for this folder.
        // TODO: files could be exported at the same time. Try it.
        return this.createExportLink(folderName.data);
    }

    async createExportLink(folderName) {
        const url = `${this.baseUrl}/createExportLink`;
        return await axios.post(url, {
            folderName: folderName,
        });
    }
}
