import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Dropzone from 'react-dropzone';
import { Box, Typography, Dialog as MuiDialog, DialogTitle, IconButton, Button } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { Close as CloseIcon } from '@material-ui/icons';
import ImportDataBrowser from './ImportDataBrowser';

import './ImportDataModal.styl';
import { ModuleTypeEnum, PluginManager } from '@kailona/core';

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

    importFiles = () => {
        const { files } = this.state;

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

                dataModule.importData(file);
            });
        });
    };

    render() {
        const { files } = this.state;

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
                    {files.length && (
                        <ImportDataBrowser
                            files={files}
                            onDataTypesChanged={this.onDataTypesChanged}
                            onFileRemove={this.onFileRemove}
                        />
                    )}
                    <Box display="flex" justifyContent="center" m={2}>
                        <Button variant="outlined" onClick={this.browseFiles}>
                            Browse
                        </Button>
                        <Button variant="outlined" onClick={this.importFiles}>
                            Import
                        </Button>
                    </Box>
                </div>
            </Dialog>
        );
    }
}
