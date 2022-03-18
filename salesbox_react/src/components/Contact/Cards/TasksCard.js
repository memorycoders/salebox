//@flow
import * as React from 'react';

import { compose, pure, branch, renderNothing, lifecycle, withHandlers, withState } from 'recompose';
import { Menu, Image, Popup } from 'semantic-ui-react';
import { TaskItem } from 'essentials';
import Collapsible from '../../Collapsible/Collapsible';
import { connect } from 'react-redux';
import { Message, Loader } from 'semantic-ui-react';
import cx from 'classnames';
import { withGetData } from 'lib/hocHelpers';

import * as ContactActions from '../contact.actions';
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
  contactInList,
  contact,
  overviewType,
  history,
  setTagManual,
  tag,
  handleHistory,
  handleOrderBy,
  orderBy,
  isFetching,
}) => {
  let objectMerge = contact;
  if (contactInList) {
    objectMerge = {
      ...contactInList,
      ...contact,
    };
  }
  const { tasks } = objectMerge;

  if (!tasks || (tasks && tasks.length === 0)) {
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
          <div className={isFetching && css.isFetching}>
            <Loader active={isFetching}>Loading</Loader>
          </div>
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
  requestFetchTasks: ContactActions.requestFetchTasks,
};

export default compose(
  connect((state, { contact }) => {
    const commonData = state.entities.contact.__COMMON_DATA;
    return {
      contactInList: state.entities.contact[contact.uuid],
      taskRefesh: commonData ? commonData.taskRefesh : 0,
      // isFetching: state.overview.CONTACTS.isFetching,
    };
  }, mapDispatchToProps),

  withState('history', 'setHistory', false),
  withState('tag', 'setTag', null),
  withState('orderBy', 'setOrderBy', 'dateAndTime'),
  //orderBy
  withGetData(({ requestFetchTasks, contact, history, tag, orderBy }) => () => {
    requestFetchTasks(contact.uuid, history, tag, orderBy);
  }),
  lifecycle({
    componentWillReceiveProps(nextProps) {
      const { requestFetchTasks, tag, history, contact, orderBy, taskRefesh } = this.props;
      if (
        contact.uuid !== nextProps.contact.uuid ||
        contact.numberActiveTask !== nextProps.contact.numberActiveTask ||
        taskRefesh !== nextProps.taskRefesh
      ) {
        requestFetchTasks(nextProps.contact.uuid, history, tag, orderBy);
      }
    },
  }),
  withHandlers({
    handleOrderBy: ({ requestFetchTasks, contact, tag, setOrderBy, history }) => (orderBy) => {
      setOrderBy(orderBy);
      requestFetchTasks(contact.uuid, history, tag, orderBy);
    },
    handleHistory: ({ requestFetchTasks, contact, tag, setHistory, orderBy }) => (history) => {
      setHistory(history);
      requestFetchTasks(contact.uuid, history, tag, orderBy);
    },
    setTagManual: ({ requestFetchTasks, contact, history, setTag, orderBy }) => (tag) => {
      setTag(tag);
      requestFetchTasks(contact.uuid, history, tag, orderBy);
    },
  })
)(TasksCard);
