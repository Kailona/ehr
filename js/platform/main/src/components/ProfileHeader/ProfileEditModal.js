import React from 'react';
import {
    Box,
    Dialog,
    DialogTitle,
    Typography,
    Link,
    DialogActions,
    Grid,
    withStyles,
    DialogContent as MuiDialogContent,
} from '@material-ui/core';
import { ProfileManager } from '@kailona/core';
import { KailonaButton, KailonaCloseButton, KailonaDatePicker, KailonaTextField } from '@kailona/ui';

const styles = {
    dialogActions: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    dialogActionsRight: {
        display: 'flex',
        alignItems: 'center',
    },
};

const DialogContent = withStyles({
    root: {
        height: '100%',
        margin: '0 20px 20px 20px',
        backgroundColor: '#FFFFFF',
        border: '1px solid #EAEAEA',
        borderRadius: '5px',
        paddingBottom: '25px',
    },
})(MuiDialogContent);

export default class ProfileEditModal extends React.Component {
    constructor(props) {
        super(props);

        this.profileDobRef = React.createRef();

        this.state = {
            loading: false,
            profileName: '',
        };
    }

    onChangeHandler(key, value) {
        const field = {};
        field[key] = value;

        this.setState(field);
    }

    onCancel = () => {
        this.props.onClose();
    };

    onConfirm = async () => {
        this.setState({
            loading: true,
        });

        const { profile } = this.props;
        if (profile) {
            // Update
            profile.patientFullName = this.state.profileName;
            profile.patientDob = this.profileDobRef.current.value;
            await ProfileManager.updateProfile(profile);
        } else {
            // Create
            const patientFullName = this.state.profileName;
            const patientDob = this.profileDobRef.current.value;
            await ProfileManager.addProfile({
                patientFullName,
                patientDob,
            });
        }

        if (typeof this.props.onUpdate === 'function') {
            this.props.onUpdate();
        }

        this.setState({
            loading: false,
        });

        this.props.onClose();
    };

    onDelete = async () => {
        const deleteProfile = confirm('Are you sure you want to delete this profile?');
        if (!deleteProfile) {
            return;
        }

        this.setState({
            loading: true,
        });

        const { profile } = this.props;
        await ProfileManager.removeProfile(profile.patientId);

        if (typeof this.props.onUpdate === 'function') {
            this.props.onUpdate();
        }

        this.setState({
            loading: false,
        });

        this.props.onClose();
    };

    render() {
        const { profile, firstTime } = this.props;
        const { loading } = this.state;

        let title = t('ehr', 'Patient Profile');
        if (firstTime) {
            title = t('ehr', 'Welcome');
        } else if (!profile) {
            title = t('ehr', 'New Patient Profile');
        }

        return (
            <Dialog fullWidth={true} maxWidth="xs" open={this.props.isOpen}>
                <DialogTitle>
                    <Box display="flex" alignItems="center">
                        <Box flexGrow={1}>{title}</Box>
                        <Box>
                            <KailonaCloseButton onClose={this.props.onClose} />
                        </Box>
                    </Box>
                </DialogTitle>
                <DialogContent>
                    {firstTime && (
                        <Box mb={3}>
                            <Grid container spacing={1} justify="center">
                                <Grid item>
                                    <Typography variant="body1">
                                        {t('ehr', 'Please update your health information for data accuracy.')}
                                    </Typography>
                                </Grid>
                                <Grid item>
                                    <Typography variant="body1">
                                        {t('ehr', 'Enjoy your private health platform, Kailona!')}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Box>
                    )}
                    <Box>
                        <KailonaTextField
                            id="profile-name"
                            className="kailona-MuiTextField"
                            label={t('ehr', 'Name')}
                            style={{ backgroundColor: 'transparent !important' }}
                            onChange={e => this.onChangeHandler('profileName', e.currentTarget.value)}
                            defaultValue={profile ? profile.patientFullName : null}
                            fullWidth
                        />
                    </Box>
                    <Box mt={2}>
                        <KailonaDatePicker
                            inputRef={this.profileDobRef}
                            id="date"
                            ariaLabel={t('ehr', 'Birth Date')}
                            defaultValue={profile ? profile.patientDob : null}
                            disableFuture={true}
                            openTo="year"
                            fullWidth
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Grid container>
                        <Grid item xs={4} style={{ paddingLeft: '15px' }}>
                            {!!profile && profile.relationship !== 'self' && (
                                <Link href="#" onClick={this.onDelete}>
                                    {t('ehr', 'Delete')}
                                </Link>
                            )}
                        </Grid>
                        <Grid item xs={8} align="right">
                            <KailonaButton
                                class="default"
                                disabled={loading}
                                onClick={this.onCancel}
                                title={t('ehr', 'Cancel')}
                            />
                            <KailonaButton
                                class="primary"
                                disabled={loading || !this.state.profileName}
                                onClick={this.onConfirm}
                                title={t('ehr', 'Confirm')}
                                loading={loading}
                                style={{ marginLeft: '8px' }}
                            />
                        </Grid>
                    </Grid>
                </DialogActions>
            </Dialog>
        );
    }
}
