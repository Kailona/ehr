import React, { Component } from 'react';
import { Waypoint } from 'react-waypoint';
import {
    Paper,
    Table,
    TableContainer,
    TableBody,
    TableHead,
    TableCell,
    TableRow,
    TableFooter,
    TablePagination,
    Link,
    Menu as MuiMenu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Typography,
    withStyles,
    IconButton,
} from '@material-ui/core';
import { MoreHoriz } from '@material-ui/icons';
import { Loader } from '@kailona/ui';

const HeadCell = withStyles(theme => ({
    root: {
        fontWeight: 'bold',
        fontSize: '14px',
    },
}))(TableCell);

const Menu = withStyles({
    paper: {
        marginTop: '45px',
    },
})(MuiMenu);

export default class KailonaTable extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            anchorEl: null,
            rowData: null,
            data: [],
            page: 0,
        };

        this.previousDataLength = 0;
    }

    async componentDidMount() {
        const data = await this.props.fetchNewData(0, this.props.rowsPerPage);
        this.setState({
            data,
            loading: false,
        });
    }

    toggleContextMenu = (e, rowData) => {
        this.setState({
            anchorEl: e.currentTarget,
            rowData,
        });
    };

    handleContextMenuClose = () => {
        this.setState({
            anchorEl: null,
            rowData: null,
        });
    };

    handleMenuItemClick = menuItemClickEvent => {
        this.handleContextMenuClose();
        if (menuItemClickEvent && typeof menuItemClickEvent === 'function') {
            menuItemClickEvent(this.state.rowData);
        }
    };

    handleScroll = () => {
        if (this.state.loading) {
            return;
        }

        const page = this.state.page + 1;
        this.setState({
            loading: true,
        });
        const { fetchNewData } = this.props;
        if (fetchNewData && typeof fetchNewData === 'function') {
            fetchNewData(page, this.props.rowsPerPage).then(data => {
                const { data: existingData } = this.state;
                const previousDataLength = existingData.length;
                existingData.push(...data);

                this.setState({
                    data: existingData,
                    loading: false,
                    page,
                });

                this.previousDataLength = previousDataLength;
            });
        }
    };

    render() {
        const columnsLength = this.props.columns.length;
        const noDataColSpan = this.props.contextMenu ? columnsLength + 1 : columnsLength;
        const rowHeight = 50;
        const isWayPointAvailable = !this.state.loading && this.previousDataLength !== this.state.data.length;
        const tableHeight = (this.props.rowsPerPage + 1) * rowHeight;

        return (
            <Paper style={{ height: `${tableHeight}px`, width: '100%', position: 'relative', overflowY: 'auto' }}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                {this.props.columns.map(col => (
                                    <HeadCell>{col.label}</HeadCell>
                                ))}
                                {this.props.contextMenu && <HeadCell></HeadCell>}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.state.data.map(record => (
                                <TableRow>
                                    {this.props.columns.map((col, index) => {
                                        let displayText = record[col.key];

                                        if (col.display && typeof col.display === 'function') {
                                            displayText = col.display(record, record[col.key]);
                                        }

                                        return (
                                            <TableCell>
                                                <div>{displayText}</div>
                                                {index === 0 && (
                                                    <div>
                                                        <Link color="primary">{record.source}</Link>
                                                    </div>
                                                )}
                                            </TableCell>
                                        );
                                    })}
                                    {this.props.contextMenu && (
                                        <TableCell>
                                            <IconButton onClick={e => this.toggleContextMenu(e, record)}>
                                                <MoreHoriz />
                                            </IconButton>
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))}
                        </TableBody>
                        <TableFooter>
                            {this.state.loading && (
                                <TableRow>
                                    <TableCell colSpan={this.props.columns.length} align="center">
                                        <Loader />
                                    </TableCell>
                                </TableRow>
                            )}
                            {!this.state.loading && (!this.state.data || !this.state.data.length) && (
                                <TableRow>
                                    <TableCell colSpan={noDataColSpan} align="center">
                                        <Typography variant="h5">No data available</Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableFooter>
                    </Table>
                </TableContainer>
                {isWayPointAvailable && (
                    <div style={{ marginTop: `${rowHeight}px`, height: '20px' }}>
                        <Waypoint onEnter={this.handleScroll}></Waypoint>
                    </div>
                )}

                {this.props.pagination && (
                    <TablePagination
                        rowsPerPageOptions={[1, 5, 10, 25]}
                        component="div"
                        count={this.state.data.length}
                        rowsPerPage={this.props.rowsPerPage}
                        page={this.state.page}
                        onChangePage={(e, page) => this.props.onChangePage(e, page)}
                        onChangeRowsPerPage={e => this.props.onChangeRowsPerPage(e)}
                    />
                )}

                <Menu
                    id="table-context-menu"
                    anchorEl={this.state.anchorEl}
                    keepMounted
                    open={Boolean(this.state.anchorEl)}
                    onClose={this.handleContextMenuClose}
                >
                    {this.props.contextMenu &&
                        this.props.contextMenu.map(menuItem => {
                            return (
                                <MenuItem onClick={() => this.handleMenuItemClick(menuItem.onClick)}>
                                    <ListItemIcon size="small" style={{ minWidth: '32px' }}>
                                        {menuItem.icon}
                                    </ListItemIcon>
                                    <ListItemText primary={menuItem.label} />
                                </MenuItem>
                            );
                        })}
                </Menu>
            </Paper>
        );
    }
}
