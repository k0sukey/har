import React, { useEffect, useState } from 'react';
import {
  createStyles,
  Theme,
  makeStyles,
  withStyles,
} from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import HistoryIcon from '@material-ui/icons/History';
import OpenInBrowserIcon from '@material-ui/icons/OpenInBrowser';
import Mousetrap from 'mousetrap';
import * as uuid from 'uuid';
import clsx from 'clsx';

const { remote } = window.require('electron');

type Props = {
  onPath: (path: string) => void;
  dropPaths: string[];
  isCollapsed: boolean;
};

interface History {
  uuid: string;
  path: string;
  time: number;
}

export const drawerWidth = 180;

const shortcuts = [1, 2, 3, 4, 5, 6, 7, 8, 9];

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
      backgroundColor: theme.palette.background.default,
      whiteSpace: 'nowrap',
    },
    drawerOpen: {
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    drawerClose: {
      width: theme.spacing(7) + 1,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      overflowX: 'hidden',
    },
    drawerPaper: {
      height: '100%',
    },
    listIcon: {
      minWidth: 30,
    },
    listText: {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    histories: {
      paddingTop: 2,
      paddingBottom: 2,
      paddingLeft: theme.spacing(3),
    },
    toolbar: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      padding: theme.spacing(0, 1),
      minHeight: '60px',
    },
  }),
);

const pathToName = (v: string): string => {
  const parsed = v.split('/');
  return parsed[parsed.length - 1];
};

const StyledTooltip = withStyles((theme: Theme) => ({
  tooltip: {
    backgroundColor: theme.palette.common.black,
    color: 'rgba(255, 255, 255, 0.87)',
    fontSize: 13,
  },
}))(Tooltip);

const Sidebar: React.FC<Props> = props => {
  const classes = useStyles();
  const [histories, setHistories] = useState<History[]>([]);
  const [selected, setSelected] = useState<History | null>(null);

  useEffect(() => {
    return () => {
      Mousetrap.unbind('command+o');
      shortcuts.forEach(index => Mousetrap.unbind(`command+${index}`));
    };
  }, []);

  useEffect(() => {
    if (props.dropPaths.length === 0) {
      return;
    }

    const dropPathHistories = props.dropPaths.map(dropPath => ({
      uuid: uuid.v4(),
      path: dropPath,
      time: Date.now(),
    }));
    const [dropPathHistory] = dropPathHistories;
    props.onPath(dropPathHistory.path);
    setHistories([...histories, ...dropPathHistories]);
    setSelected(dropPathHistory);
  }, [props.dropPaths]);

  const openFile = async () => {
    const target = await remote.dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [{ name: 'HTTP Archive', extensions: ['har'] }],
    });

    if (
      target === undefined ||
      !target.filePaths ||
      target.filePaths.length === 0
    ) {
      return;
    }

    const [filePath] = target.filePaths;
    props.onPath(filePath);

    const history = { uuid: uuid.v4(), path: filePath, time: Date.now() };
    setHistories([...histories, history]);
    setSelected(history);
  };

  const handleHistory = (history: History) => {
    if (history === undefined) {
      return;
    }
    props.onPath(history.path);
    setSelected(history);
  };

  const deleteHistory = () => {
    setHistories([]);
    setSelected(null);
  };

  Mousetrap.bind('command+o', openFile);
  shortcuts.forEach(index => {
    Mousetrap.bind(`command+${index}`, () => {
      handleHistory(histories[index - 1]);
    });
  });

  return (
    <nav>
      <Drawer
        variant="permanent"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: !props.isCollapsed,
          [classes.drawerClose]: props.isCollapsed,
        })}
        classes={{
          paper: clsx(classes.drawerPaper, {
            [classes.drawerOpen]: !props.isCollapsed,
            [classes.drawerClose]: props.isCollapsed,
          }),
        }}
        anchor="left"
        open={!props.isCollapsed}
      >
        <List disablePadding style={{ paddingTop: '40px' }}>
          <StyledTooltip title="Open a new HTTP Archive file" placement="right">
            <ListItem button key="Open HAR file" onClick={openFile}>
              <ListItemIcon className={classes.listIcon}>
                <OpenInBrowserIcon />
              </ListItemIcon>
              <ListItemText primary="Open HAR file" />
            </ListItem>
          </StyledTooltip>
        </List>
        <List disablePadding>
          <ListItem key="History">
            <ListItemIcon className={classes.listIcon}>
              <HistoryIcon />
            </ListItemIcon>
            <ListItemText primary="History" />
            <StyledTooltip
              title="Clear HAR histories"
              placement="right"
              style={{ display: props.isCollapsed ? 'none' : 'block' }}
            >
              <ListItemSecondaryAction>
                <IconButton edge="end" size="small" onClick={deleteHistory}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </ListItemSecondaryAction>
            </StyledTooltip>
          </ListItem>
        </List>
        <List component="div" disablePadding dense>
          {histories
            .sort((a, b) => b.time - a.time)
            .map((history, index) => (
              <StyledTooltip
                key={`histories-${index}`}
                title={`${pathToName(history.path)} Press ⌘${index} to switch`}
                placement="right"
              >
                <ListItem
                  button
                  disableGutters
                  className={classes.histories}
                  selected={selected !== null && selected.uuid === history.uuid}
                  onClick={() => handleHistory(history)}
                >
                  <ListItemText
                    className={classes.listText}
                    primary={pathToName(history.path)}
                  />
                </ListItem>
              </StyledTooltip>
            ))}
        </List>
      </Drawer>
    </nav>
  );
};

export default Sidebar;
