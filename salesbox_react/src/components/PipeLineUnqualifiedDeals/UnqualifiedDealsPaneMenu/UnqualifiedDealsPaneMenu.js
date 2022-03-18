//@flow
import * as React from 'react';
import { Menu, Icon, Label, Popup } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { compose, withHandlers } from 'recompose';
import { OverviewTypes, ObjectTypes } from 'Constants';
import * as OverviewActions from 'components/Overview/overview.actions';

// Panes
import UnqualifiedPane from 'components/Contact/UnqualifiedPane/UnqualifiedPane';
import QualifiedPane from 'components/Contact/QualifiedPane/QualifiedPane';
import OrdersPane from 'components/Contact/OrdersPane/OrdersPane';
import AppointmentsPane from 'components/Contact/AppointmentsPane/AppointmentsPane';
import PhotosPane from 'components/Contact/PhotosPane/PhotosPane';
import DocumentsPane from '../../../components/Common/DocumentsPane/DocumentsPane';
import NotesPane from '../NotesPane/NotesPane';
import QuickAddMenu from './QuickAddMenu';

// Cards
import TasksCard from '../Cards/TasksCard';
import ContactsCard from '../Cards/ColleaguesCard';
import AppointmentsCard from '../Cards/AppointmentCard';

import _l from 'lib/i18n';
import css from './UnqualifiedDealsPaneMenu.css';

//IMAGE
import appointmentAdd from '../../../../public/Appointments.svg';
import taskAdd from '../../../../public/Tasks.svg';
import NotesMenu from '../../../../public/Notes-Menu.svg';
import add from '../../../../public/Add.svg';

addTranslations({
  'en-US': {
    Unqualified: 'Unqualified',
    Qualified: 'Qualified',
    Orders: 'Orders',
    Contacts: 'Contacts',
    Reminders: 'Reminders',
    Photos: 'Photos',
    Documents: 'Documents',
    Notes: 'Notes',
    'Quick add': 'Quick add',
  },
});

type PropsType = {
  unqualifiedDeal: {},
  panelAction: string,
  chooseUnqualified: () => void,
  chooseQualified: () => void,
  chooseOrders: () => void,
  chooseAppointments: () => void,
  chooseTasks: () => void,
  chooseContacts: () => void,
  choosePhotos: () => void,
  chooseDocuments: () => void,
  chooseNotes: () => void,
};

const overviewType = OverviewTypes.Pipeline.Lead;

const panes = {
  unqualified: UnqualifiedPane,
  qualified: QualifiedPane,
  orders: OrdersPane,
  appointments: AppointmentsCard,
  contacts: ContactsCard,
  tasks: TasksCard,
  photos: PhotosPane,
  documents: DocumentsPane,
  notes: NotesPane,
};

const iconStyle = {
  height: 18,
  width: 18,
};

const menuStyle = {
  width: '25% !important',
};

const UnqualifiedPaneMenu = ({
  unqualifiedDeal,
  panelAction,
  chooseAppointments,
  chooseTasks,
  chooseNotes,
  route,
}: PropsType) => {
  const ActivePane = panes[panelAction] || null;
  return (
    <React.Fragment>
      <Menu fluid widths={4} size="mini" icon="labeled" borderless className={css.hasLabels}>
        <Menu.Item style={menuStyle} active={panelAction === 'appointments'} onClick={chooseAppointments}>
          {unqualifiedDeal.countOfActiveAppointment > 0 && (
            <Label size="mini" className={css.numberonPane}>
              {unqualifiedDeal.countOfActiveAppointment}
            </Label>
          )}

          <img style={iconStyle} src={appointmentAdd} />
          <span className={css.text}>{_l`Meetings`}</span>
        </Menu.Item>
        <Menu.Item style={menuStyle} active={panelAction === 'tasks'} onClick={chooseTasks}>
          {unqualifiedDeal.countOfActiveTask > 0 && (
            <Label size="mini" className={css.numberonPane}>
              {unqualifiedDeal.countOfActiveTask}
            </Label>
          )}

          <img style={iconStyle} src={taskAdd} />
          <span className={css.text}>{_l`Reminders`}</span>
        </Menu.Item>
        <Menu.Item style={menuStyle} active={panelAction === 'notes'} onClick={chooseNotes}>
          {unqualifiedDeal.numberOfNote > 0 && (
            <Label size="mini" className={css.numberonPane}>
              {unqualifiedDeal.numberOfNote}
            </Label>
          )}

          <img style={iconStyle} src={NotesMenu} />
          <span className={css.text}>{_l`Notes`}</span>
        </Menu.Item>
        {/* <Menu.Item style={menuStyle}>
                    <img style={iconStyle} src={add} />
                    <span className={css.text}>{_l`Quick add`}</span>
                </Menu.Item> */}
        <QuickAddMenu unqualifiedDeal={unqualifiedDeal} />
      </Menu>
      {ActivePane && (
        <ActivePane
          route={route}
          objectType={ObjectTypes.Lead}
          overviewType={OverviewTypes.Pipeline.Lead_Task}
          unqualifiedDeal={unqualifiedDeal}
        />
      )}
    </React.Fragment>
  );
};

const mapStateToProps = (state) => ({
  panelAction: state.overview[overviewType] && state.overview[overviewType].panelAction,
});

const mapDispatchToProps = {
  setPanelAction: OverviewActions.setPanelAction,
};

const makeHandler = (panel) => ({ setPanelAction }) => () => setPanelAction(overviewType, panel);

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withHandlers({
    chooseUnqualified: makeHandler('unqualified'),
    chooseQualified: makeHandler('qualified'),
    chooseOrders: makeHandler('orders'),
    chooseAppointments: makeHandler('appointments'),
    chooseTasks: makeHandler('tasks'),
    chooseContacts: makeHandler('contacts'),
    choosePhotos: makeHandler('photos'),
    chooseDocuments: makeHandler('documents'),
    chooseNotes: makeHandler('notes'),
  })
)(UnqualifiedPaneMenu);
