import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    Box,
    Typography,
    Dialog as MuiDialog,
    DialogTitle,
    IconButton,
    Card,
    CardContent,
    CardActions,
    GridList,
    GridListTile,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { Close as CloseIcon } from '@material-ui/icons';
import { Logger, ProviderManager } from '@kailona/core';
import { withNotification } from '../../context/NotificationContext';
import { KailonaButton } from '@kailona/ui';

const logger = new Logger('main.ProvidersModal');

const Dialog = withStyles({
    paper: {
        position: 'absolute',
        top: '10%',
        bottom: '10%',
    },
})(props => <MuiDialog {...props} />);

const styles = theme => ({
    cardRoot: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '16px 32px 16px 32px',
    },
    cardContentRoot: {
        padding: '0px 16px 0px 16px',
        '& img': {
            marginTop: '5px',
        },
    },
    cardActionsRoot: {
        padding: '0px 8px 0px 8px',
    },
});

class ProvidersModal extends Component {
    static propTypes = {
        onClose: PropTypes.func.isRequired,
        isOpen: PropTypes.bool.isRequired,
    };

    constructor(props) {
        super(props);

        this.state = {
            loading: false,
        };
    }

    onSyncButtonClicked = async provider => {
        const { retrieveData } = provider;
        this.setState({ loading: true });

        const result = await retrieveData();

        this.setState({ loading: false });

        this.props.onClose();

        if (!result) {
            return this.props.showNotification({
                severity: 'error',
                message: t('ehr', 'Google fit data unsynchronized.'),
            });
        }
        // return for signIn window
        if (result == 1) {
            return this.props.showNotification({
                severity: 'info',
                message: t('ehr', 'Need to sign in for the data synchronize.'),
            });
        }

        return this.props.showNotification({
            severity: 'success',
            message: t('ehr', 'Google fit account data synchronized successfully.'),
        });
    };

    getProviderComponents = providers => {
        const { classes } = this.props;
        const { loading } = this.state;

        return (
            <GridList>
                {providers.map(provider => {
                    return (
                        <GridListTile
                            style={{
                                height: '100%',
                                width: '100%',
                            }}
                        >
                            <Card className={classes.cardRoot}>
                                <CardContent className={classes.cardContentRoot}>
                                    <Typography gutterBottom variant="h5" component="h2">
                                        <img src={provider.icon} style={{ marginTop: '5px' }} />
                                        {provider.name}
                                    </Typography>
                                </CardContent>
                                <CardActions className={classes.cardActionsRoot}>
                                    <KailonaButton
                                        class="primary"
                                        disabled={loading}
                                        loading={loading}
                                        onClick={() => this.onSyncButtonClicked(provider)}
                                        title={t('ehr', 'Synchronize')}
                                    />
                                </CardActions>
                            </Card>
                        </GridListTile>
                    );
                })}
            </GridList>
        );
    };

    render() {
        const providers = ProviderManager.providers;

        return (
            <Dialog maxWidth="xs" fullWidth={true} open={this.props.isOpen}>
                <DialogTitle>
                    <Box display="flex" alignItems="center">
                        <Box flexGrow={1}>
                            <Typography variant="h3">{t('ehr', 'Providers')}</Typography>
                        </Box>
                        <Box>
                            <IconButton disabled={this.state.loading} onClick={this.props.onClose}>
                                <CloseIcon />
                            </IconButton>
                        </Box>
                    </Box>
                </DialogTitle>
                <div>{this.getProviderComponents(providers)}</div>
            </Dialog>
        );
    }
}

export default withStyles(styles)(withNotification(ProvidersModal));
