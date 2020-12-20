import React, { Component } from 'react';
import { styled } from '@material-ui/core/styles';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@material-ui/core';

const HeaderTableCell = styled(TableCell)({
    fontWeight: 'bold',
});

function createData(name, dates) {
    return { name, dates };
}

const rows = [createData('Steps', [159, 6.0, 24, 4.0, 8]), createData('Elevation', [237, 9.0, 37, 4.3, 6])];

export default class ActivitiesDataModule extends Component {
    render() {
        return (
            <div style={{ margin: '20px' }}>
                <TableContainer component={Paper}>
                    <Table size="small" aria-label="Activities">
                        <TableHead>
                            <TableRow>
                                <HeaderTableCell>Item</HeaderTableCell>
                                <HeaderTableCell align="right">Dec 15, 2020</HeaderTableCell>
                                <HeaderTableCell align="right">Dec 14, 2020</HeaderTableCell>
                                <HeaderTableCell align="right">Dec 13, 2020</HeaderTableCell>
                                <HeaderTableCell align="right">Dec 12, 2020</HeaderTableCell>
                                <HeaderTableCell align="right">Dec 11, 2020</HeaderTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map(row => (
                                <TableRow key={row.name}>
                                    <TableCell component="th" scope="row">
                                        {row.name}
                                    </TableCell>
                                    <TableCell align="right">{row.dates[0]}</TableCell>
                                    <TableCell align="right">{row.dates[1]}</TableCell>
                                    <TableCell align="right">{row.dates[2]}</TableCell>
                                    <TableCell align="right">{row.dates[3]}</TableCell>
                                    <TableCell align="right">{row.dates[4]}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        );
    }
}
