// @flow
import * as React from 'react';
import { compose, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import { Menu, Icon } from 'semantic-ui-react';
import _l from 'lib/i18n';
import { CssNames, OverviewTypes } from 'Constants';
import MoreMenu from 'components/MoreMenu/MoreMenu';
import * as OverviewActions from '../../../components/Overview/overview.actions';
import { updateEdit, fetchLead, clearErrors } from 'components/Task/task.actions';
import editBtn from '../../../../public/Edit.svg';
import css from '../../Menu/TaskActionMenu.css';
import user from '../../../../public/user.svg';
import massmail from '../../../../public/massmail.png';
import * as AppointmentActions from '../../../components/Appointment/appointment.actions';

type PropsT = {
  editTask: () => void,
  assignTask: () => void,
  assignTaskToMe: () => void,
  deleteTask: () => void,
  assignTagToTask: () => void,
  addInvitees: () => void,
  className: tring,
};

addTranslations({
  'en-US': {
    Actions: 'Actions',
    Delegate: 'Delegate',
    Edit: 'Edit',
    Delete: 'Delete',
    Assign: 'Assign',
    'Assign to me': 'Assign to me',
  },
});

const AppointmentActionMenu = ({ editAppointment, deleteAppointment, className, appointment, addInvitees }: PropsT) => {
  let email = '';
  const { contactList } = appointment;
  if (contactList && contactList.length > 0) {
    email = contactList[0].email;
  }
  return (
    <MoreMenu className={className} color={CssNames.Task}>
      <Menu.Item
        icon
        onClick={() => {
          window.open('mailto:' + email + '?subject=' + appointment.title);
        }}
      >
        <div className={css.actionIcon}>
          {_l`Send email`}
          <img style={{ height: '10px' }} src={massmail} />
        </div>
      </Menu.Item>
      <Menu.Item icon onClick={addInvitees}>
        <div className={css.actionIcon}>
          {_l`Add invitee`}
          <img style={{ height: '13px', width: '20px' }} src={user} />
        </div>
      </Menu.Item>
      <Menu.Item icon onClick={editAppointment}>
        <div className={css.actionIcon}>
          {_l`Update`}
          <img style={{ height: '13px', width: '20px' }} src={editBtn} />
        </div>
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
  connect(null, {
    highlight: OverviewActions.highlight,
    updateEdit,
    fetchLead,
    clearErrors,
    editAppointment: AppointmentActions.editAppointment,
  }),
  withHandlers({
    editAppointment: ({ editAppointment, appointment, highlight, overviewType }) => () => {
      let overviewT = overviewType;
      switch (overviewType) {
        case OverviewTypes.Pipeline.Qualified:
        case OverviewTypes.Pipeline.Qualified_Task:
          overviewT = OverviewTypes.Pipeline.Qualified_Appointment;
          break;
        case OverviewTypes.Pipeline.Lead:
        case OverviewTypes.Pipeline.Lead_Task:
          overviewT = OverviewTypes.Pipeline.Lead_Appointment;
          break;
      }
      editAppointment(appointment.uuid);
      highlight(overviewT, appointment.uuid, 'edit');
    },

    addInvitees: ({ overviewType, highlight, appointment, editAppointment }) => () => {
      // console.log("addInvitees overviewType:", overviewType);
      let overviewT = overviewType;
      switch (overviewType) {
        case OverviewTypes.Pipeline.Qualified:
        case OverviewTypes.Pipeline.Qualified_Task:
          overviewT = OverviewTypes.Pipeline.Qualified_Appointment;
          break;
        case OverviewTypes.Pipeline.Lead:
        case OverviewTypes.Pipeline.Lead_Task:
          overviewT = OverviewTypes.Pipeline.Lead_Appointment;
          break;

      }

      editAppointment(appointment.uuid);
      highlight(overviewT, appointment.uuid, 'add_invitee_appointment');
    },
    deleteAppointment: ({ overviewType, highlight, appointment, editAppointment }) => () => {
      let overviewT = overviewType;
      switch (overviewType) {
        case OverviewTypes.Pipeline.Qualified:
        case OverviewTypes.Pipeline.Qualified_Task:
          overviewT = OverviewTypes.Pipeline.Qualified_Appointment;
          break;
        case OverviewTypes.Pipeline.Lead:
        case OverviewTypes.Pipeline.Lead_Task:
          overviewT = OverviewTypes.Pipeline.Lead_Appointment;
          break;

      }
      editAppointment(appointment.uuid);
      highlight(overviewT, appointment.uuid, 'delete');
    },
  })
)(AppointmentActionMenu);
