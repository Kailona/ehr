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
    CardMedia,
    Button,
    GridList,
    GridListTile,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { Close as CloseIcon } from '@material-ui/icons';
import { getIcon, Logger, ProviderManager } from '@kailona/core';
import { withNotification } from '../../context/NotificationContext';

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
        maxWidth: 345,
        elevation: 3,
    },
    cardMedia: {
        height: 140,
    },
    cardContentRoot: {
        padding: '0px 16px 0px 16px',
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
    }

    onSyncButtonClicked = async provider => {
        const { retrieveData } = provider;

        await retrieveData();
    };

    getProviderComponents = providers => {
        const { classes } = this.props;

        return (
            <GridList cols={3}>
                {providers.map(provider => {
                    return (
                        <GridListTile
                            style={{
                                height: '100%',
                            }}
                        >
                            <Card className={classes.cardRoot}>
                                {getIcon(provider.icon)}
                                <CardContent className={classes.cardContentRoot}>
                                    <Typography gutterBottom variant="h5" component="h2">
                                        {provider.name}
                                    </Typography>
                                </CardContent>
                                <CardActions className={classes.cardActionsRoot}>
                                    <Button
                                        size="small"
                                        color="primary"
                                        onClick={() => this.onSyncButtonClicked(provider)}
                                    >
                                        {t('ehr', 'SYNC')}
                                    </Button>
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
            <Dialog maxWidth="sm" fullWidth={true} open={this.props.isOpen}>
                <DialogTitle>
                    <Box display="flex" alignItems="center">
                        <Box flexGrow={1}>
                            <Typography variant="h3">{t('ehr', 'Providers')}</Typography>
                        </Box>
                        <Box>
                            <IconButton onClick={this.props.onClose}>
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
