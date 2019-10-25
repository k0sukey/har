import React from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { Entry } from 'har-format';

type Props = {
  entry: Entry | null;
  height: number;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      backgroundColor: theme.palette.background.default,
      overflow: 'scroll',
    },
    summary: {
      minHeight: '48px',
    },
    text: {
      wordBreak: 'break-all',
      margin: 0,
    },
  }),
);

const Headers: React.FC<Props> = props => {
  const classes = useStyles();

  return props.entry !== null ? (
    <div className={classes.container} style={{ maxHeight: props.height }}>
      <ExpansionPanel defaultExpanded style={{ margin: 0 }}>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">
            <Box fontWeight="fontWeightBold">General</Box>
          </Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <List>
            <ListItem alignItems="flex-start">
              <ListItemText
                primary="Request URL"
                secondary={props.entry.request.url}
                className={classes.text}
              />
            </ListItem>
            <ListItem alignItems="flex-start">
              <ListItemText
                primary="Request Method"
                secondary={props.entry.request.method}
                className={classes.text}
              />
            </ListItem>
            <ListItem alignItems="flex-start">
              <ListItemText
                primary="Status Code"
                secondary={props.entry.response.status}
                className={classes.text}
              />
            </ListItem>
            <ListItem alignItems="flex-start">
              <ListItemText
                primary="Remote Address"
                secondary={props.entry.serverIPAddress}
                className={classes.text}
              />
            </ListItem>
          </List>
        </ExpansionPanelDetails>
      </ExpansionPanel>
      <ExpansionPanel defaultExpanded style={{ margin: 0 }}>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">
            <Box fontWeight="fontWeightBold">Response Headers</Box>
          </Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <List>
            {props.entry.response.headers
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((header, index) => (
                <ListItem
                  key={`response-headers-${index}`}
                  alignItems="flex-start"
                >
                  <ListItemText
                    primary={header.name}
                    secondary={header.value}
                    className={classes.text}
                  />
                </ListItem>
              ))}
          </List>
        </ExpansionPanelDetails>
      </ExpansionPanel>
      <ExpansionPanel defaultExpanded style={{ margin: 0 }}>
        <ExpansionPanelSummary
          classes={{ expanded: classes.summary }}
          expandIcon={<ExpandMoreIcon />}
        >
          <Typography variant="subtitle1">
            <Box fontWeight="fontWeightBold">Request Headers</Box>
          </Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <List>
            {props.entry.request.headers
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((header, index) => (
                <ListItem
                  key={`request-headers-${index}`}
                  alignItems="flex-start"
                >
                  <ListItemText
                    primary={header.name}
                    secondary={header.value}
                    className={classes.text}
                  />
                </ListItem>
              ))}
          </List>
        </ExpansionPanelDetails>
      </ExpansionPanel>
      {props.entry.request.postData ? (
        <ExpansionPanel defaultExpanded style={{ margin: 0 }}>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle1">
              <Box fontWeight="fontWeightBold">Request Payload</Box>
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <List>
              {props.entry.request.postData.params ? (
                props.entry.request.postData.params
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((param, index) => (
                    <ListItem
                      key={`request-payload-${index}`}
                      alignItems="flex-start"
                    >
                      <ListItemText
                        primary={param.name}
                        secondary={param.value}
                        className={classes.text}
                      />
                    </ListItem>
                  ))
              ) : (
                <ListItem key="request-payload" alignItems="flex-start">
                  <ListItemText
                    primary={props.entry.request.postData.mimeType}
                    secondary={props.entry.request.postData.text}
                    className={classes.text}
                  />
                </ListItem>
              )}
            </List>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      ) : null}
      {props.entry.request.queryString.length > 0 ? (
        <ExpansionPanel defaultExpanded style={{ margin: 0 }}>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle1">
              <Box fontWeight="fontWeightBold">Query String Parameters</Box>
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <List>
              {props.entry.request.queryString
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((query, index) => (
                  <ListItem
                    key={`query-string-${index}`}
                    alignItems="flex-start"
                  >
                    <ListItemText
                      primary={query.name}
                      secondary={query.value}
                      className={classes.text}
                    />
                  </ListItem>
                ))}
            </List>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      ) : null}
    </div>
  ) : null;
};

export default Headers;
