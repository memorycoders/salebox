//@flow
import * as React from 'react';

import { compose, pure, branch, renderNothing, lifecycle, withHandlers, withState } from 'recompose';
import { Menu, Image, Popup, Loader } from 'semantic-ui-react';
import AppointmentItem from '../../../essentials/List/Appointment/AppointmentItem';
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
addTranslations({
  'en-US': {
    '{0}': '{0}',
    'No meetings': 'No meetings',
    History: 'History',
  },
});

const RightMenu = ({ handleHistory, history }) => {
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
    </>
  );
};

const AppointmentsCard = ({
  route,
  leadInUnqualified,
  unqualifiedDeal,
  overviewType,
  history,
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
  const { appointments } = objectMerge;
  if (appointments && appointments.length === 0) {
    return (
      <Collapsible
        count="0"
        width={308}
        wrapperClassName={css.appointmentContainer}
        rightClassName={css.headerRight}
        right={<RightMenu handleHistory={handleHistory} history={history} />}
        padded
        title={_l`Meetings`}
      >
        <div className={isFetching ? css.isFetching : ''}>
          {isFetching ? (
            <Loader active={isFetching}>Loading</Loader>
          ) : (
            <Message active info>
              {_l`No meetings`}
            </Message>
          )}
        </div>
      </Collapsible>
    );
  }

  return (
    <Collapsible
      wrapperClassName={css.appointmentContainer}
      rightClassName={css.headerRight}
      right={<RightMenu handleHistory={handleHistory} history={history} />}
      width={308}
      title={_l`Meetings`}
      count={appointments ? appointments.length : ''}
      open={true}
    >
      <div className={isFetching ? css.isFetching : ''}>
        {isFetching ? (
          <Loader active={isFetching}>Loading</Loader>
        ) : (
          <>
            <AppointmentItem orderBy={orderBy} setOrderBy={handleOrderBy} header />
            {(appointments ? appointments : []).map((appointment) => {
              return (
                <AppointmentItem
                  route={route}
                  overviewType={overviewType}
                  appointment={appointment}
                  key={appointment.uuid}
                />
              );
            })}
          </>
        )}
      </div>
    </Collapsible>
  );
};

const mapDispatchToProps = {
  requestFetchAppointments: UnqualifiedActions.requestFetchAppointments,
};

export default compose(
  connect((state, { unqualifiedDeal }) => {
    return {
      leadInUnqualified: state.entities.unqualifiedDeal[unqualifiedDeal.uuid],
      isFetching: state.overview.PIPELINE_LEADS ? state.overview.PIPELINE_LEADS.isFetching : false,

    };
  }, mapDispatchToProps),

  withState('history', 'setHistory', false),
  withState('orderBy', 'setOrderBy', 'dateAndTime'),
  //orderBy
  withGetData(({ requestFetchAppointments, unqualifiedDeal, history, orderBy }) => () => {
    requestFetchAppointments(unqualifiedDeal.uuid, history, orderBy);
  }),
  lifecycle({
    componentWillReceiveProps(nextProps) {
      const { requestFetchAppointments, history, unqualifiedDeal, orderBy } = this.props;
      if (
        unqualifiedDeal.uuid !== nextProps.unqualifiedDeal.uuid ||
        unqualifiedDeal.countOfActiveAppointment !== nextProps.unqualifiedDeal.countOfActiveAppointment ||
        unqualifiedDeal.numberOfNote !== nextProps.unqualifiedDeal.numberOfNote
      ) {
        requestFetchAppointments(nextProps.unqualifiedDeal.uuid, history, orderBy);
      }
    },
  }),
  withHandlers({
    handleOrderBy: ({ requestFetchAppointments, unqualifiedDeal, setOrderBy, history }) => (orderBy) => {
      setOrderBy(orderBy);
      requestFetchAppointments(unqualifiedDeal.uuid, history, orderBy);
    },
    handleHistory: ({ requestFetchAppointments, unqualifiedDeal, setHistory, orderBy }) => (history) => {
      setHistory(history);
      requestFetchAppointments(unqualifiedDeal.uuid, history, orderBy);
    },
  })
)(AppointmentsCard);
