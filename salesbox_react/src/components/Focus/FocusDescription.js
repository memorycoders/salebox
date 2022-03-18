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
    'Likes to convince, influence and inspire others': 'Likes to convince, influence and inspire others',
    'Likes to take quick decisions, to act and take lead': 'Likes to take quick decisions, to act and take lead',
    'Likes facts, quality and accuracy': 'Likes facts, quality and accuracy',
    'Likes socialising, collaboration and security': 'Likes socialising, collaboration and security',
  },
});

const discProfileDesc = {
  YELLOW: _l`Likes to convince, influence and inspire others`,
  RED: _l`Likes to take quick decisions, to act and take lead`,
  BLUE: _l`Likes facts, quality and accuracy`,
  GREEN: _l`Likes socialising, collaboration and security`,
};

const FocusDescription = ({ discProfile, styleText, styleBox, noteStyle }: PropsT) => {
  const colorCn = cx(css.color, css[discProfile]);
  return (
    <div style={noteStyle} className={css.discProfile}>
      <div style={styleBox} className={colorCn} />
      <span style={styleText} className={css.description}>{discProfileDesc[discProfile]}</span>
    </div>
  );
};

export default compose(
  branch(({ discProfile }) => !discProfile, renderNothing),
)(FocusDescription);
