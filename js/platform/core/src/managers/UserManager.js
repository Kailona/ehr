class UserManager {
    constructor() {
        this._userId = null; // user login id
        this._patientId = null; // user fhir id
    }

    get userId() {
        return this._userId;
    }

    set userId(value) {
        this._userId = value;
    }

    get patientId() {
        return this._patientId;
    }

    set patientId(value) {
        this._patientId = value;
    }
}

// Singleton Export
const userManager = new UserManager();
export default userManager;
