import axios from 'axios';
import ConfigManager from '../managers/ConfigManager';

export default class FHIRService {
    constructor(resourceType) {
        this.baseUrl = ConfigManager.appConfig.settings.fhirBaseUrl;
        this.resourceType = resourceType;
    }

    _mapFilterToQueryParams(filter) {
        if (!filter) {
            return '';
        }

        let queryParams = '';
        Object.keys(filter).forEach(filterName => {
            const filterValue = filter[filterName];
            const queryParam = `${encodeURI(filterName)}=${encodeURI(filterValue)}`;
            queryParams += queryParams.length ? `&${queryParam}` : queryParam;
        });

        return queryParams;
    }

    async create(resource) {
        const url = `${this.baseUrl}/fhir/${this.resourceType}`;
        return await axios.post(url, resource);
    }

    async read(id) {
        const url = `${this.baseUrl}/fhir/${this.resourceType}/${id}`;
        return await axios.get(url);
    }

    async vread(id, vid) {
        const url = `${this.baseUrl}/fhir/${this.resourceType}/${id}/_history/${vid}`;
        return await axios.get(url);
    }

    async update(id, resource) {
        const url = `${this.baseUrl}/fhir/${this.resourceType}/${id}`;
        return await axios.put(url, resource);
    }

    async patch(id, patch) {
        const url = `${this.baseUrl}/fhir/${this.resourceType}/${id}`;
        return await axios.patch(url, patch);
    }

    async delete(id) {
        const url = `${this.baseUrl}/fhir/${this.resourceType}/${id}`;
        return await axios.delete(url);
    }

    async history(id) {
        const url = `${this.baseUrl}/fhir/${this.resourceType}/${id}/_history`;
        return await axios.get(url);
    }

    async search(filter) {
        let url = `${this.baseUrl}/fhir/${this.resourceType}`;

        // Append query string parameters if exists
        const queryParams = this._mapFilterToQueryParams(filter);
        if (queryParams) {
            url += `?${queryParams}`;
        }

        return await axios.get(url);
    }
}
