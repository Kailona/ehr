import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AdminSettings from './components/AdminSettings/AdminSettings';

export default class AppAdminSettings extends Component {
    static propTypes = {
        adminSettings: PropTypes.object.isRequired,
    };

    render() {
        return <AdminSettings settings={this.props.adminSettings} />;
    }
}
