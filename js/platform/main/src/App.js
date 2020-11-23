import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { PluginManager } from '@kailona/core';
import Dashboard from './components/Dashboard';

export default class App extends Component {
	static propTypes = {
		config: PropTypes.shape({
			plugins: PropTypes.array,
		}).isRequired,
	};

	constructor(props) {
		super(props);

		const { plugins } = this.props.config;
		plugins.forEach(plugin => {
			PluginManager.registerPlugin(plugin);
		});
	}

	render () {
		return (
			<Dashboard />
		);
	}
};
