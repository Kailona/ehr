import React from 'react';
import {
    Box,
    CircularProgress,
    Dialog,
    DialogContent,
    DialogTitle,
    Grid,
    IconButton,
    TextField,
} from '@material-ui/core';
import { Close as CloseIcon } from '@material-ui/icons';
import { ProfileManager } from '@kailona/core';
import { KailonaButton } from '@kailona/ui';

export default class ProfileEditModal extends React.Component {
    constructor(props) {
        super(props);

        this.profileNameRef = React.createRef();

        this.state = {
            loading: false,
        };
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
            profile.patientFullName = this.profileNameRef.current.value;
            await ProfileManager.updateProfile(profile);
        } else {
            // Create
            const profileName = this.profileNameRef.current.value;
            await ProfileManager.addProfile(profileName);
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
        const { profile } = this.props;
        const { loading } = this.state;

        return (
            <Dialog fullWidth={false} open={this.props.isOpen}>
                <DialogTitle>
                    <Box display="flex" alignItems="center">
                        <Box flexGrow={1}>
                            {profile ? t('ehr', 'Patient Profile') : t('ehr', 'New Patient Profile')}
                        </Box>
                        <Box>
                            <IconButton onClick={this.props.onClose}>
                                <CloseIcon />
                            </IconButton>
                        </Box>
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <Box>
                        <TextField
                            id="profile-name"
                            className="kailona-MuiTextField"
                            label="Name"
                            inputRef={this.profileNameRef}
                            defaultValue={profile ? profile.patientFullName : null}
                        />
                    </Box>
                    <Box mt={5} ml={2} mr={2} mb={2}>
                        <Grid container direction="row" justify="center" alignItems="flex-end" spacing={2}>
                            {!!profile && profile.relationship !== 'self' && (
                                <Grid item>
                                    <KailonaButton
                                        variant="outlined"
                                        class="error"
                                        disabled={loading}
                                        onClick={this.onDelete}
                                        title={t('ehr', 'Delete Profile')}
                                    />
                                </Grid>
                            )}
                            <Grid item>
                                <KailonaButton
                                    variant="outlined"
                                    class="default"
                                    disabled={loading}
                                    onClick={this.onCancel}
                                    title={t('ehr', 'Cancel')}
                                />
                            </Grid>
                            <Grid item>
                                <KailonaButton
                                    variant="outlined"
                                    class="primary"
                                    disabled={loading}
                                    onClick={this.onConfirm}
                                    title={t('ehr', 'Confirm')}
                                />
                            </Grid>
                            {loading && (
                                <Grid item>
                                    <CircularProgress color="primary" size={20} />
                                </Grid>
                            )}
                        </Grid>
                    </Box>
                </DialogContent>
            </Dialog>
        );
    }
}
