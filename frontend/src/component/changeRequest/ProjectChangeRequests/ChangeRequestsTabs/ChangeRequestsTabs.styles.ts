import { makeStyles } from 'tss-react/mui';

export const useStyles = makeStyles()(theme => ({
    header: {
        padding: theme.spacing(0, 4),
    },
    bodyClass: {
        padding: theme.spacing(2, 4, 4, 4),
        overflowX: 'auto',
    },
}));
