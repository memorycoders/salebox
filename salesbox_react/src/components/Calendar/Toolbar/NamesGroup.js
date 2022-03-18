// @flow
import * as React from 'react';
import { compose, withHandlers } from 'recompose';
import { Button } from 'semantic-ui-react';
import ViewButton from './ViewButton';

type PropsType = {
  views: Array<string>,
  gotoView: (string) => void,
  view: string,
};

const NamesGroup = ({ view, views, gotoView }: PropsType) => {
  return (
    <Button.Group>
      {views.map((name) => {
        return <ViewButton active={view === name} key={name} name={name} gotoView={gotoView} />;
      })}
    </Button.Group>
  );
};

export default compose(
  withHandlers({
    gotoView: ({ onViewChange }) => (view) => onViewChange(view),
  })
)(NamesGroup);
