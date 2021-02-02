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

    async _upsertObservation(observationToUpsert) {
        const { data: existingObservation } = await this.fhirService.read(observationToUpsert.id);

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

        // Keep url to retrieve next records, if exists
        const nextLink = bundle.link && !bundle.link.length && bundle.link.find(l => l && l.relation === 'next');
        this.nextVitalsUrl = nextLink && nextLink.url;

        return mapFromFHIR(bundle.entry);
    }

    async fetchNextVitals() {
        if (!this.nextVitalsUrl) {
            return [];
        }

        const { data: bundle } = await axios.get(this.nextVitalsUrl);

        if (!bundle || !bundle.entry) {
            return [];
        }

        return mapFromFHIR(bundle.entry);
    }

    async addVitals(vitalsData) {
        const idMap = {};

        // Blood Pressure
        const bloodPressureObservationToAdd = mapToFHIRBloodPressure(vitalsData);
        const { data: bloodPressureObservation } = await this.fhirService.create(bloodPressureObservationToAdd);
        idMap.bloodPressure = bloodPressureObservation.id;

        // Heart Rate
        const heartRateObservationToAdd = mapToFHIRHeartRate(vitalsData);
        const { data: heartRateObservation } = await this.fhirService.create(heartRateObservationToAdd);
        idMap.heartRate = heartRateObservation.id;

        // Oxygen Saturation
        const oxygenSaturationObservationToAdd = mapToFHIROxygenSaturation(vitalsData);
        const { data: oxygenSaturationObservation } = await this.fhirService.create(oxygenSaturationObservationToAdd);
        idMap.oxygenSaturation = oxygenSaturationObservation.id;

        // Vitals Panel
        const vitalsPanelObservationToAdd = mapToFHIRVitalsPanel(vitalsData, Object.values(idMap));
        const { data: vitalsPanelObservation } = await this.fhirService.create(vitalsPanelObservationToAdd);
        idMap.panel = vitalsPanelObservation.id;

        return idMap;
    }

    async updateVitals(vitalsData) {
        const idMap = {};

        // Blood Pressure
        const bloodPressureObservationToUpdate = mapToFHIRBloodPressure(vitalsData);
        idMap.bloodPressure = this._upsertObservation(bloodPressureObservationToUpdate);

        // Heart Rate
        const heartRateObservationToUpdate = mapToFHIRHeartRate(vitalsData);
        idMap.heartRate = this._upsertObservation(heartRateObservationToUpdate);

        // Oxygen Saturation
        const oxygenSaturationObservationToUpdate = mapToFHIROxygenSaturation(vitalsData);
        idMap.oxygenSaturation = this._upsertObservation(oxygenSaturationObservationToUpdate);

        // Vitals Panel
        const vitalsPanelObservationToUpdate = mapToFHIRVitalsPanel(vitalsData, Object.values(idMap));
        idMap.panel = this._upsertObservation(vitalsPanelObservationToUpdate);

        return idMap;
    }

    async removeVitals(resourceId) {
        await this.fhirService.delete(resourceId);
    }
}
