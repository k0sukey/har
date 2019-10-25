import React, { useState } from 'react';
import {
  createStyles,
  Theme,
  makeStyles,
  withStyles,
} from '@material-ui/core/styles';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';

export type filterType = 'All' | 'XHR' | 'JS' | 'CSS' | 'Img' | 'Doc' | 'Other';

type Props = {
  onFilter: (filter: filterType) => void;
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
  const [filter, setFilter] = useState<filterType>('All');

  const handleFilter = (
    event: React.MouseEvent<HTMLElement>,
    newFilter: filterType,
  ) => {
    if (newFilter === null) {
      return;
    }

    setFilter(newFilter);
    props.onFilter(newFilter);
  };

  return (
    <div className={classes.container}>
      <StyledToggleButtonGroup
        exclusive
        value={filter}
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
    </div>
  );
};

export default Filter;
