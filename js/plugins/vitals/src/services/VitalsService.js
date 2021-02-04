import { ProfileManager, FHIRService } from '@kailona/core';
import axios from 'axios';
import deepMerge from 'lodash.merge';
import mapFromFHIR from '../mappers/mapFromFHIR';
import {
    mapToFHIRBloodPressure,
    mapToFHIRHeartRate,
    mapToFHIROxygenSaturation,
    mapToFHIRVitalsPanel,
} from '../mappers/mapToFHIR';

export default class VitalsService {
    constructor() {
        const fhirPatientId = ProfileManager.activePatientId;
        if (!fhirPatientId) {
            throw new Error('Invalid patient id');
        }

        this.fhirService = new FHIRService('Observation');
        this.patientId = fhirPatientId;

        this.nextVitalsUrl = null;
    }

    get hasNextVitals() {
        return !!this.nextVitalsUrl;
    }

    async _upsertObservation(observationToUpsert) {
        if (!observationToUpsert) {
            return null;
        }

        const { data: existingObservation } =
            (!!observationToUpsert.id && (await this.fhirService.read(observationToUpsert.id))) || {};

        const newObservation = deepMerge(existingObservation || {}, observationToUpsert);

        if (existingObservation && existingObservation.id) {
            await this.fhirService.update(observationToUpsert.id, newObservation);
            return existingObservation.id;
        }

        const { data: newBloodPressureObservation } = await this.fhirService.create(newObservation);
        return newBloodPressureObservation.id;
    }

    async fetchVitals(params) {
        const { data: bundle } = await this.fhirService.search([
            {
                patient: `Patient/${this.patientId}`,
                category: 'http://hl7.org/fhir/ValueSet/observation-category|vital-signs',
            },
            ...params,
        ]);

        if (!bundle || !bundle.entry) {
            return [];
        }

        // Cache url to retrieve next records, if exists
        const nextLink = bundle.link && bundle.link.length && bundle.link.find(l => l && l.relation === 'next');
        this.nextVitalsUrl = nextLink && nextLink.url;

        return mapFromFHIR(bundle.entry);
    }

    async fetchNextVitals() {
        if (!this.nextVitalsUrl) {
            return [];
        }

        const url = this.nextVitalsUrl;

        // Remove url to retrieve next records while retrieving
        this.nextVitalsUrl = null;

        const { data: bundle } = await axios.get(url);

        if (!bundle || !bundle.entry) {
            return [];
        }

        // Cache url to retrieve next records, if exists
        const nextLink = bundle.link && bundle.link.length && bundle.link.find(l => l && l.relation === 'next');
        this.nextVitalsUrl = nextLink && nextLink.url;

        return mapFromFHIR(bundle.entry);
    }

    async upsertVitals(vitalsData) {
        const idMap = {};

        // Blood Pressure
        const bloodPressureObservationToUpdate = mapToFHIRBloodPressure(vitalsData);
        idMap.bloodPressure = await this._upsertObservation(bloodPressureObservationToUpdate);

        // Heart Rate
        const heartRateObservationToUpdate = mapToFHIRHeartRate(vitalsData);
        idMap.heartRate = await this._upsertObservation(heartRateObservationToUpdate);

        // Oxygen Saturation
        const oxygenSaturationObservationToUpdate = mapToFHIROxygenSaturation(vitalsData);
        idMap.oxygenSaturation = await this._upsertObservation(oxygenSaturationObservationToUpdate);

        // Vitals Panel
        const observationIds = Object.values(idMap).filter(v => !!v);
        const vitalsPanelObservationToUpdate = mapToFHIRVitalsPanel(vitalsData, observationIds);
        idMap.panel = await this._upsertObservation(vitalsPanelObservationToUpdate);

        return idMap;
    }

    async removeVitals(resourceId) {
        await this.fhirService.delete(resourceId);
    }
}
