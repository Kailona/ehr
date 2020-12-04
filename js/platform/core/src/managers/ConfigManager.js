class ConfigManager {
    constructor() {
        this._appConfig = null;
    }

    get appConfig() {
        return this._appConfig;
    }

    set appConfig(value) {
        this._appConfig = value;
    }
}

// Singleton Export
const configManager = new ConfigManager();
export default configManager;
