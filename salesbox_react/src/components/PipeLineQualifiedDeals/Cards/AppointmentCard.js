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

import * as QualifiedActions from '../qualifiedDeal.actions';
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
  qualifiedInList,
  qualifiedDeal,
  overviewType,
  history,
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
  requestFetchAppointments: QualifiedActions.requestFetchAppointments,
};

export default compose(
  connect((state, { qualifiedDeal }) => {
    return {
      qualifiedInList: state.entities.qualifiedDeal[qualifiedDeal.uuid],
      // isFetching: state.overview.PIPELINE_QUALIFIED ? state.overview.PIPELINE_QUALIFIED.isFetching : false,
    };
  }, mapDispatchToProps),

  withState('history', 'setHistory', false),
  withState('orderBy', 'setOrderBy', 'dateAndTime'),
  //orderBy
  withGetData(({ requestFetchAppointments, qualifiedDeal, history, orderBy }) => () => {
    requestFetchAppointments(qualifiedDeal.uuid, history, orderBy);
  }),
  lifecycle({
    componentWillReceiveProps(nextProps) {
      const { requestFetchAppointments, history, qualifiedDeal, orderBy } = this.props;

      if (
        qualifiedDeal.uuid !== nextProps.qualifiedDeal.uuid ||
        qualifiedDeal.countOfActiveAppointment !== nextProps.qualifiedDeal.countOfActiveAppointment ||
        qualifiedDeal.numberOfNote !== nextProps.qualifiedDeal.numberOfNote
      ) {
        requestFetchAppointments(nextProps.qualifiedDeal.uuid, history, orderBy);
      }
    },
  }),
  withHandlers({
    handleOrderBy: ({ requestFetchAppointments, qualifiedDeal, setOrderBy, history }) => (orderBy) => {
      setOrderBy(orderBy);
      requestFetchAppointments(qualifiedDeal.uuid, history, orderBy);
    },
    handleHistory: ({ requestFetchAppointments, qualifiedDeal, setHistory, orderBy }) => (history) => {
      setHistory(history);
      requestFetchAppointments(qualifiedDeal.uuid, history, orderBy);
    },
  })
)(AppointmentsCard);
