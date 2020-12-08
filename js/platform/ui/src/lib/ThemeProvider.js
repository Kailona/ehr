import React, { Component } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import theme from '../theme';

export default class ThemeProvider extends Component {
    render() {
        const { children } = this.props;

        return <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>;
    }
}
