import { v4 as uuidv4 } from 'uuid';
import Logger from '../utils/Logger';
import ModuleTypeEnum from '../enums/ModuleType.enum';

const logger = new Logger('PluginManager');

class PluginManager {
    constructor() {
        this._plugins = [];
    }

    get plugins() {
        return this._plugins;
    }

    registerPlugin(plugin) {
        if (!plugin) {
            logger.warn('Invalid plugin passed to register');
            return;
        }

        const pluginId = plugin.id || uuidv4();
        if (this._plugins.some(p => p.id === pluginId)) {
            logger.warn(`Duplicate plugin with plugin id ${pluginId}`);
            return;
        }

        // Call onPreRegistration hook
        if (plugin.onPreRegisteration) {
            plugin.onPreRegisteration();
        }

        const modules = [];
        Object.keys(ModuleTypeEnum).forEach(moduleTypeName => {
            modules[moduleTypeName] = plugin[moduleTypeName];
        });

        // Register the plugin
        this._plugins.push({
            id: plugin.id,
            modules,
        });
    }
}

// Singleton Plugin Manager
const pluginManager = new PluginManager();
export default pluginManager;
