import React, { useEffect, useState } from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import ReactJson from 'react-json-view';
import prettier from 'prettier/standalone';
import parserHtml from 'prettier/parser-html';
import parserJs from 'prettier/parser-babylon';
import parserCss from 'prettier/parser-postcss';
import { Content } from 'har-format';

const { remote } = window.require('electron');

type Props = {
  visible: boolean;
  content: Content | null;
  height: number;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      backgroundColor: theme.palette.background.paper,
      overflow: 'scroll',
    },
    text: {
      fontSize: '0.75rem',
    },
  }),
);

const prettierPlugins = [parserHtml, parserJs, parserCss];

const Preview: React.FC<Props> = props => {
  const classes = useStyles();
  const [isText, setIsText] = useState<boolean>(false);
  const [isHtml, setIsHtml] = useState<boolean>(false);
  const [isJs, setIsJs] = useState<boolean>(false);
  const [isCss, setIsCss] = useState<boolean>(false);
  const [isImage, setIsImage] = useState<boolean>(false);
  const [isJson, setIsJson] = useState<boolean>(false);

  useEffect(() => {
    if (props.content === null) {
      return;
    }

    setIsText(/^text\/.+/i.test(props.content.mimeType));
    setIsHtml(/^text\/html$/i.test(props.content.mimeType));
    setIsJs(/^text\/javascript.+/i.test(props.content.mimeType));
    setIsCss(/^text\/css.+/i.test(props.content.mimeType));
    setIsImage(/^image\/.+/i.test(props.content.mimeType));
    setIsJson(/^application\/json$/i.test(props.content.mimeType));
  }, [props.content]);

  return props.visible && props.content !== null ? (
    <div className={classes.container} style={{ maxHeight: props.height }}>
      {isText && (
        <Typography
          variant="body1"
          component="pre"
          className={classes.text}
          style={{ maxHeight: props.height, height: props.height }}
          gutterBottom
        >
          {isHtml &&
            prettier.format(props.content.text || '', {
              parser: 'html',
              plugins: prettierPlugins,
            })}
          {isJs &&
            prettier.format(props.content.text || '', {
              parser: 'babel',
              plugins: prettierPlugins,
            })}
          {isCss &&
            prettier.format(props.content.text || '', {
              parser: 'css',
              plugins: prettierPlugins,
            })}
          {!isHtml && !isJs && !isCss && props.content.text}
        </Typography>
      )}
      {isImage && (
        <img
          src={`data:${props.content.mimeType};${props.content.encoding},${props.content.text}`}
        />
      )}
      {isJson && (
        <ReactJson
          style={{
            fontSize: '1rem',
          }}
          theme={
            remote.systemPreferences.isDarkMode() ? 'monokai' : 'rjv-default'
          }
          indentWidth={2}
          src={JSON.parse(props.content.text || '{}')}
        />
      )}
    </div>
  ) : null;
};

export default Preview;
