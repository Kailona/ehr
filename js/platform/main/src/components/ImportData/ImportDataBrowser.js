import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    Select,
    MenuItem,
    Checkbox,
    Input,
    InputLabel,
    FormControl as MuiFormControl,
    withStyles,
} from '@material-ui/core';
import { Delete as DeleteIcon } from '@material-ui/icons';
import { ModuleTypeEnum, PluginManager } from '@kailona/core';

const FormControl = withStyles({
    root: {
        minWidth: 250,
        maxWidth: 300,
    },
})(props => <MuiFormControl {...props} />);

export default class ImportDataBrowser extends Component {
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

        PluginManager.plugins.forEach((plugin, index) => {
            const { id, name, modules } = plugin;

            // Skip if plugin does not support data import
            const dataModule = modules[ModuleTypeEnum.DataModule];
            if (!dataModule || typeof dataModule.importData !== 'function') {
                return;
            }

            menuItems.push(
                <MenuItem key={index} value={id}>
                    <Checkbox checked={pluginIds.indexOf(id) > -1} />
                    <ListItemText primary={name} />
                </MenuItem>
            );
        });

        return menuItems;
    };

    getFileItems = () => {
        const { files } = this.props;

        return files.map((fileData, index) => {
            const { file, pluginIds } = fileData;

            return (
                <ListItem key={index}>
                    <ListItemText primary={file.name} />
                    <ListItemSecondaryAction>
                        <FormControl variant="outlined">
                            <InputLabel>Data Type</InputLabel>
                            <Select
                                multiple
                                value={pluginIds}
                                onChange={event => this.props.onDataTypesChanged(file, event.target.value)}
                                input={<Input />}
                                renderValue={selected => selected.join(', ')}
                            >
                                {this.getDataTypeMenuItems(pluginIds)}
                            </Select>
                        </FormControl>
                        <IconButton edge="end" aria-label="delete" onClick={() => this.props.onFileRemove(file)}>
                            <DeleteIcon />
                        </IconButton>
                    </ListItemSecondaryAction>
                </ListItem>
            );
        });
    };

    render() {
        return (
            <div style={{ height: '100%' }}>
                <List>{this.getFileItems()}</List>
            </div>
        );
    }
}
