import axios from 'axios';
import deepMerge from 'lodash.merge';
import FHIRService from './FHIRService';
import ProfileManager from '../managers/ProfileManager';

export default class BaseResourceService {
    constructor(resourceType) {
        const fhirPatientId = ProfileManager.activePatientId;
        if (!fhirPatientId) {
            throw new Error('Invalid patient id');
        }

        this.fhirService = new FHIRService(resourceType);
        this.patientId = fhirPatientId;

        this.nextDataUrl = null;
    }

    get hasNextData() {
        return !!this.nextDataUrl;
    }

    async fetchData(params) {
        const { data: bundle } = await this.fhirService.search(params);
        if (!bundle || !bundle.entry) {
            return [];
        }

        // Cache url to retrieve next records, if exists
        const nextLink = bundle.link && bundle.link.length && bundle.link.find(l => l && l.relation === 'next');
        this.nextDataUrl = nextLink && nextLink.url;

        return bundle.entry;
    }

    async fetchNextData() {
        if (!this.nextDataUrl) {
            return [];
        }

        const url = this.nextDataUrl;

        // Remove url to retrieve next records while retrieving
        this.nextDataUrl = null;

        const { data: bundle } = await axios.get(url);

        if (!bundle || !bundle.entry) {
            return [];
        }

        // Cache url to retrieve next records, if exists
        const nextLink = bundle.link && bundle.link.length && bundle.link.find(l => l && l.relation === 'next');
        this.nextDataUrl = nextLink && nextLink.url;

        return bundle.entry;
    }

    async upsertData(resourceToUpsert) {
        if (!resourceToUpsert) {
            return null;
        }

        const { data: existingResource } =
            (!!resourceToUpsert.id && (await this.fhirService.read(resourceToUpsert.id))) || {};

        const newResourceToUpsert = deepMerge(existingResource || {}, resourceToUpsert);

        if (existingResource && existingResource.id) {
            await this.fhirService.update(resourceToUpsert.id, newResourceToUpsert);
            return existingResource.id;
        }

        const { data: newResource } = await this.fhirService.create(newResourceToUpsert);
        return newResource.id;
    }

    async removeData(resourceId) {
        await this.fhirService.delete(resourceId);
    }
}
