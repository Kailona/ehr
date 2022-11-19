import { Component } from 'react';
import { Logger, ProviderManager } from '@kailona/core';
import Loader from '../../../../ui/src/elements/Loader/Loader';

const logger = new Logger('main.DataProviderSyncComponent');

export default class DataProviderSyncComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            message: '',
            loading: true,
            second: 3,
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
            message = `Data is synchronized successfully from ${providerName}`;
        } catch (error) {
            message = `Data could not be synchronized from ${providerName}!`;
            logger.error(message, error);
        } finally {
            this.setState({
                message,
                loading: false,
            });

            setInterval(() => {
                this.setState({ second: this.state.second - 1 });

                if (!this.state.second) {
                    clearInterval();
                    window.close();
                }
            }, 1000);
        }
    }

    render() {
        const { message, loading, second } = this.state;

        return (
            <div style={{ width: '100%', height: '100%' }}>
                <div style={{ textAlign: 'center', marginTop: '50px' }}>
                    <div>{message}</div>
                    {loading ? <Loader /> : <div style={{ marginTop: '10px' }}>{`${second}${'.'.repeat(second)}`}</div>}
                </div>
            </div>
        );
    }
}
