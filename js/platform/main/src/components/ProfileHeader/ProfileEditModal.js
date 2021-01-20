import React from 'react';
import {
    Box,
    Button,
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
                            label="Name"
                            inputRef={this.profileNameRef}
                            defaultValue={profile ? profile.patientFullName : null}
                        />
                    </Box>
                    <Box mt={6} ml={2} mr={2} mb={2}>
                        <Grid container direction="row" justify="center" alignItems="flex-end" spacing={2}>
                            {!!profile && profile.relationship !== 'self' && (
                                <Grid item>
                                    <Button variant="outlined" color="error" disabled={loading} onClick={this.onDelete}>
                                        Delete
                                    </Button>
                                </Grid>
                            )}
                            <Grid item>
                                <Button variant="outlined" disabled={loading} onClick={this.onCancel}>
                                    Cancel
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button variant="outlined" disabled={loading} onClick={this.onConfirm}>
                                    Confirm
                                </Button>
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
