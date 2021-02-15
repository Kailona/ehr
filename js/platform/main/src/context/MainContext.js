import React from 'react';

const MainContext = React.createContext();

class MainContextProvider extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            userId: null,
        };
    }

    setUserId = userId => {
        this.setState({
            userId,
        });
    };

    render() {
        return (
            <MainContext.Provider
                value={{
                    userId: this.state.userId,
                    setUserId: this.setUserId,
                }}
            >
                {this.props.children}
            </MainContext.Provider>
        );
    }
}

const withMain = Component => {
    return function WrapperComponent(props) {
        return <MainContext.Consumer>{context => <Component {...props} {...context} />}</MainContext.Consumer>;
    };
};

export { MainContext, MainContextProvider, withMain };
