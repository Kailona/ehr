import { Component } from 'react';
import { Logger, ProviderManager } from '@kailona/core';

const logger = new Logger('main.DataProviderSyncComponent');

export default class DataProviderSyncComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            message: '',
        };
    }

    componentDidMount() {
        const { hash } = this.props;
        const { state: providerId, access_token: accessToken } = hash;

        const provider = ProviderManager.getProvider(providerId);
        const { name: providerName } = provider;

        // Store the access token to local storage
        provider.storeAccessToken(accessToken);

        this.setState(
            {
                message: `Data is synchronizing from ${providerName}`,
            },
            async () => await this.retrieveData(provider)
        );
    }

    async retrieveData(provider) {
        const { name: providerName } = provider;

        let message = '';

        // Retrieve data from the provider
        try {
            await provider.retrieveData();
            message = `Data is synchronized from ${providerName}`;
        } catch (error) {
            message = `Data could not be synchronized from ${providerName}!`;
            logger.error(message, error);
        } finally {
            this.setState({
                message,
            });

            /*
            // Close current page
            setTimeout(() => {
                window.close();
            }, 5000);
         */
        }
    }

    render() {
        const { message } = this.state;

        return <div>{message}</div>;
    }
}
