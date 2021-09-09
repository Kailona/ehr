import Logger from '../services/Logger';

const logger = new Logger('core.ProviderManager');

class ProviderManager {
    constructor() {
        this._providers = [];
    }

    get providers() {
        return this._providers;
    }

    providersEnabled() {
        return !!this.providers.length;
    }

    getProvider(id) {
        return this._providers.find(provider => provider.id === id);
    }

    registerProvider(provider) {
        if (!provider) {
            logger.warn('Invalid provider passed to register');
            return;
        }

        provider.initialize();

        this._providers.push(provider);
    }
}

const providerManager = new ProviderManager();
export default providerManager;
