//@flow
import * as React from 'react';
import { Menu, Icon, Label, Popup } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { compose, withHandlers } from 'recompose';
import { OverviewTypes, ObjectTypes } from '../../../Constants';
import * as OverviewActions from 'components/Overview/overview.actions';

// Panes
import UnqualifiedPane from 'components/Contact/UnqualifiedPane/UnqualifiedPane';
import QualifiedPane from 'components/Contact/QualifiedPane/QualifiedPane';
import OrdersPane from '../../Contact/OrdersPane/OrdersPane';
import PhotosPane from '../../Common/PhotosPane/PhotosPane';
import DocumentsPane from '../../Common/DocumentsPane/DocumentsPane';
import NotesPane from '../NotesPane/NotesPane';
import * as NotificationActions from 'components/Notification/notification.actions';
// Cards
import TasksCard from '../Cards/TasksCard';
import ContactsCard from '../Cards/ColleaguesCard';
import AppointmentsCard from '../Cards/AppointmentCard';

import _l from 'lib/i18n';
import css from './ContactPaneMenu.css';

//IMAGE
import unqualifiedAdd from '../../../../public/Unqualified_deals.svg';
import qualifiedSvg from '../../../../public/Qualified_deals.svg';
import orderAdd from '../../../../public/Notes.svg';
import appointmentAdd from '../../../../public/Appointments.svg';
import taskAdd from '../../../../public/Tasks.svg';
import NotesMenu from '../../../../public/Notes-Menu.svg';
import add from '../../../../public/Add.svg';
import documentSvg from '../../../../public/Documents.svg';
import photoSvg from '../../../../public/Photos.svg';
import piplineSvg from '../../../../public/Pipeline.svg';
import ColleaguesSVG from '../../../../public/Colleagues.svg';

//quick add
import QuickAddMenu from './QuickAddMenu';

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
    'Products': 'Products',
    'Action Plan': 'Action Plan',
    Colleague: 'Colleague'
  },
});

type PropsType = {
  contact: {},
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

const overviewType = OverviewTypes.Contact;

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
  width: 18
}

const menuStyle = {
  width: '25% !important'
}

const AccountPaneMenu = ({
  contact,
  panelAction,
  chooseAppointments,
  chooseTasks,
  chooseNotes,
  chooseUnqualified,
  chooseDocuments,
  chooseContacts,
  choosePhotos,
  chooseActionPlan,
  chooseQualified,
  chooseProducts,
  chooseOrders,
  route
}: PropsType) => {
  const ActivePane = panes[panelAction] || null;

  return (
    <React.Fragment>
      <Menu fluid widths={5} size="mini" icon="labeled" borderless className={`${css.hasLabels} ${css.firstPane}`}>
        <Menu.Item style={menuStyle} active={panelAction === 'unqualified'} onClick={chooseUnqualified}>
          {contact.numberActiveLead > 0 && (
            <Label size="mini" className={css.numberonPane}>
              {contact.numberActiveLead}
            </Label>
          )}

          <img style={iconStyle} src={unqualifiedAdd} />
          <span className={css.text}>{_l`Prospects`}</span>
        </Menu.Item>
        <Menu.Item style={menuStyle} active={panelAction === 'qualified'} onClick={chooseQualified}>
          {contact.numberActiveProspect > 0 && (
            <Label size="mini" className={css.numberonPane}>
              {contact.numberActiveProspect}
            </Label>
          )}

          <img style={iconStyle} src={qualifiedSvg} />
          <span className={css.text}>{_l`Deals`}</span>
        </Menu.Item>
        <Menu.Item active={panelAction === 'orders'} onClick={chooseOrders}>
          {contact.numberClosedProspect > 0 && (
            <Label size="mini" className={css.numberonPane}>
              {contact.numberClosedProspect}
            </Label>
          )}

          <img style={iconStyle} src={orderAdd} />
          <span className={css.text}>{_l`Orders`}</span>
        </Menu.Item>

        <Menu.Item style={menuStyle} active={panelAction === 'appointments'} onClick={chooseAppointments}>
          {contact.numberActiveMeeting > 0 && (
            <Label size="mini" className={css.numberonPane}>
              {contact.numberActiveMeeting}
            </Label>
          )}

          <img style={iconStyle} src={appointmentAdd} />
          <span className={css.text}>{_l`Meetings`}</span>
        </Menu.Item>
        <Menu.Item style={menuStyle} active={panelAction === 'tasks'} onClick={chooseTasks}>
          {contact.numberActiveTask > 0 && (
            <Label size="mini" className={css.numberonPane}>
              {contact.numberActiveTask}
            </Label>
          )}

          <img style={iconStyle} src={taskAdd} />
          <span className={css.text}>{_l`Reminders`}</span>
        </Menu.Item>
      </Menu>
      <Menu fluid widths={5} size="mini" icon="labeled" borderless className={`${css.hasLabels}`}>


        <Menu.Item style={menuStyle} active={panelAction === 'contacts'} onClick={chooseContacts}>
          {contact.numberColleague > 0 && (
            <Label size="mini" className={css.numberonPane}>
              {contact.numberColleague}
            </Label>
          )}

          <img style={iconStyle} src={ColleaguesSVG} />
          <span className={css.text}>{_l`Colleague`}</span>
        </Menu.Item>
        <Menu.Item style={menuStyle} active={panelAction === 'photos'} onClick={choosePhotos}>
          {contact.numberPhoto > 0 && (
            <Label size="mini" className={css.numberonPane}>
              {contact.numberPhoto}
            </Label>
          )}

          <img style={iconStyle} src={photoSvg} />
          <span className={css.text}>{_l`Photos`}</span>
        </Menu.Item>
        <Menu.Item style={menuStyle} active={panelAction === 'documents'} onClick={chooseDocuments}>
          {contact.numberDocument > 0 && (
            <Label size="mini" className={css.numberonPane}>
              {contact.numberDocument}
            </Label>
          )}

          <img style={iconStyle} src={documentSvg} />
          <span className={css.text}>{_l`Documents`}</span>
        </Menu.Item>
        <Menu.Item style={menuStyle} active={panelAction === 'notes'} onClick={chooseNotes}>
          {contact.numberNote > 0 && (
            <Label size="mini" className={css.numberonPane}>
              {contact.numberNote}
            </Label>
          )}

          <img style={iconStyle} src={NotesMenu} />
          <span className={css.text}>{_l`Notes`}</span>
        </Menu.Item>
        <Menu.Item style={menuStyle}>
          <QuickAddMenu contact={contact} overviewType={overviewType} />
        </Menu.Item>

      </Menu>
      {ActivePane && <ActivePane
        route={route}
        objectType={ObjectTypes.Contact}
        overviewType={OverviewTypes.Contact_Task}
        overviewTypePhoto={OverviewTypes.Contact_Photo}
        contact={contact}
        data={contact}
      />}
    </React.Fragment>
  );
};

const mapStateToProps = (state) => ({
  panelAction: state.overview[overviewType] && state.overview[overviewType].panelAction,
  connectedStorage: state.common.connectedStorage
});

const mapDispatchToProps = {
  setPanelAction: OverviewActions.setPanelAction,
  putError: NotificationActions.error,
};

const makeHandler = (panel) => ({ setPanelAction , connectedStorage, putError}) => () => {
  if(panel === 'documents' && !connectedStorage) {
    putError('Please setup your company storage account first!')
    return;
  }
  setPanelAction(overviewType, panel);
}

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
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
    chooseActionPlan: makeHandler('action_plan'),
    chooseProducts: makeHandler('products'),
  })
)(AccountPaneMenu);
