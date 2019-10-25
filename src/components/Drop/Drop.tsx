import React from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      backgroundColor: 'rgba(255, 255, 255, 0.25)',
      zIndex: theme.zIndex.modal,
    },
    paper: {
      padding: theme.spacing(4)
    },
  }),
);

const Drop: React.FC = () => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <Grid
        container
        justify="center"
        alignItems="center"
        style={{ minHeight: '100vh' }}
      >
        <Paper className={classes.paper}>
          <Typography variant="h2" component="p">Drop HAR file here</Typography>
        </Paper>
      </Grid>
    </div>
  );
};

export default Drop;
