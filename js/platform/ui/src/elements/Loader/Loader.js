import React, { Component } from 'react';
import { CircularProgress } from '@material-ui/core';
import './Loader.styl';

export default class Loader extends Component {
    render() {
        return (
            <div className="loader-container">
                <CircularProgress color="primary" />
            </div>
        );
    }
}
