// @flow
import * as React from 'react';
import { compose, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import { Menu, Icon } from 'semantic-ui-react';
import _l from 'lib/i18n';
import { CssNames } from 'Constants';
import MoreMenu from 'components/MoreMenu/MoreMenu';
import * as OverviewActions from 'components/Overview/overview.actions';
import { updateCreate } from '../../components/Task/task.actions';

type PropsT = {
  duplicateTask: () => void,
  className: tring,
};

addTranslations({
  'en-US': {
    Actions: 'Action',
    Copy: 'Copy',
  },
});

const HistoryActionMenu = ({ duplicateTask, className }: PropsT) => {
  return (
    <MoreMenu className={className} color={CssNames.Task}>
      {/* FIXME: Add Delegate Here */}
      <Menu.Item icon onClick={duplicateTask}>
        <Icon name='copy outline'/>
        {_l`Copy`}
      </Menu.Item>
    </MoreMenu>
  );
};

export default compose(
  connect(null, {
    highlight: OverviewActions.highlight,
    updateCreate,
  }),
  withHandlers({
    duplicateTask: ({ overviewType, highlight, task, updateCreate }) => () => {
      // updateCreate(task);
      updateCreate({ ...task, organisationDTO: task.organisationDTO ? task.organisationDTO : (
          task.organisation
        )});
      highlight(overviewType, task.uuid, 'duplicate');
    },
  })
)(HistoryActionMenu);
