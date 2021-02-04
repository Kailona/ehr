import moment from 'moment';
import Logger from '../services/Logger';
import FHIRService from '../services/FHIRService';
import fhirDataFormatter from '../utils/fhirDataFormatter';

const logger = new Logger('core.ProfileManager');

class ProfileManager {
    constructor() {
        this._userId = null; // user login id
        this._activePatientId = null; // user fhir id
        this._profiles = [];
    }

    get userId() {
        return this._userId;
    }

    set userId(value) {
        this._userId = value;
    }

    get activePatientId() {
        return this._activePatientId;
    }

    set activePatientId(value) {
        this._activePatientId = value;
    }

    get profiles() {
        return this._profiles;
    }

    set profiles(value) {
        this._profiles = value;
    }

    get activeProfile() {
        return this._profiles.find(p => p.patientId === this._activePatientId);
    }

    getSelfProfile() {
        return this._profiles.find(p => p.relationship === 'self');
    }

    async addProfile(profile, relationship = null) {
        const { patientFullName, patientDob } = profile;

        try {
            const patientToAdd = {
                resourceType: 'Patient',
                active: true,
            };

            if (patientFullName) {
                patientToAdd.name = [
                    {
                        given: [patientFullName],
                    },
                ];
            }

            if (patientDob) {
                patientToAdd.birthDate = moment(patientDob).format('YYYY-MM-DD');
            }

            // Create Patient for new profile
            const patientFhirService = new FHIRService('Patient');
            const { data: patient } = await patientFhirService.create(patientToAdd);

            // Create RelatedPerson for new profile
            const relatedPersonToCreate = {
                resourceType: 'RelatedPerson',
                active: true,
                patient: {
                    reference: `Patient/${patient.id}`,
                },
            };

            if (relationship) {
                relatedPersonToCreate.relationship = relationship;
            }

            const relatedPersonFhirService = new FHIRService('RelatedPerson');
            const { data: relatedPerson } = await relatedPersonFhirService.create(relatedPersonToCreate);

            // Link new profile to parent patient
            const { patientId: parentPatientId } = this.getSelfProfile();
            const { data: parentPatient } = await patientFhirService.read(parentPatientId);

            parentPatient.link = parentPatient.link || [];
            parentPatient.link.push({
                other: {
                    reference: `RelatedPerson/${relatedPerson.id}`,
                },
                type: 'seealso',
            });

            await patientFhirService.update(parentPatientId, parentPatient);

            // Update profiles
            this._profiles.push({
                patientId: patient.id,
                patientFullName: fhirDataFormatter.formatPatientName(patient.name),
                patientDob: patient.birthDate,
                relationship,
            });
        } catch (error) {
            logger.error('Failed to create new profile', error);
        }
    }

    async updateProfile(profile) {
        try {
            const { patientId: patientIdToUpdate } = profile;

            // Get the latest version of patient
            const patientFhirService = new FHIRService('Patient');
            const { data: patientToUpdate } = await patientFhirService.read(patientIdToUpdate);

            const { patientFullName, patientDob } = profile;

            if (patientFullName) {
                patientToUpdate.name = [
                    {
                        given: [patientFullName],
                    },
                ];
            }

            if (patientDob) {
                patientToUpdate.birthDate = moment(patientDob).format('YYYY-MM-DD');
            }

            // TODO: Update relationship in related person

            await patientFhirService.update(patientIdToUpdate, patientToUpdate);

            // Update profiles
            const profileIndexToUpdate = this._profiles.findIndex(p => p.patientId === patientIdToUpdate);
            if (profileIndexToUpdate < 0 || profileIndexToUpdate >= this._profiles.length) {
                return;
            }
            this._profiles[profileIndexToUpdate] = profile;
        } catch (error) {
            logger.error('Failed to remove profile', error);
        }
    }

    async removeProfile(patientIdToRemove) {
        try {
            const { patientId: parentPatientId } = this.getSelfProfile();

            // Skip if trying to remove parent patient
            if (parentPatientId === patientIdToRemove) {
                return;
            }

            // Get related person
            const relatedPersonFhirService = new FHIRService('RelatedPerson');
            const { data: relatedPersonBundle } = await relatedPersonFhirService.search([
                {
                    patient: `Patient/${patientIdToRemove}`,
                },
            ]);
            if (!relatedPersonBundle || !relatedPersonBundle.entry || !relatedPersonBundle.entry.length) {
                return;
            }
            const { resource: relatedPerson } = relatedPersonBundle.entry[0];

            // Get the latest version of parent patient
            const patientFhirService = new FHIRService('Patient');
            const { data: parentPatient } = await patientFhirService.read(parentPatientId);
            if (!parentPatient.link || !parentPatient.link.length) {
                return;
            }

            const linkIndexToRemove =
                parentPatient.link &&
                parentPatient.link.findIndex(l => l.other && l.other.reference === `RelatedPerson/${relatedPerson.id}`);
            if (linkIndexToRemove < 0 || linkIndexToRemove >= parentPatient.link.length) {
                return;
            }

            parentPatient.link.splice(linkIndexToRemove, 1);

            await patientFhirService.update(parentPatientId, parentPatient);

            // Update profiles
            this._activePatientId = parentPatientId;
            const profileIndexToRemove = this._profiles.findIndex(p => p.patientId === patientIdToRemove);
            if (profileIndexToRemove < 0 || profileIndexToRemove >= this._profiles.length) {
                return;
            }
            this._profiles.splice(profileIndexToRemove, 1);
        } catch (error) {
            logger.error('Failed to remove profile', error);
        }
    }
}

// Singleton Export
const profileManager = new ProfileManager();
export default profileManager;
