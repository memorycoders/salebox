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

import * as OriganisationActions from '../organisation.actions';
import historyIcon from '../../../../public/History.svg';
import FilterActionMenu from '../../../essentials/Menu/FilterActionMenu';
import _l from 'lib/i18n';
import { ObjectTypes, OverviewTypes } from '../../../Constants';
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
  accountInList,
  account,
  history,
  handleHistory,
  handleOrderBy,
  orderBy,
  isFetching,
}) => {
  let objectMerge = account;
  if (accountInList) {
    objectMerge = {
      ...accountInList,
      ...account,
    };
  }
  const { appointments } = objectMerge;

  let overviewType = OverviewTypes.Account_Appointment;
  if (appointments && appointments.length === 0) {
    return (
      <Collapsible
        width={308}
        count="0"
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
            <AppointmentItem orderBy={orderBy} setOrderBy={handleOrderBy} header overviewType={overviewType} />
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
  requestFetchAppointments: OriganisationActions.requestFetchAppointments,
};

export default compose(
  connect((state, { account }) => {
    return {
      accountInList: state.entities.organisation[account.uuid],
      // isFetching: state.overview.ACCOUNTS.isFetching,
    };
  }, mapDispatchToProps),

  withState('history', 'setHistory', false),
  withState('orderBy', 'setOrderBy', 'dateAndTime'),
  //orderBy
  withGetData(({ requestFetchAppointments, account, history, orderBy }) => () => {
    requestFetchAppointments(account.uuid, history, orderBy);
  }),
  lifecycle({
    componentWillReceiveProps(nextProps) {
      const { requestFetchAppointments, history, account, orderBy } = this.props;
      if (
        account.uuid !== nextProps.account.uuid ||
        account.countOfActiveAppointment !== nextProps.account.countOfActiveAppointment
      ) {
        requestFetchAppointments(nextProps.account.uuid, history, orderBy);
      }
    },
  }),
  withHandlers({
    handleOrderBy: ({ requestFetchAppointments, account, setOrderBy, history }) => (orderBy) => {
      setOrderBy(orderBy);
      requestFetchAppointments(account.uuid, history, orderBy);
    },
    handleHistory: ({ requestFetchAppointments, account, setHistory, orderBy }) => (history) => {
      setHistory(history);
      requestFetchAppointments(account.uuid, history, orderBy);
    },
  })
)(AppointmentsCard);
