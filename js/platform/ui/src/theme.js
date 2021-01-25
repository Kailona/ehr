import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#3F51B5',
            light: '#C3CCFF',
            dark: '#002984',
            bright: '#536DFE',
        },
        secondary: {
            main: '#4DD0E1',
            light: '#B2EBF2',
            dark: '#009FAF',
        },
        black: {
            main: '#000000',
        },
        gray80: {
            main: '#333333',
        },
        gray60: {
            main: '#666666',
        },
        gray40: {
            main: '#999999',
        },
        gray30: {
            main: '#B2B2B2',
        },
        gray20: {
            main: '#D3D2D2',
        },
        fog: {
            main: '#EAEAEA',
        },
        whiteSmoke: {
            main: '#F5F5F5',
        },
        white: {
            main: '#FFFFFF',
        },
        error: {
            main: '#E53935',
        },
    },
    spacing: 8,
    typography: {
        fontFamily: 'Nunito Sans',
        h1: {
            fontSize: '36px',
            letterSpacing: '0px',
            color: '#000',
            fontWeight: '400',
        },
        h2: {
            fontSize: '25px',
            letterSpacing: '0.05px',
            color: '#000',
            fontWeight: '600',
        },
        h3: {
            fontSize: '19px',
            letterSpacing: '0.05px',
            color: '#000',
            fontWeight: '600',
        },
        h4: {
            fontSize: '17px',
            letterSpacing: '0.05px',
            color: '#000',
            fontWeight: '600',
        },
        h5: {
            fontSize: '15px',
            letterSpacing: '0.05px',
            color: '#000',
            fontWeight: '600',
        },
        body1: {
            fontSize: '15px',
            letterSpacing: '0.1px',
            color: '#000',
            fontWeight: '400',
        },
        body2: {
            fontSize: '12px',
            letterSpacing: '0.1px',
            color: '#000',
            fontWeight: '400',
        },
        caption: {
            fontSize: '12px',
            letterSpacing: '0.1px',
            color: '#000',
            fontWeight: '600',
        },
        button: {
            height: '40px',
            borderRadius: '4px',
            borderColor: '#9FA8DA',
            textAlign: 'center',
            fontFamily: 'Nunito Sans',
            fontSize: '15px',
            letterSpacing: '0.5px',
            color: '#3F51B5',
            fontWeight: '800',
        },
    },
});

export default theme;
