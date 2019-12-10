import React from 'react';
import {
  createStyles,
  Theme,
  makeStyles,
  withStyles,
} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

export type filterType = 'All' | 'XHR' | 'JS' | 'CSS' | 'Img' | 'Doc' | 'Other';

type Props = {
  filter: filterType;
  onFilter: (filter: filterType) => void;
  collapse: boolean;
  onCollapse: (isCollapsed: boolean) => void;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      backgroundColor: theme.palette.background.paper,
    },
  }),
);

const StyledToggleButtonGroup = withStyles(theme => ({
  root: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'stretch',
  },
  grouped: {
    margin: theme.spacing(0.5),
    border: 'none',
    padding: theme.spacing(0, 1),
    '&:not(:first-child)': {
      borderRadius: theme.shape.borderRadius,
    },
    '&:first-child': {
      borderRadius: theme.shape.borderRadius,
    },
  },
  groupedSizeSmall: {
    flexGrow: 1,
    height: '32px',
  },
}))(ToggleButtonGroup);

const Filter: React.FC<Props> = props => {
  const classes = useStyles();

  const handleFilter = (
    event: React.MouseEvent<HTMLElement>,
    newFilter: filterType,
  ) => {
    if (newFilter === null) {
      return;
    }

    props.onFilter(newFilter);
  };

  const handleDrawerToggle = () => props.onCollapse(!props.collapse);

  return (
    <div className={classes.container}>
      <Grid container justify="space-around" alignItems="center">
        <Grid item xs={1} style={{ textAlign: 'center' }}>
          <IconButton onClick={handleDrawerToggle} size="small">
            {props.collapse ? (
              <ChevronRightIcon fontSize="small" />
            ) : (
              <ChevronLeftIcon fontSize="small" />
            )}
          </IconButton>
        </Grid>
        <Grid item xs={11}>
          <StyledToggleButtonGroup
            exclusive
            value={props.filter}
            size="small"
            onChange={handleFilter}
          >
            <ToggleButton value="All">All</ToggleButton>
            <ToggleButton value="XHR">XHR</ToggleButton>
            <ToggleButton value="JS">JS</ToggleButton>
            <ToggleButton value="CSS">CSS</ToggleButton>
            <ToggleButton value="Img">Img</ToggleButton>
            <ToggleButton value="Doc">Doc</ToggleButton>
            <ToggleButton value="Other">Other</ToggleButton>
          </StyledToggleButtonGroup>
        </Grid>
      </Grid>
    </div>
  );
};

export default Filter;
