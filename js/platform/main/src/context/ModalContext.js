import React from 'react';
import ImportDataModal from '../components/ImportData/ImportDataModal';
import RequestDataModal from '../components/RequestData/RequestDataModal';

const ModalContext = React.createContext();

class ModalProvider extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isImportDataModalOpen: false,
            isRequestDataModalOpen: false,
        };
    }

    toggleImportDataModal = open => {
        this.setState({
            isImportDataModalOpen: open,
        });
    };

    toggleRequestDataModal = open => {
        this.setState({
            isRequestDataModalOpen: open,
        });
    };

    render() {
        return (
            <ModalContext.Provider
                value={{
                    toggleImportDataModal: this.toggleImportDataModal,
                    toggleRequestDataModal: this.toggleRequestDataModal,
                }}
            >
                {this.props.children}
                <ImportDataModal
                    isOpen={this.state.isImportDataModalOpen}
                    onClose={() => this.toggleImportDataModal(false)}
                />
                <RequestDataModal
                    isOpen={this.state.isRequestDataModalOpen}
                    onClose={() => this.toggleRequestDataModal(false)}
                />
            </ModalContext.Provider>
        );
    }
}

const withModal = Component => {
    return function WrapperComponent(props) {
        return <ModalContext.Consumer>{context => <Component {...props} {...context} />}</ModalContext.Consumer>;
    };
};

export { ModalContext, ModalProvider, withModal };
