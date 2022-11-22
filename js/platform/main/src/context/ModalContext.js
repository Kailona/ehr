import React from 'react';
import ImportDataModal from '../components/ImportData/ImportDataModal';
import RequestDataModal from '../components/RequestData/RequestDataModal';
import ProfileEditModal from '../components/ProfileHeader/ProfileEditModal';

const ModalContext = React.createContext();

class ModalProvider extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isImportDataModalOpen: false,
            isRequestDataModalOpen: false,
            isProfileEditModalOpen: false,
            profileEditModalProps: {},
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

    toggleProfileEditModal = (open, props = {}) => {
        this.setState({
            isProfileEditModalOpen: open,
            profileEditModalProps: props,
        });
    };

    render() {
        return (
            <ModalContext.Provider
                value={{
                    toggleImportDataModal: this.toggleImportDataModal,
                    toggleRequestDataModal: this.toggleRequestDataModal,
                    toggleProfileEditModal: this.toggleProfileEditModal,
                    isImportDataModalOpen: this.state.isImportDataModalOpen,
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
                <ProfileEditModal
                    isOpen={this.state.isProfileEditModalOpen}
                    onClose={() => this.toggleProfileEditModal(false)}
                    {...this.state.profileEditModalProps}
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
