//@flow
import * as React from 'react';

import { compose, pure, branch, renderNothing, lifecycle, withHandlers, withState } from 'recompose';
import { Menu, Image, Popup } from 'semantic-ui-react';
import AppointmentItem from '../../../essentials/List/Appointment/AppointmentItem';
import Collapsible from '../../Collapsible/Collapsible';
import { connect } from 'react-redux';
import { Message, Loader } from 'semantic-ui-react';
import cx from 'classnames';
import { withGetData } from 'lib/hocHelpers';

import * as ContactActions from '../contact.actions';
import historyIcon from '../../../../public/History.svg';
import FilterActionMenu from '../../../essentials/Menu/FilterActionMenu';
import _l from 'lib/i18n';
import { ObjectTypes, OverviewTypes } from '../../../Constants';
import css from './TasksCard.css';
import { isSignedIn } from '../../Auth/auth.selector';

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
  contactInList,
  contact,
  objectType,
  history,
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
  let overviewType = OverviewTypes.Account_Appointment;
  switch (objectType) {
    case ObjectTypes.Account:
      overviewType = OverviewTypes.Account_Appointment;
      break;
    case ObjectTypes.Contact:
      overviewType = OverviewTypes.Contact_Appointment;
      break;
    default:
      break;
  }
  const { appointments } = objectMerge;

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
        {isFetching ? (
          <div className={isFetching && css.isFetching}>
            <Loader active={isFetching}>Loading</Loader>
          </div>
        ) : (
          <Message active info>
            {_l`No meetings`}
          </Message>
        )}
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
      {isFetching ? (
        <div className={isFetching && css.isFetching}>
          <Loader active={isFetching}>Loading</Loader>
        </div>
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
    </Collapsible>
  );
};

const mapDispatchToProps = {
  requestFetchAppointments: ContactActions.requestFetchAppointments,
};

export default compose(
  connect((state, { contact }) => {
    return {
      contactInList: state.entities.contact[contact.uuid],
      // isFetching: state.overview.CONTACTS.isFetching,
      isSignedIn: isSignedIn(state),
    };
  }, mapDispatchToProps),

  withState('history', 'setHistory', false),
  withState('orderBy', 'setOrderBy', 'dateAndTime'),
  //orderBy
  withGetData(({ requestFetchAppointments, contact, history, orderBy }) => () => {
    requestFetchAppointments(contact.uuid, history, orderBy);
  }),
  lifecycle({
    componentWillReceiveProps(nextProps) {
      if(nextProps.isSignedIn) {
        const { requestFetchAppointments, history, contact, orderBy } = this.props;
        if (
          contact.uuid !== nextProps.contact.uuid ||
          contact.countOfActiveAppointment !== nextProps.contact.countOfActiveAppointment
        ) {
          requestFetchAppointments(nextProps.contact.uuid, history, orderBy);
        }
      }
    },
  }),
  withHandlers({
    handleOrderBy: ({ requestFetchAppointments, contact, setOrderBy, history }) => (orderBy) => {
      setOrderBy(orderBy);
      requestFetchAppointments(contact.uuid, history, orderBy);
    },
    handleHistory: ({ requestFetchAppointments, contact, setHistory, orderBy }) => (history) => {
      setHistory(history);
      requestFetchAppointments(contact.uuid, history, orderBy);
    },
  })
)(AppointmentsCard);
