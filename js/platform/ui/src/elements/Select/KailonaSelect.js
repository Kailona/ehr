import React, { Component } from 'react';
import { FormControl as MuiFormControl, InputLabel, Select, withStyles } from '@material-ui/core';

const FormControl = withStyles(theme => ({
    root: {
        backgroundColor: 'transparent !important',
    },
}))(MuiFormControl);

export default class KailonaSelect extends Component {
    render() {
        return (
            <FormControl>
                <InputLabel htmlFor={this.props.name}>{this.props.name}</InputLabel>
                <Select
                    {...this.props}
                    inputProps={{
                        name: this.props.name,
                    }}
                >
                    {this.props.options.map(option => (
                        <option value={option.value}>{option.text}</option>
                    ))}
                </Select>
            </FormControl>
        );
    }
}
