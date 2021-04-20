import React, { Component } from 'react';
import moment from 'moment';
import { Typography, Box, Link } from '@material-ui/core';
import { KailonaTable } from '@kailona/ui';
import { DocumentService } from '@kailona/core';

export default class DocumentsDataModule extends Component {
    constructor(props) {
        super(props);

        this.state = {
            rowsPerPage: 10,
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

    fetchFiles = async (page, rowsPerPage) => {
        const { data: data } = await this.documentService.fetch(page, rowsPerPage);
        return data;
    };

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
                            columns={this.state.columns}
                            rowsPerPage={this.state.rowsPerPage}
                            contextMenu={this.contextMenuOptions}
                            fetchNewData={this.fetchFiles}
                        />
                    </Box>
                </div>
            </div>
        );
    }
}
