import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Logger, SettingsService } from '@kailona/core';

import './AdminSettings.css';

const logger = new Logger('main.PluginManager');

export default class AdminSettings extends Component {
    static propTypes = {
        settings: PropTypes.shape({
            fhirBaseUrl: PropTypes.string.isRequired,
            fhirUsername: PropTypes.string.isRequired,
            fhirPassword: PropTypes.string.isRequired,
        }),
    };

    constructor(props) {
        super(props);

        this.state = {
            saveIndicators: {
                fhirBaseUrl: null,
                fhirUsername: null,
                fhirPassword: null,
            },
            settings: this.props.settings,
        };

        this.settingsCache = this.props.settings;
        this.settingsService = new SettingsService();
    }

    async componentDidMount() {
        if (!this.state.settings) {
            const settings = await this.settingsService.retrieveAdminSettings();
            this.settingsCache = settings;
            this.setState({
                settings,
            });
        }
    }

    updateIndicator = (settingsName, success) => {
        const { saveIndicators } = this.state;

        // Show the save indicator
        saveIndicators[settingsName] = success;
        this.setState({
            saveIndicators,
        });

        // Dismiss the success save indicator 2 secs later
        if (success) {
            setTimeout(() => {
                saveIndicators[settingsName] = null;
                this.setState({
                    saveIndicators,
                });
            }, 2000);
        }
    };

    onChange = async (key, value) => {
        // Skip if not changed
        if (this.settingsCache[key] === value) {
            return;
        }

        this.settingsCache[key] = value;

        try {
            await this.settingsService.saveAdminSettings(this.settingsCache);
            this.updateIndicator(key, true);
        } catch (error) {
            logger.error(error);
            this.updateIndicator(key, false);
        }
    };

    render() {
        return (
            <div className="admin-settings-container">
                <h2>{t('ehr', 'FHIR Server')}</h2>
                <p>
                    {t(
                        'ehr',
                        'FHIR is required to store health data. Basic HTTP Authentication is currently supported.'
                    )}
                </p>
                <div className="fhir-server-container">
                    <div className="fhir-server-content">
                        <label>{t('ehr', 'Base URL')}</label>
                        <input
                            type="text"
                            defaultValue={this.state.settings.fhirBaseUrl}
                            placeholder="FHIR Base URL"
                            onBlur={e => this.onChange('fhirBaseUrl', e.currentTarget.value)}
                        />
                        {this.state.saveIndicators.fhirBaseUrl === true && (
                            <span className="icon icon-checkmark-color" />
                        )}
                        {this.state.saveIndicators.fhirBaseUrl === false && (
                            <span className="icon icon-error-color" title={t('ehr', 'Failed to save changes!')} />
                        )}
                    </div>
                    <div className="fhir-server-content">
                        <label>{t('ehr', 'Username')}</label>
                        <input
                            type="text"
                            defaultValue={this.state.settings.fhirUsername}
                            placeholder="FHIR Username"
                            onBlur={e => this.onChange('fhirUsername', e.currentTarget.value)}
                        />
                        {this.state.saveIndicators.fhirUsername === true && (
                            <span className="icon icon-checkmark-color" />
                        )}
                        {this.state.saveIndicators.fhirUsername === false && (
                            <span className="icon icon-error-color" title={t('ehr', 'Failed to save changes!')} />
                        )}
                    </div>
                    <div className="fhir-server-content">
                        <label>{t('ehr', 'Password')}</label>
                        <input
                            type="password"
                            defaultValue={this.state.settings.fhirPassword}
                            placeholder="FHIR Password"
                            onBlur={e => this.onChange('fhirPassword', e.currentTarget.value)}
                        />
                        {this.state.saveIndicators.fhirPassword === true && (
                            <span className="icon icon-checkmark-color" />
                        )}
                        {this.state.saveIndicators.fhirPassword === false && (
                            <span className="icon icon-error-color" title={t('ehr', 'Failed to save changes!')} />
                        )}
                    </div>
                </div>
            </div>
        );
    }
}
