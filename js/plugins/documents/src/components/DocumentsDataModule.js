import React, { Component } from 'react';
import moment from 'moment';
import { Typography, Box, Link } from '@material-ui/core';
import { KailonaTable, KailonaButton } from '@kailona/ui';
import { DocumentService, Logger } from '@kailona/core';
import { withModal } from '../../../../platform/main/src/context/ModalContext';

const logger = new Logger('Documents.DocumentsDataModule');

class DocumentsDataModule extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            filters: {
                dateRange: {
                    begin: moment()
                        .clone()
                        .subtract(1, 'month'),
                    end: moment(),
                },
            },
            page: -1,
            rowsPerPage: 25,
            data: [],
            columns: [
                {
                    label: '',
                    key: 'modifiedDate',
                    display: (row, value) => {
                        return moment(value).format('ddd, MMM D, YYYY, HH:mm');
                    },
                },
                {
                    label: t('ehr', 'Name'),
                    key: 'name',
                    display: (row, value) => {
                        const viewFileUrl = OC.generateUrl(row.path);

                        return (
                            <Link href={viewFileUrl} target="_blank" color="primary">
                                {value}
                            </Link>
                        );
                    },
                },
            ],
        };

        this.documentService = new DocumentService();
    }

    componentDidMount = () => {
        this.fetchFiles();
    };

    fetchFiles = async () => {
        this.setState({
            loading: true,
        });

        try {
            const page = this.state.page + 1;
            const offset = page * this.state.rowsPerPage;

            const { data: nextData } = await this.documentService.fetch(offset, this.state.rowsPerPage);

            const data = [...this.state.data, ...nextData];

            this.setState({
                loading: false,
                data,
                page,
            });
        } catch (error) {
            logger.error(error);

            this.setState({
                loading: false,
            });
        }
    };

    componentDidUpdate = (prevProps, prevState) => {
        if (prevProps.isImportDataModalOpen && !this.props.isImportDataModalOpen) {
            this.setState(
                {
                    page: -1,
                    data: [],
                },
                () => this.fetchFiles()
            );
        }
    };

    render() {
        return (
            <div>
                <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <div>
                        <div className="title">
                            <Typography variant="h3">{t('ehr', 'Documents')}</Typography>
                        </div>
                        <Box className="add-new" mt={2}>
                            <KailonaButton
                                class="primary"
                                title={t('ehr', 'Add Document')}
                                onClick={() => this.props.toggleImportDataModal(true)}
                            />
                        </Box>
                    </div>

                    <Box className="content" mt={3} style={{ display: 'flex', flex: 1 }}>
                        <KailonaTable
                            data={this.state.data}
                            columns={this.state.columns}
                            page={this.state.page}
                            rowsPerPage={this.state.rowsPerPage}
                            loading={this.state.loading}
                            fetchNewData={this.fetchFiles}
                        />
                    </Box>
                </div>
            </div>
        );
    }
}

export default withModal(DocumentsDataModule);
