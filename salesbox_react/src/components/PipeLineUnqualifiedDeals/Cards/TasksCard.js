//@flow
import * as React from 'react';

import { compose, pure, branch, renderNothing, lifecycle, withHandlers, withState } from 'recompose';
import { Menu, Image, Popup, Loader } from 'semantic-ui-react';
import { TaskItem } from 'essentials';
import Collapsible from '../../Collapsible/Collapsible';
import { connect } from 'react-redux';
import { Message } from 'semantic-ui-react';
import cx from 'classnames';
import { withGetData } from 'lib/hocHelpers';

import * as UnqualifiedActions from '../unqualifiedDeal.actions';
import historyIcon from '../../../../public/History.svg';
import FilterActionMenu from '../../../essentials/Menu/FilterActionMenu';
import _l from 'lib/i18n';
import { ObjectTypes } from '../../../Constants';
import css from './TasksCard.css';
import { setOrderBy } from '../../AdvancedSearch/advanced-search.actions';
addTranslations({
  'en-US': {
    '{0}': '{0}',
    Reminders: 'Reminders',
    'No reminders': 'No reminders',
    History: 'History',
  },
});

const RightMenu = ({ handleHistory, tag, setTagManual, history }) => {
  return (
    <>
      <Menu.Item
        className={cx(css.rightIcon, history && css.circleAvtive)}
        onClick={() => {
          handleHistory(!history);
        }}
      >
        <Popup hoverable position="top right" trigger={<Image className={css.historyIcon} src={historyIcon} />}>
          <Popup.Content>
            <p>{_l`History`}</p>
          </Popup.Content>
        </Popup>
      </Menu.Item>
      <Menu.Item className={`${css.rightIcon} ${css.mr2}`}>
        <FilterActionMenu
          imageClass={css.historyIcon}
          propsValueSet={tag}
          setTagManual={setTagManual}
          objectType={ObjectTypes.Task}
        />
      </Menu.Item>
    </>
  );
};

const TasksCard = ({
  route,
  leadInUnqualified,
  unqualifiedDeal,
  overviewType,
  history,
  setTagManual,
  tag,
  handleHistory,
  handleOrderBy,
  orderBy,
  isFetching,
}) => {
  let objectMerge = unqualifiedDeal;

  if (leadInUnqualified) {
    objectMerge = {
      ...leadInUnqualified,
      ...unqualifiedDeal,
    };
  }
  const { tasks } = objectMerge;
  // if (unqualifiedDeal.countOfActiveTask === 0 || tasks && tasks.length === 0) {
  if (!tasks) {
    return (
      <Collapsible
        count="0"
        rightClassName={css.headerRight}
        right={<RightMenu handleHistory={handleHistory} tag={tag} setTagManual={setTagManual} history={history} />}
        width={308}
        padded
        title={_l`Reminders`}
      >
        <div className={isFetching ? css.isFetching : ''}>
          {isFetching ? (
            <Loader active={isFetching}>Loading</Loader>
          ) : (
            <Message active info>
              {_l`No reminders`}
            </Message>
          )}
        </div>
      </Collapsible>
    );
  }

  return (
    <Collapsible
      rightClassName={css.headerRight}
      right={<RightMenu handleHistory={handleHistory} tag={tag} setTagManual={setTagManual} history={history} />}
      width={308}
      title={_l`Reminders`}
      count={tasks ? tasks.length : ''}
      open={true}
    >
      <div className={isFetching ? css.isFetching : ''}>
        {isFetching ? (
          <Loader active={isFetching}>Loading</Loader>
        ) : (
          <>
            <TaskItem orderBy={orderBy} setOrderBy={handleOrderBy} header />
            {(tasks ? tasks : []).map((taskId) => {
              return <TaskItem route={route} overviewType={overviewType} taskId={taskId} key={taskId} />;
            })}
          </>
        )}
      </div>
    </Collapsible>
  );
};

const mapDispatchToProps = {
  requestFetchTasks: UnqualifiedActions.requestFetchTasks,
};

export default compose(
  connect((state, { unqualifiedDeal }) => {
    return {
      leadInUnqualified: state.entities.unqualifiedDeal[unqualifiedDeal.uuid],
      isFetching: state.overview.PIPELINE_LEADS ? state.overview.PIPELINE_LEADS.isFetching : false,
    };
  }, mapDispatchToProps),

  withState('history', 'setHistory', false),
  withState('tag', 'setTag', null),
  withState('orderBy', 'setOrderBy', 'dateAndTime'),
  //orderBy
  withGetData(({ requestFetchTasks, unqualifiedDeal, history, tag, orderBy }) => () => {
    requestFetchTasks(unqualifiedDeal.uuid, history, tag, orderBy);
  }),
  lifecycle({
    componentWillReceiveProps(nextProps) {
      const { requestFetchTasks, tag, history, unqualifiedDeal, orderBy } = this.props;
      if (
        unqualifiedDeal.uuid !== nextProps.unqualifiedDeal.uuid ||
        unqualifiedDeal.countOfActiveTask !== nextProps.unqualifiedDeal.countOfActiveTask
      ) {
        requestFetchTasks(nextProps.unqualifiedDeal.uuid, history, tag, orderBy);
      }
    },
  }),
  withHandlers({
    handleOrderBy: ({ requestFetchTasks, unqualifiedDeal, tag, setOrderBy, history }) => (orderBy) => {
      setOrderBy(orderBy);
      requestFetchTasks(unqualifiedDeal.uuid, history, tag, orderBy);
    },
    handleHistory: ({ requestFetchTasks, unqualifiedDeal, tag, setHistory, orderBy }) => (history) => {
      setHistory(history);
      requestFetchTasks(unqualifiedDeal.uuid, history, tag, orderBy);
    },
    setTagManual: ({ requestFetchTasks, unqualifiedDeal, history, setTag, orderBy }) => (tag) => {
      setTag(tag);
      requestFetchTasks(unqualifiedDeal.uuid, history, tag, orderBy);
    },
  })
)(TasksCard);
