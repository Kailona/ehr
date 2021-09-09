import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Box } from '@material-ui/core';
import { Logger } from '@kailona/core';
import ProfileHeader from './ProfileHeader/ProfileHeader';
import { withNotification } from '../context/NotificationContext';
import DataProviderSyncComponent from './DataProviderSync/DataProviderSyncComponent';
import parseHash from '../lib/parseHash';

const logger = new Logger('main.MainLayout');

class MainLayout extends Component {
    constructor(props) {
        super(props);

        this.state = {
            mode: 'app',
            data: null,
        };
    }

    componentDidMount() {
        const { error, showNotification, location } = this.props;
        if (error) {
            showNotification({
                severity: 'error',
                message: error,
            });
            return;
        }

        const { hash } = location;

        // Parse hash to retrieve access token for a provider and sync data with the token
        const parsedHash = parseHash(hash);
        if (!parsedHash) {
            return;
        }

        const { error: retrieveAccessTokenError } = parsedHash;

        if (retrieveAccessTokenError) {
            logger.error(retrieveAccessTokenError);
            showNotification({
                severity: 'error',
                message: 'Sync failed',
            });
            return;
        }

        this.setState({
            mode: 'sync',
            data: parsedHash,
        });
    }

    render() {
        const { mode, data } = this.state;

        if (mode === 'sync') {
            return <DataProviderSyncComponent hash={data} />;
        }

        const { children, firstTime } = this.props;

        return (
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <ProfileHeader firstTime={firstTime} />
                <Box mt={2} p={2} style={{ flex: 1 }}>
                    {children}
                </Box>
            </div>
        );
    }
}

export default withRouter(withNotification(MainLayout));
