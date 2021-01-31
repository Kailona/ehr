import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormControl as MuiFormControl, InputLabel, Select, withStyles } from '@material-ui/core';

const FormControl = withStyles(theme => ({
    root: {
        backgroundColor: 'transparent !important',
        '& input': {
            backgroundColor: 'transparent !important',
            border: 'none !important',
            padding: '7px 6px 0 6px !important',
            height: '34px',
            '&:before': {
                marginTop: '0',
            },
        },
        '& label': {
            color: `${theme.palette.primary.main} !important`,
            bottom: '34px !important',
            display: 'flex',
            alignItems: 'flex-end',
            paddingLeft: '7px',
            fontSize: '12px',
        },
        '& label + .MuiInput-formControl': {
            marginTop: '0 !important',
        },
        '& .MuiSelect-root': {
            padding: '7px 6px',
            fontSize: '12px',
        },
        '& .MuiInput-underline:before': {
            borderColor: `${theme.palette.primary.main} !important`,
        },
    },
}))(MuiFormControl);

export default class KailonaSelect extends Component {
    static propTypes = {
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        options: PropTypes.array.isRequired,
        handleChange: PropTypes.func.isRequired,
        inputLabel: PropTypes.string,
    };

    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {
        return (
            <FormControl>
                <InputLabel htmlFor={this.props.name}>{this.props.inputLabel}</InputLabel>
                <Select
                    id={this.props.id}
                    value={this.state.value}
                    onChange={e => this.props.handleChange(e.target.value)}
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
