// @flow
import * as React from 'react';
import { compose, withHandlers } from 'recompose';
import { Button } from 'semantic-ui-react';
import type { CallbackType } from 'types/semantic-ui.types';

type PropsT = {
  name: string,
  gotoView: CallbackType,
};

const ViewButton = ({ name, gotoView, ...other }: PropsT) => {
  return <Button {...other} onClick={gotoView} content={name} />;
};

export default compose(
  withHandlers({
    gotoView: ({ name, gotoView }) => () => gotoView(name),
  })
)(ViewButton);
