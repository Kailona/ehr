import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class PhysicalDataModule extends Component {
    render() {
        return (
            <div>
                <h1>{t('ehr', 'This is physical data component!')}</h1>
                <Link to="/">Dashboard</Link>
            </div>
        );
    }
}
