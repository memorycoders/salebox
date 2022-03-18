//@flow
import * as React from 'react';
import { compose, branch, renderNothing } from 'recompose';
import cx from 'classnames';
import _l from 'lib/i18n';
import css from './FocusDescription.css';

type PropsT = {
  discProfile: string,
};

addTranslations({
  'en-US': {
    'Relationship is neutral': 'Relationship is neutral',
    'Relationship is bad': 'Relationship is bad',
    'Relationship is undefined': 'Relationship is undefined',
    'Relationship is good': 'Relationship is good',
    'Yellow': 'Yellow',
    'Red': 'Red',
    'Green': 'Green',
    'None': 'None'
  },
});

const discProfileDesc = {
  YELLOW: _l`Relationship is neutral`,
  RED: _l`Relationship is bad`,
  NONE: _l`Relationship is undefined`,
  GREEN: _l`Relationship is good`,
};

const discProfileColor = {
  YELLOW: _l`Yellow`,
  RED: _l`Red`,
  NONE: _l`None`,
  GREEN: _l`Green`,
};

const FocusDescription = ({ discProfile, styleText, styleBox, noteStyle }: PropsT) => {
  const colorCn = cx(css.color, css[discProfile]);
  return (
    <div style={noteStyle} className={css.discProfile}>
      {/* <div style={styleBox} className={colorCn} /> */}
      <span style={{ fontSize: 11, fontWeight: 600}}>{discProfileColor[discProfile]}: </span><span style={styleText} className={css.description}>{discProfileDesc[discProfile]}</span>
    </div>
  );
};

export default compose(
  branch(({ discProfile }) => !discProfile, renderNothing),
)(FocusDescription);
