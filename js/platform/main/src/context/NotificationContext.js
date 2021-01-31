import React from 'react';
import { Snackbar, withStyles } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';

const NotificationContext = React.createContext();

const styles = {
    feedbackMessage: {
        '&': {
            'z-index': 10000,
            'margin-top': '50px',
        },
        '& .MuiAlert-message': {
            fontSize: '14px',
        },
    },
};

class NotificationProviderComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isSnackbarOpen: false,
            feedback: {},
        };
    }

    showNotification = feedback => {
        if (!feedback || !feedback.severity || !feedback.message) {
            return;
        }

        this.setState({
            isSnackbarOpen: true,
            feedback,
        });
    };

    closeNotification = () => {
        this.setState({
            isSnackbarOpen: false,
            feedback: {},
        });
    };

    render() {
        const { feedback } = this.state;
        const { classes } = this.props;
        return (
            <NotificationContext.Provider
                value={{
                    showNotification: this.showNotification,
                }}
            >
                {this.props.children}

                <Snackbar
                    open={this.state.isSnackbarOpen}
                    className={classes.feedbackMessage}
                    autoHideDuration={5000}
                    onClose={this.closeNotification}
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                >
                    <Alert severity={feedback.severity} className="feedbackMessage" onClose={this.closeNotification}>
                        {feedback.message}
                    </Alert>
                </Snackbar>
            </NotificationContext.Provider>
        );
    }
}

const withNotification = Component => {
    return function WrapperComponent(props) {
        return (
            <NotificationContext.Consumer>
                {context => <Component {...props} {...context} />}
            </NotificationContext.Consumer>
        );
    };
};

const NotificationProvider = withStyles(styles)(NotificationProviderComponent);

export { NotificationContext, NotificationProvider, withNotification };
