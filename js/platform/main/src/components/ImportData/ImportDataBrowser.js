import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    ListItemText,
    IconButton,
    Select as MuiSelect,
    MenuItem,
    Checkbox,
    Input,
    FormControl as MuiFormControl,
    withStyles,
    InputLabel,
    Typography,
} from '@material-ui/core';

import { Delete as DeleteIcon } from '@material-ui/icons';
import { ModuleTypeEnum, PluginManager } from '@kailona/core';

const FormControl = withStyles({
    root: {
        minWidth: '100%',
        maxWidth: 300,
    },
})(props => <MuiFormControl {...props} />);

const Select = withStyles({
    root: {
        backgroundColor: '#fff',
        padding: '5px 8px',
        '&:hover, &:focus': {
            backgroundColor: '#fff !important',
        },
    },
})(props => <MuiSelect {...props} />);

const styles = theme => ({
    importDataBrowser: {
        height: '100%',
        margin: '0 20px 20px 20px',
        backgroundColor: '#FFFFFF',
        border: '1px solid #EAEAEA',
        borderRadius: '5px',
    },
    fileItem: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
    },
    fileName: {
        flexBasis: '48%',
    },
    destination: {
        flexBasis: '48%',
    },
    deleteFile: {
        flexBasis: '4%',
    },
    selectBox: {
        '&:before': {
            borderColor: theme.palette.primary.main,
        },
        '&:hover:not(.Mui-disabled):before': {
            borderColor: theme.palette.primary.main,
        },
    },
    selectLabel: {
        marginTop: '-12px',
        fontSize: '15px',
        letterSpacing: '0.1px',
        fontWeight: '400',
        color: theme.palette.primary.main,
        '&.MuiInputLabel-shrink': {
            display: 'none',
        },
    },
    destinationCheckbox: {
        color: `${theme.palette.primary.main} !important`,
    },
    icon: {
        fill: theme.palette.primary.main,
    },
    deleteIcon: {
        fill: theme.palette.gray60.main,
    },
});

class ImportDataBrowser extends Component {
    static propTypes = {
        files: PropTypes.arrayOf(
            PropTypes.shape({
                file: PropTypes.object.isRequired,
                pluginIds: PropTypes.array.isRequired,
            })
        ),
        onDataTypesChanged: PropTypes.func.isRequired,
        onFileRemove: PropTypes.func.isRequired,
    };

    getDataTypeMenuItems = pluginIds => {
        const menuItems = [];
        const importOptions = [];
        const { classes } = this.props;

        PluginManager.plugins.forEach((plugin, index) => {
            const { id, name, modules } = plugin;

            // Skip if plugin does not support data import
            const dataModule = modules[ModuleTypeEnum.DataModule];
            if (!dataModule || typeof dataModule.importData !== 'function') {
                return;
            }

            importOptions.push({ id, name });
        });

        importOptions.push({ id: 'FHIR', name: 'FHIR' });

        importOptions.map((item, index) => {
            const { id, name } = item;
            menuItems.push(
                <MenuItem key={index} value={id} disableRipple={true}>
                    <Checkbox checked={pluginIds.includes(id)} className={classes.destinationCheckbox} />
                    <ListItemText primary={name} />
                </MenuItem>
            );
        });
        return menuItems;
    };

    getOptionNames = selectedOptionIds => {
        const optionNames = [];

        PluginManager.plugins.forEach(plugin => {
            const { id, name } = plugin;

            if (!selectedOptionIds.includes(id)) {
                return;
            }

            optionNames.push(name);
        });

        if (selectedOptionIds.includes('FHIR')) {
            optionNames.push('FHIR');
        }

        return optionNames.join(', ');
    };

    getFileItems = () => {
        const { files, classes } = this.props;

        return files.map(fileData => {
            const { file, pluginIds } = fileData;

            return (
                <div className={classes.fileItem}>
                    <div className={classes.fileName}>
                        <Typography variant="h5">{file.name}</Typography>
                    </div>
                    <div className={classes.destination}>
                        <FormControl variant="outlined">
                            <InputLabel className={classes.selectLabel}>Select</InputLabel>
                            <Select
                                className={classes.selectBox}
                                MenuProps={{
                                    getContentAnchorEl: () => null,
                                }}
                                multiple
                                placeholder="Select options"
                                value={pluginIds}
                                onChange={event => this.props.onDataTypesChanged(file, event.target.value)}
                                input={<Input style={{ margin: '0' }} />}
                                renderValue={selected => this.getOptionNames(selected)}
                                inputProps={{
                                    classes: {
                                        icon: classes.icon,
                                    },
                                }}
                            >
                                {this.getDataTypeMenuItems(pluginIds)}
                            </Select>
                        </FormControl>
                    </div>
                    <div className={classes.deleteFile}>
                        <IconButton edge="end" aria-label="delete" onClick={() => this.props.onFileRemove(file)}>
                            <DeleteIcon className={classes.deleteIcon} />
                        </IconButton>
                    </div>
                </div>
            );
        });
    };

    render() {
        const { classes } = this.props;
        return (
            <div className={classes.importDataBrowser} style={{ padding: '10px 20px' }}>
                <div key="header" className={classes.fileItem}>
                    <div className={classes.fileName}>
                        <Typography variant="body1">File Name</Typography>
                    </div>
                    <div className={classes.destination}>
                        <Typography variant="body1">Destination</Typography>
                    </div>
                </div>
                {this.getFileItems()}
            </div>
        );
    }
}

export default withStyles(styles)(ImportDataBrowser);
