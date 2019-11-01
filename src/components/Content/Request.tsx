import React, { useEffect, useState } from 'react';
import {
  createStyles,
  Theme,
  makeStyles,
  withStyles,
} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Tooltip from '@material-ui/core/Tooltip';
import red from '@material-ui/core/colors/red';
import grey from '@material-ui/core/colors/grey';
import pink from '@material-ui/core/colors/pink';
import clsx from 'clsx';
import { Har, Entry } from 'har-format';
import prettyBytes from 'pretty-bytes';
import Status from 'statuses';

import Detail from '../Detail/Detail';
import { filterType } from './Filter';
import { drawerWidth } from '../Sidebar/Sidebar';

type Props = {
  har: Har | null;
  filter: filterType | 'All';
};

type mimeType = 'XHR' | 'JS' | 'CSS' | 'Img' | 'Doc' | 'Other';

interface Row {
  url: string;
  name: string;
  method: string;
  status: number;
  type: mimeType;
  size: string;
  time: string;
  entry: Entry;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      backgroundColor: theme.palette.background.default,
      position: 'fixed',
      top: 40,
      right: 0,
      width: `calc(100% - ${drawerWidth}px)`,
      height: 'calc(100% - 48px)',
      overflow: 'scroll',
    },
    row: {
      backgroundColor: theme.palette.background.paper,
      cursor: 'pointer',
      userSelect: 'none',
    },
    nameHead: {
      minWidth: 1,
      maxWidth: 1,
      padding: 6,
    },
    methodHead: {
      width: 60,
      minWidth: 60,
      maxWidth: 60,
      padding: 6,
    },
    statusHead: {
      width: 40,
      minWidth: 40,
      maxWidth: 40,
      padding: 6,
    },
    typeHead: {
      width: 40,
      minWidth: 40,
      maxWidth: 40,
      padding: 6,
    },
    sizeHead: {
      width: 60,
      minWidth: 60,
      maxWidth: 60,
      padding: 6,
    },
    timeHead: {
      width: 60,
      minWidth: 60,
      maxWidth: 60,
      padding: 6,
    },
    nameBody: {
      minWidth: 1,
      maxWidth: 1,
      padding: 6,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
    methodBody: {
      width: 60,
      minWidth: 60,
      maxWidth: 60,
      padding: 6,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
    statusBody: {
      width: 40,
      minWidth: 40,
      maxWidth: 40,
      padding: 6,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
    typeBody: {
      width: 40,
      minWidth: 40,
      maxWidth: 40,
      padding: 6,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
    sizeBody: {
      width: 60,
      minWidth: 60,
      maxWidth: 60,
      padding: 6,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
    timeBody: {
      width: 60,
      minWidth: 60,
      maxWidth: 60,
      padding: 6,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
    textRed: {
      color: red[500],
    },
    textGrey: {
      color: grey[500],
    },
  }),
);

const urlToName = (url: string): string => {
  const parsed = url.split('/');
  const result = parsed[parsed.length - 1];
  return result !== '' ? result : `${parsed[parsed.length - 2]}/`;
};

const mimeToType = (mime: string): mimeType => {
  if (/^application\/json$/.test(mime)) {
    return 'XHR';
  }
  if (/^text\/javascript$/.test(mime)) {
    return 'JS';
  }
  if (/^text\/css$/.test(mime)) {
    return 'CSS';
  }
  if (/^image\/.+/.test(mime)) {
    return 'Img';
  }
  if (/^text\/.+/.test(mime)) {
    return 'Doc';
  }

  return 'Other';
};

const StyledTableRow = withStyles((theme: Theme) =>
  createStyles({
    root: {
      '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.background.default,
      },
    },
    selected: {
      '&:nth-of-type(odd)': {
        backgroundColor: pink[500],
      },
      '&:nth-of-type(even)': {
        backgroundColor: pink[500],
      },
    },
  }),
)(TableRow);

const StyledTooltip = withStyles((theme: Theme) => ({
  tooltip: {
    backgroundColor: theme.palette.common.black,
    color: 'rgba(255, 255, 255, 0.87)',
    fontSize: 13,
  },
}))(Tooltip);

const Request: React.FC<Props> = props => {
  const classes = useStyles();
  const [rows, setRows] = useState<Row[]>([]);
  const [selectedKey, setSelectedKey] = useState<number | null>(null);
  const [entry, setEntry] = useState<Entry | null>(null);

  useEffect(() => {
    if (props.har === null) {
      return;
    }

    setRows(
      props.har.log.entries.map(entry => ({
        url: entry.request.url,
        name: urlToName(entry.request.url),
        method: entry.request.method,
        status: entry.response.status,
        type: mimeToType(entry.response.content.mimeType),
        size: prettyBytes(entry.response.content.size),
        time: `${Math.floor(entry.time)}`,
        entry,
      })),
    );

    setSelectedKey(null);
    setEntry(null);
  }, [props.har]);

  const showDetail = (key: number, entry: Entry) => {
    setSelectedKey(selectedKey === key ? null : key);
    setEntry(entry);
  };

  const hideDetail = () => {
    setSelectedKey(null);
    setEntry(null);
  };

  const isOption = (method: string): boolean => method === 'OPTIONS';
  const is0 = (status: number): boolean => /^0$/.test(status.toString());
  const is100 = (status: number): boolean => /^1.+/.test(status.toString());
  const is400 = (status: number): boolean => /^4.+/.test(status.toString());
  const is500 = (status: number): boolean => /^5.+/.test(status.toString());

  return (
    <div className={classes.container}>
      <Table stickyHeader size="small">
        <TableHead>
          <TableRow>
            <TableCell className={classes.nameHead}>Name</TableCell>
            <TableCell className={classes.methodHead}>Method</TableCell>
            <TableCell className={classes.statusHead}>Status</TableCell>
            <TableCell className={classes.typeHead}>Type</TableCell>
            <TableCell className={classes.sizeHead}>Size</TableCell>
            <TableCell className={classes.timeHead}>Time</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows
            .filter(row =>
              props.filter === 'All' ? true : props.filter === row.type,
            )
            .map((row, index) => (
              <StyledTableRow
                key={index}
                className={classes.row}
                hover
                selected={index === selectedKey}
                onClick={() => showDetail(index, row.entry)}
              >
                <StyledTooltip title={row.url} placement="top-start">
                  <TableCell
                    className={clsx(
                      classes.nameBody,
                      is400(row.status) || is500(row.status)
                        ? classes.textRed
                        : null,
                      isOption(row.method) ||
                        is0(row.status) ||
                        is100(row.status)
                        ? classes.textGrey
                        : null,
                    )}
                    component="th"
                    scope="row"
                  >
                    <small>{row.name}</small>
                  </TableCell>
                </StyledTooltip>
                <TableCell className={classes.methodBody}>
                  <small>{row.method}</small>
                </TableCell>
                <StyledTooltip title={Status[row.status]} placement="top-start">
                  <TableCell className={classes.statusBody}>
                    <small>{row.status}</small>
                  </TableCell>
                </StyledTooltip>
                <TableCell className={classes.typeBody}>
                  <small>{row.type}</small>
                </TableCell>
                <TableCell className={classes.sizeBody} align="right">
                  <small>{row.size}</small>
                </TableCell>
                <TableCell className={classes.timeBody} align="right">
                  <small>{row.time} ms</small>
                </TableCell>
              </StyledTableRow>
            ))}
        </TableBody>
      </Table>
      <Detail show={selectedKey !== null} entry={entry} onHide={hideDetail} />
    </div>
  );
};

export default Request;
