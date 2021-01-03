import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Dropzone from 'react-dropzone';
import {
    Box,
    Grid,
    Typography,
    Dialog as MuiDialog,
    DialogTitle,
    IconButton,
    Button,
    CircularProgress,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { Close as CloseIcon } from '@material-ui/icons';
import { ModuleTypeEnum, PluginManager } from '@kailona/core';
import ImportDataBrowser from './ImportDataBrowser';

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

        this.state = {
            importing: false,
            files: [],
        };
    }

    onFileDrop = newFiles => {
        const { files } = this.state;

        // Prevent duplicates
        newFiles.forEach(newFile => {
            if (files.some(f => f.file.name === newFile.name && f.file.path === newFile.path)) {
                return;
            }

            files.push({
                file: newFile,
                pluginIds: [],
            });
        });

        this.setState({
            files,
        });
    };

    onFileRemove = file => {
        const { files } = this.state;

        const indexToDelete = files.findIndex(f => f.file.name === file.name && f.file.path === file.path);
        if (indexToDelete < 0) {
            return;
        }

        files.splice(indexToDelete, 1);

        this.setState({
            files,
        });
    };

    onDataTypesChanged = (file, pluginIds) => {
        const { files } = this.state;

        const fileData = files.find(f => f.file.name === file.name && f.file.path === file.path);
        fileData.pluginIds = pluginIds;

        this.setState({
            files,
        });
    };

    browseFiles = () => {
        if (!this.dropzoneRef.current) {
            return;
        }

        this.dropzoneRef.current.open();
    };

    importFiles = async () => {
        const { files } = this.state;

        this.setState({
            importing: true,
        });

        const promises = [];

        // Import files to selected plugins
        files.forEach(fileData => {
            const { file, pluginIds } = fileData;

            PluginManager.plugins.forEach(plugin => {
                const { id, modules } = plugin;

                // Skip if plugin is not selected
                if (!pluginIds.includes(id)) {
                    return;
                }

                // Skip if plugin does not support data import
                const dataModule = modules[ModuleTypeEnum.DataModule];
                if (!dataModule || typeof dataModule.importData !== 'function') {
                    return;
                }

                const promise = dataModule.importData(file);
                promises.push(promise);
            });
        });

        // Wait for all files to be imported
        await Promise.all(promises);

        // TODO: Show data import notification to user

        this.setState({
            importing: false,
            files: [],
        });

        this.props.onClose();
    };

    render() {
        const { importing, files } = this.state;

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
                        {({ getRootProps, getInputProps }) =>
                            files.length ? (
                                <div {...getRootProps()}>
                                    <input {...getInputProps()} />
                                </div>
                            ) : (
                                <section className="dropzone-section">
                                    <div className="dropzone-dragarea" {...getRootProps()}>
                                        <input {...getInputProps()} />
                                        <Typography variant="h4">Drag and Drop File</Typography>
                                    </div>
                                </section>
                            )
                        }
                    </Dropzone>
                    {!!files.length && (
                        <ImportDataBrowser
                            files={files}
                            onDataTypesChanged={this.onDataTypesChanged}
                            onFileRemove={this.onFileRemove}
                        />
                    )}
                    <Box m={2}>
                        <Grid container direction="row" justify="center" alignItems="center" spacing={2}>
                            <Grid item>
                                <Button variant="outlined" disabled={importing} onClick={this.browseFiles}>
                                    Browse
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button variant="outlined" disabled={importing} onClick={this.importFiles}>
                                    Import
                                </Button>
                            </Grid>
                            {importing && (
                                <Grid item>
                                    <CircularProgress color="primary" size={20} />
                                </Grid>
                            )}
                        </Grid>
                    </Box>
                </div>
            </Dialog>
        );
    }
}
