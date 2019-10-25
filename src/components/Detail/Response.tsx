import React, { useEffect, useState } from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { Response as HarResponse } from 'har-format';

type Props = {
  response: HarResponse | null;
  height: number;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      backgroundColor: theme.palette.background.paper,
    },
    code: {
      overflow: 'scroll',
      fontSize: '0.75rem',
    },
  }),
);

const Response: React.FC<Props> = props => {
  const classes = useStyles();
  const [isText, setIsText] = useState<boolean>(false);

  useEffect(() => {
    if (props.response === null) {
      return;
    }

    setIsText(/^text.*/.test(props.response.content.mimeType));
  }, [props.response]);

  return isText && props.response !== null ? (
    <div className={classes.container}>
      <Typography
        variant="body1"
        component="pre"
        className={classes.code}
        style={{ maxHeight: props.height }}
        gutterBottom
      >
        {props.response.content.text}
      </Typography>
    </div>
  ) : (
    <div className={classes.container}>
      <Typography variant="h4" gutterBottom>
        This request has no response data available.
      </Typography>
    </div>
  );
};

export default Response;
