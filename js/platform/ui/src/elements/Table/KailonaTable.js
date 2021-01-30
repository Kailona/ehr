import React, { Component } from 'react';
import {
    Paper,
    Table,
    TableContainer,
    TableBody,
    TableHead,
    TableCell,
    TableRow,
    TablePagination,
    Link,
    withStyles,
} from '@material-ui/core';

const HeadCell = withStyles(theme => ({
    root: {
        fontWeight: 'bold',
        fontSize: '14px',
    },
}))(TableCell);

export default class KailonaTable extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Paper style={{ width: '100%' }}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                {this.props.columns.map(col => (
                                    <HeadCell>{col.label}</HeadCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.props.data.map(record => (
                                <TableRow>
                                    {this.props.columns.map((col, index) => (
                                        <TableCell>
                                            <div>{record[col.key]}</div>
                                            {index === 0 && (
                                                <div>
                                                    <Link color="primary">{record.source}</Link>
                                                </div>
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[1, 5, 10, 25]}
                    component="div"
                    count={this.props.data.length}
                    rowsPerPage={this.props.rowsPerPage}
                    page={this.props.page}
                    onChangePage={(e, page) => this.props.onChangePage(e, page)}
                    onChangeRowsPerPage={e => this.props.onChangeRowsPerPage(e)}
                />
            </Paper>
        );
    }
}
