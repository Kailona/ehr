import React, { Component } from 'react';
import axios from 'axios/index';
import moment from 'moment';
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
    }

    componentDidMount() {
        this.fetchFiles();
    }

    async fetchFiles() {
        this.setState({
            loading: true,
        });

        const url = `/apps/ehr/documents/fetch`;
        const parent = ProfileManager.activePatientId;
        const { data } = await axios.post(url, {
            parent,
            offset: this.state.page,
            limit: this.state.rowsPerPage,
        });

        const { data: existingData } = this.state;
        existingData.push(...data);

        this.setState({
            data: existingData,
            loading: false,
        });
    }

    fetchNextFiles = async () => {
        // Wait for the previous request
        if (this.state.loading) {
            return;
        }

        this.setState(
            {
                page: (this.state.page + 1) * this.state.rowsPerPage,
            },
            () => {
                this.fetchFiles();
            }
        );
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
                            data={this.state.data}
                            columns={this.state.columns}
                            page={this.state.page}
                            rowsPerPage={this.state.rowsPerPage}
                            contextMenu={this.contextMenuOptions}
                            loading={this.state.loading}
                            fetchNewData={this.fetchNextFiles}
                        />
                    </Box>
                </div>
            </div>
        );
    }
}
