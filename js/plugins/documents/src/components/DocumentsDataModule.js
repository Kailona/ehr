import React, { Component } from 'react';
import axios from 'axios/index';
import { Typography, Box, Link } from '@material-ui/core';
import { KailonaTable } from '@kailona/ui';
import { ProfileManager } from '@kailona/core';

export default class DocumentsDataModule extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            page: 0,
            rowsPerPage: 10,
            data: [],
            columns: [
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
                {
                    label: t('ehr', 'Modified Date'),
                    key: 'modifiedDate',
                },
            ],
        };
    }

    async componentDidMount() {
        const response = await this.fetchFiles();
        this.setState({
            data: response.data,
            loading: false,
        });
    }

    async fetchFiles() {
        const url = `/apps/ehr/documents/fetch`;
        const parent = ProfileManager.activePatientId;
        return await axios.post(url, {
            parent,
        });
    }

    render() {
        return (
            <div>
                <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <div>
                        <div className="title">
                            <Typography variant="h3">{t('ehr', 'Documents')}</Typography>
                        </div>
                    </div>

                    <Box className="content" mt={3} style={{ display: 'flex', flex: 1 }}>
                        <KailonaTable
                            data={this.state.data}
                            columns={this.state.columns}
                            page={this.state.page}
                            rowsPerPage={this.state.rowsPerPage}
                            onChangePage={this.onChangePage}
                            onChangeRowsPerPage={this.onChangeRowsPerPage}
                            contextMenu={this.contextMenuOptions}
                            loading={this.state.loading}
                        />
                    </Box>
                </div>
            </div>
        );
    }
}
