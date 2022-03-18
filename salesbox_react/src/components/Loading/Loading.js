// @flow
import * as React from 'react';
import { Segment, Dimmer, Loader } from 'semantic-ui-react';
import _l from 'lib/i18n';
import css from './Loading.css';

type PropsT = {};

addTranslations({
  'en-US': {
    'Loading...': 'Loading...',
  },
});

export default class Loading extends React.Component<PropsT> {
  render() {
    return (
      <div/>
    );
  }
}
