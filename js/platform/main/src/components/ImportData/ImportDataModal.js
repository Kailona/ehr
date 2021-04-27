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
    CircularProgress,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { Close as CloseIcon } from '@material-ui/icons';
import { Logger, ModuleTypeEnum, PluginManager, getIcon, readFileAsText, FHIRService } from '@kailona/core';
import { KailonaButton } from '@kailona/ui';
import ImportDataBrowser from './ImportDataBrowser';
import { withNotification } from '../../context/NotificationContext';

import './ImportDataModal.styl';

const logger = new Logger('main.ImportDataModal');

const DEFAULT_PLUGINS = ['plugin-documents'];

const Dialog = withStyles({
    paper: {
        position: 'absolute',
        top: '10%',
        bottom: '10%',
    },
})(props => <MuiDialog {...props} />);

const styles = theme => ({
    importIcon: {
        textAlign: 'center',
        color: theme.palette.primary.dark,
    },
});

class ImportDataModal extends Component {
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
                pluginIds: DEFAULT_PLUGINS,
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
        try {
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

                if (pluginIds.includes('FHIR') && file.type === 'application/json') {
                    const promise = this.importJSON(file);
                    promises.push(promise);
                }
            });

            // Wait for all files to be imported
            await Promise.all(promises);

            this.setState({
                importing: false,
                files: [],
            });

            this.props.onClose();

            // Give notification
            this.props.showNotification({
                severity: 'success',
                message: 'Data has been successfully imported',
            });
        } catch (error) {
            logger.error('Failed to import data', error);

            this.setState({
                importing: false,
            });

            // Give notification
            this.props.showNotification({
                severity: 'error',
                message: 'An error occurred while importing data. Please contact your administrator.',
            });
        }
    };

    importJSON = async file => {
        const fileAsText = await readFileAsText(file);
        const fileAsJSON = JSON.parse(fileAsText);
        const { resourceType, type } = fileAsJSON;

        try {
            if (!resourceType) {
                throw 'File must have a resourceType value';
            }

            let transactionFile;

            if (resourceType === 'Bundle' && type && type === 'transaction') {
                transactionFile = fileAsJSON;
            } else {
                transactionFile = {
                    resourceType: 'Bundle',
                    type: 'transaction',
                    entry: [
                        {
                            resource: { ...fileAsJSON },
                            request: {
                                method: 'POST',
                                url: resourceType, // resourceType
                            },
                        },
                    ],
                };
            }

            const fhirService = new FHIRService();
            await fhirService.transaction(transactionFile);
            return true;
        } catch (error) {
            console.error('Failed to import data', error);
        }
        return false;
    };

    render() {
        const { importing, files } = this.state;
        const importIcon = getIcon('CloudUploadOutlined');
        const browseFilesButtonTitle = files && files.length ? 'Add More Files' : 'Browse Files';
        return (
            <Dialog maxWidth="sm" fullWidth={true} open={this.props.isOpen}>
                <DialogTitle>
                    <Box display="flex" alignItems="center">
                        <Box flexGrow={1}>
                            <Typography variant="h3">{t('ehr', 'Import Data')}</Typography>
                        </Box>
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
                                        <div className="subtitle">
                                            <div>
                                                <Typography variant="h2" style={{ fontWeight: 'normal' }}>
                                                    Drag and Drop Files
                                                </Typography>
                                            </div>
                                            <div className={this.props.classes.importIcon}>{importIcon}</div>
                                        </div>
                                    </div>
                                </section>
                            )
                        }
                    </Dropzone>
                    {files && !!files.length && (
                        <ImportDataBrowser
                            files={files}
                            onDataTypesChanged={this.onDataTypesChanged}
                            onFileRemove={this.onFileRemove}
                        />
                    )}
                    <Box m={2}>
                        <Grid container direction="row" justify="center" alignItems="center" spacing={2}>
                            <Grid item>
                                <KailonaButton
                                    variant="outlined"
                                    class="primary"
                                    title={browseFilesButtonTitle}
                                    disabled={importing}
                                    onClick={this.browseFiles}
                                />
                            </Grid>
                            {files && !!files.length && (
                                <Grid item>
                                    <KailonaButton
                                        variant="outlined"
                                        class="primary"
                                        title="Import"
                                        disabled={importing}
                                        onClick={this.importFiles}
                                    />
                                </Grid>
                            )}

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

export default withStyles(styles)(withNotification(ImportDataModal));
