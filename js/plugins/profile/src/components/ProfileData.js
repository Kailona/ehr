import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class ProfileData extends Component {
    render() {
        return (
            <div>
                <h1>{t('ehr', 'This is profile data component!')}</h1>
                <Link to="/">Dashboard</Link>
            </div>
        );
    }
}
