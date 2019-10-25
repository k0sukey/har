import React, { useState, useEffect } from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import { Har } from 'har-format';

import { toHar } from '../../lib/to-har';
import Filter, { filterType } from './Filter';
import Request from './Request';
import { drawerWidth } from '../Sidebar/Sidebar';

const { remote } = window.require('electron');

type Props = {
  path: string | null;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      backgroundColor: theme.palette.background.default,
      flexGrow: 1,
      width: `calc(100% - ${drawerWidth}px)`,
    },
  }),
);

const Content: React.FC<Props> = props => {
  const classes = useStyles();
  const [har, setHar] = useState<Har | null>(null);
  const [filter, setFilter] = useState<filterType>('All');

  useEffect(() => {
    (async () => {
      const result = await toHar(props.path).catch(e => {
        remote.dialog.showErrorBox('Error', e.message);
        return null;
      });
      setHar(result);
    })();
  }, [props.path]);

  const handleFilter = (filter: filterType) => {
    setFilter(filter);
  };

  return (
    <main className={classes.container}>
      <AppBar position="sticky">
        <Filter onFilter={handleFilter} />
      </AppBar>
      <Request har={har} filter={filter} />
    </main>
  );
};

export default Content;
