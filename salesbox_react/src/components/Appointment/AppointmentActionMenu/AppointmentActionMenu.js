/* eslint-disable react/prop-types */
// @flow
import * as React from 'react';
import { compose, withHandlers, defaultProps } from 'recompose';
import { connect } from 'react-redux';
import { Menu, Icon } from 'semantic-ui-react';
import { getUserProfile } from 'components/Profile/profile.selector';
import _l from 'lib/i18n';
import { CssNames, OverviewTypes } from 'Constants';
import MoreMenu from 'components/MoreMenu/MoreMenu';
import * as AppointmentActions from 'components/Appointment/appointment.actions';
import * as OverviewActions from 'components/Overview/overview.actions';
import css from '../../../essentials/Menu/TaskActionMenu.css';

import emailSend from '../../../../public/email_no_action.svg';
import taskAdd from '../../../../public/Tasks.svg';
type PropsT = {
  editAppointment: () => void,
  deleteAppointment: () => void,
  addInvitees: () => void,
};

addTranslations({
  'en-US': {
    Actions: 'Actions',
    'Add reminder': 'Add reminder',
    'Add to call list': 'Add to call list',
    'Ask for help': 'Ask for help',
    Delete: 'Delete',
    Deactivate: 'Deactivate',
    'Edit appointment': 'Edit appointment',
    'Send Email': 'Send Email',
    Edit: 'Edit',
  },
});

const AppointmentActionMenu = ({ appointment, editAppointment, deleteAppointment, className, addInvitees }: PropsT) => {
  let email = '';
  const { contactList } = appointment;
  if (contactList && contactList.length > 0) {
    email = contactList[0].email;
  }

  return (
    <MoreMenu className={className} color={CssNames.Contact}>
      <Menu.Item
        onClick={() => {
          window.open('mailto:' + email + '?subject=' + appointment.title);
        }}
        icon
      >
        <div className={css.actionIcon}>
          {_l`Send Email`}
          <img style={{ height: '13px', width: '20px' }} src={emailSend} />
        </div>
      </Menu.Item>
      <Menu.Item icon onClick={addInvitees}>
        <div className={css.actionIcon}>
          {_l`Add invitee`}
          <img style={{ height: '13px', width: '20px' }} src={taskAdd} />
        </div>
      </Menu.Item>
      <Menu.Item icon onClick={editAppointment}>
        <Icon name="pencil" />
        {_l`Update`}
      </Menu.Item>
      <Menu.Item icon onClick={deleteAppointment}>
        <div className={css.actionIcon}>
          {_l`Delete`}
          <Icon name="trash alternate outline" />
        </div>
      </Menu.Item>
    </MoreMenu>
  );
};

export default compose(
  defaultProps({
    overviewType: OverviewTypes.Activity.Appointment,
  }),
  connect(
    (state) => ({
      user: getUserProfile(state),
    }),
    {
      highlight: OverviewActions.highlight,
      editEntity: OverviewActions.editEntity,
      editAppointment: AppointmentActions.editAppointment,
    }
  ),
  withHandlers({
    editAppointment: ({ editAppointment, appointment, highlight }) => () => {
      editAppointment(appointment.uuid);
      highlight(OverviewTypes.Activity.Appointment, appointment.uuid, 'edit');
    },
    deleteAppointment: ({ overviewType, highlight, appointment }) => () => {
      highlight(overviewType, appointment.uuid, 'delete');
    },
    addInvitees: ({ overviewType, highlight, appointment, editAppointment }) => () => {

      let overviewT = overviewType;
      switch (overviewType) {
        case OverviewTypes.Pipeline.Qualified:
          overviewT = OverviewTypes.Pipeline.Qualified_Appointment;
          break;
      }

      editAppointment(appointment.uuid);
      highlight(overviewT, appointment.uuid, 'add_invitee_appointment');
    },
    sendEmail: ({ appointment }) => () => {},
  })
)(AppointmentActionMenu);
