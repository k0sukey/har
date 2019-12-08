import React, { useState } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import {
  createStyles,
  makeStyles,
  createMuiTheme,
  MuiThemeProvider,
} from '@material-ui/core/styles';
import Dropzone from 'react-dropzone';

import Sidebar from './components/Sidebar/Sidebar';
import Content from './components/Content/Content';
import Drop from './components/Drop/Drop';

const { remote } = window.require('electron');

const theme = createMuiTheme({
  palette: {
    type: remote.systemPreferences.isDarkMode() ? 'dark' : 'light',
  },
  overrides: {
    MuiTableCell: {
      sizeSmall: {
        '&:last-child': {
          paddingRight: 6,
        },
      },
    },
  },
});

const useStyles = makeStyles(() =>
  createStyles({
    container: {
      display: 'flex',
    },
  }),
);

const App: React.FC = () => {
  const classes = useStyles();
  const [path, setPath] = useState<string | null>(null);
  const [dropPaths, setDropPaths] = useState<string[]>([]);
  const [showDrop, setShowDrop] = useState<boolean>(false);
  const [collapse, setCollapse] = useState<boolean>(false);

  const handleDragEnter = () => {
    setShowDrop(true);
  };
  const handleDragLeave = () => {
    setShowDrop(false);
  };
  const handleDrop = (files: File[]) => {
    setShowDrop(false);

    if (files.length === 0) {
      return;
    }

    const paths = files
      .filter(file => /\.har$/i.test(file.name))
      .map(file => file.path);
    setDropPaths(paths);
  };

  return (
    <MuiThemeProvider theme={theme}>
      <Dropzone
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {({ getRootProps }) => (
          <div className={classes.container} {...getRootProps()}>
            <CssBaseline />
            <Sidebar
              dropPaths={dropPaths}
              onPath={v => setPath(v)}
              isCollapsed={collapse}
            />
            <Content path={path} onCollapse={v => setCollapse(v)} />
            {showDrop && <Drop />}
          </div>
        )}
      </Dropzone>
    </MuiThemeProvider>
  );
};

export default App;
