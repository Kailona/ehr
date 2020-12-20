import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Dropzone from 'react-dropzone';
import { Box, Typography, Dialog as MuiDialog, DialogTitle, IconButton, Button } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { Close as CloseIcon } from '@material-ui/icons';

import './ImportDataModal.styl';

const Dialog = withStyles({
    paper: {
        position: 'absolute',
        top: '10%',
        bottom: '10%',
    },
})(props => <MuiDialog {...props} />);

export default class ImportDataModal extends Component {
    static propTypes = {
        onClose: PropTypes.func.isRequired,
        isOpen: PropTypes.bool.isRequired,
    };

    constructor(props) {
        super(props);

        this.dropzoneRef = React.createRef();
    }

    onFileDrop = acceptedFiles => {
        console.log(acceptedFiles);
        debugger;
    };

    browseFile = () => {
        if (!this.dropzoneRef.current) {
            return;
        }

        this.dropzoneRef.current.open();
    };

    render() {
        return (
            <Dialog maxWidth="md" fullWidth={true} open={this.props.isOpen}>
                <DialogTitle>
                    <Box display="flex" alignItems="center">
                        <Box flexGrow={1}>{t('ehr', 'Import Data')}</Box>
                        <Box>
                            <IconButton onClick={this.props.onClose}>
                                <CloseIcon />
                            </IconButton>
                        </Box>
                    </Box>
                </DialogTitle>
                <div className="dropzone-container">
                    <Dropzone ref={this.dropzoneRef} className="dropzone-element" onDrop={this.onFileDrop}>
                        {({ getRootProps, getInputProps }) => (
                            <section className="dropzone-section">
                                <div className="dropzone-dragarea" {...getRootProps()}>
                                    <input {...getInputProps()} />
                                    <Typography variant="h4">Drag and Drop File</Typography>
                                </div>
                            </section>
                        )}
                    </Dropzone>
                    <Box display="flex" justifyContent="center" m={2}>
                        <Button variant="outlined" onClick={this.browseFile}>
                            Browse
                        </Button>
                    </Box>
                </div>
            </Dialog>
        );
    }
}
