import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Button from '@material-ui/core/Button';
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';
import { Entry } from 'har-format';
import mousetrap from 'mousetrap';

import { drawerWidth } from '../Sidebar/Sidebar';
import Headers from './Headers';
import Preview from './Preview';
import Response from './Response';

type Props = {
  show: boolean | false;
  entry: Entry | null;
  onHide: () => void;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      backgroundColor: theme.palette.background.paper,
      position: 'fixed',
      top: 40,
      right: 0,
      width: `calc(100% - ${drawerWidth + 60}px)`,
      height: 'calc(100% - 40px)',
      boxShadow: '-2px 0 10px rgba(0,0,0,0.2)',
      zIndex: 2,
    },
    tabs: {
      display: 'flex',
    },
  }),
);

const Detail: React.FC<Props> = props => {
  const classes = useStyles();
  const [tab, setTab] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const headersRef = useRef<HTMLDivElement | null>(null);

  const resize = useCallback(() => {
    if (containerRef === null || containerRef.current === null) {
      return;
    }

    const container = containerRef.current.getBoundingClientRect();
    const tabs = containerRef.current.children[0].getBoundingClientRect();
    setHeight(container.height - tabs.height);
  }, []);

  useEffect(() => {
    mousetrap.bind('esc', props.onHide);
    return () => {
      mousetrap.unbind('esc');
    };
  }, []);

  useEffect(() => resize(), [props.show && props.entry !== null]);

  useEffect(() => {
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  useEffect(() => {
    setTab(0);

    if (headersRef.current !== null) {
      headersRef.current.children[0].scrollTo({ top: 0 });
    }
  }, [props.entry]);

  const changeTab = (event: React.ChangeEvent<{}>, index: number) => {
    setTab(index);
  };

  return props.show && props.entry !== null ? (
    <div ref={containerRef} className={classes.container}>
      <div className={classes.tabs}>
        <Button onClick={props.onHide}>
          <CloseRoundedIcon />
        </Button>
        <Tabs
          value={tab}
          onChange={changeTab}
          indicatorColor="secondary"
          textColor="secondary"
          variant="fullWidth"
        >
          <Tab label="Headers" />
          <Tab label="Preview" />
          <Tab label="Response" />
        </Tabs>
      </div>
      <div ref={headersRef} hidden={tab !== 0}>
        <Headers entry={props.entry} height={height} />
      </div>
      <div hidden={tab !== 1}>
        <Preview
          visible={tab === 1}
          content={props.entry.response.content}
          height={height}
        />
      </div>
      <div hidden={tab !== 2}>
        <Response response={props.entry.response} height={height} />
      </div>
    </div>
  ) : null;
};

export default Detail;
