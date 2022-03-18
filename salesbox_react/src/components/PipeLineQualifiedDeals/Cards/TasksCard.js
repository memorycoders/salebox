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

import * as QualifiedActions from '../qualifiedDeal.actions';
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
  objectType,
  qualifiedInList,
  qualifiedDeal,
  overviewType,
  history,
  setTagManual,
  tag,
  handleHistory,
  handleOrderBy,
  orderBy,
  isFetching,
}) => {
  let objectMerge = qualifiedDeal;
  if (qualifiedInList) {
    objectMerge = {
      ...qualifiedInList,
      ...qualifiedDeal,
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
            <TaskItem objectType={objectType} orderBy={orderBy} setOrderBy={handleOrderBy} header />
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
  requestFetchTasks: QualifiedActions.requestFetchTasks,
};

export default compose(
  connect((state, { qualifiedDeal }) => {
    const commonData = state.entities.qualifiedDeal.__COMMON_DATA;
    return {
      qualifiedInList: state.entities.qualifiedDeal[qualifiedDeal.uuid],
      taskRefesh: commonData ? commonData.taskRefesh : 0,
      // isFetching: state.overview.PIPELINE_QUALIFIED ? state.overview.PIPELINE_QUALIFIED.isFetching : false,
    };
  }, mapDispatchToProps),

  withState('history', 'setHistory', false),
  withState('tag', 'setTag', null),
  withState('orderBy', 'setOrderBy', 'dateAndTime'),
  //orderBy
  withGetData(({ requestFetchTasks, qualifiedDeal, history, tag, orderBy }) => () => {
    requestFetchTasks(qualifiedDeal.uuid, history, tag, orderBy);
  }),
  lifecycle({
    componentWillReceiveProps(nextProps) {
      const { requestFetchTasks, tag, history, qualifiedDeal, orderBy, taskRefesh } = this.props;
      if (
        qualifiedDeal.uuid !== nextProps.qualifiedDeal.uuid ||
        qualifiedDeal.numberActiveTask !== nextProps.qualifiedDeal.numberActiveTask ||
        taskRefesh !== nextProps.taskRefesh
      ) {
        requestFetchTasks(nextProps.qualifiedDeal.uuid, history, tag, orderBy);
      }
    },
  }),
  withHandlers({
    handleOrderBy: ({ requestFetchTasks, qualifiedDeal, tag, setOrderBy, history }) => (orderBy) => {
      setOrderBy(orderBy);
      requestFetchTasks(qualifiedDeal.uuid, history, tag, orderBy);
    },
    handleHistory: ({ requestFetchTasks, qualifiedDeal, tag, setHistory, orderBy }) => (history) => {
      setHistory(history);
      requestFetchTasks(qualifiedDeal.uuid, history, tag, orderBy);
    },
    setTagManual: ({ requestFetchTasks, qualifiedDeal, history, setTag, orderBy }) => (tag) => {
      setTag(tag);
      requestFetchTasks(qualifiedDeal.uuid, history, tag, orderBy);
    },
  })
)(TasksCard);
