//@flow
import * as React from 'react';
import _l from 'lib/i18n';
import { compose, withHandlers } from 'recompose';
import { Popup, Menu, Button, Segment } from 'semantic-ui-react';

type PropsT = {
  task: {},
  onClick: (event: Event) => void,
};

const popupStyle = {
  padding: 0,
};

const headerStyle = {
  margin: 0,
};

addTranslations({
  'en-US': {
    Actions: 'Actions',
    Assign: 'Assign',
    'Assign to me': 'Assign to me',
    Tag: 'Tag',
    Delete: 'Delete',
  },
});

const TaskMoreMenu = ({ task, onClick }: PropsT) => {
  return (
    <Popup
      horizontalOffset={-42}
      verticalOffset={-46}
      basic
      trigger={<Button onClick={onClick} compact icon="ellipsis vertical" />}
      flowing
      style={popupStyle}
      position="top right"
      hoverable
    >
      <Menu vertical>
        <Segment inverted color="purple" style={headerStyle}>
          {_l`Actions`}
        </Segment>
        <Menu.Item>{_l`Assign`}</Menu.Item>
        <Menu.Item>{_l`Assign to me`}</Menu.Item>
        <Menu.Item>{_l`Tag`}</Menu.Item>
        <Menu.Item>{_l`Delete`}</Menu.Item>
      </Menu>
    </Popup>
  );
};

export default compose(
  withHandlers({
    onClick: () => (event) => {
      event.preventDefault();
      event.stopPropagation();
    },
  })
)(TaskMoreMenu);
