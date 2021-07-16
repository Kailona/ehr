import { Grid, withStyles } from '@material-ui/core';

const GridColumn = withStyles({
    root: {
        '&.left-column': {
            margin: '10px 10px 10px 0',
            width: '180px',
        },
        '&.right-column': {
            margin: '10 0px 10px 10px',
            width: '180px',
        },
        '& > .MuiFormControl-root': {
            width: '100%',
        },
    },
})(Grid);

export default GridColumn;
