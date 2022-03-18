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
import PhotosPane from '../../Common/PhotosPane/PhotosPane';
import DocumentsPane from '../../Common/DocumentsPane/DocumentsPane';
import NotesPane from '../NotesPane/NotesPane';

// Cards
import TasksCard from '../Cards/TasksCard';
import ContactsCard from '../Cards/ColleaguesCard';
import AppointmentsCard from '../Cards/AppointmentCard';
import ActionPlan from '../ActionPlan/ActionPan';
import ProductsCard from '../Products/Products';

import _l from 'lib/i18n';
import css from './UnqualifiedDealsPaneMenu.css';

//IMAGE
import unqualifiedAdd from '../../../../public/Unqualified_deals.svg';
import orderAdd from '../../../../public/Notes.svg';
import appointmentAdd from '../../../../public/Appointments.svg';
import taskAdd from '../../../../public/Tasks.svg';
import NotesMenu from '../../../../public/Notes-Menu.svg';
import add from '../../../../public/Add.svg';
import documentSvg from '../../../../public/Documents.svg';
import photoSvg from '../../../../public/Photos.svg';
import piplineSvg from '../../../../public/Pipeline.svg';
import actionPlanSvg from '../../../../public/action_plan.svg';

//quick add
import QuickAddMenu from './QuickAddMenu';

//action
import api from 'lib/apiClient';
import * as NotificationActions from 'components/Notification/notification.actions';
addTranslations({
  'en-US': {
    Unqualified: 'Unqualified',
    Qualified: 'Qualified',
    Orders: 'Orders',
    Appointments: 'Appointments',
    Contacts: 'Contacts',
    Reminders: 'Reminders',
    Photos: 'Photos',
    Documents: 'Documents',
    Notes: 'Notes',
    'Quick add': 'Quick add',
    Products: 'Products',
    'Action Plan': 'Action Plan',

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

const overviewType = OverviewTypes.Pipeline.Qualified;

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
  action_plan: ActionPlan,
  products: ProductsCard,
};

const iconStyle = {
  height: 18,
  width: 18,
};

const menuStyle = {
  width: '25% !important',
};

const QualifiedPaneMenu = ({
  qualifiedDeal,
  panelAction,
  chooseAppointments,
  chooseTasks,
  chooseNotes,
  chooseUnqualified,
  chooseDocuments,
  chooseColleagues,
  choosePhotos,
  chooseActionPlan,
  chooseProducts,
  route,
}: PropsType) => {
  const ActivePane = panes[panelAction] || null;
  return (
    <React.Fragment>
      <Menu fluid widths={4} size="mini" icon="labeled" borderless className={`${css.hasLabels} ${css.firstPane}`}>
        {/* <Menu.Item style={menuStyle} active={panelAction === 'unqualified'} onClick={chooseUnqualified}>
                    {qualifiedDeal.numberActiveLead > 0 && (
                        <Label color="red" size="mini">
                            {qualifiedDeal.numberActiveLead}
                        </Label>
                    )}
                    <img style={iconStyle} src={unqualifiedAdd} />
                    <span className={css.text}>{_l`Prospect`}</span>
                </Menu.Item> */}
        <Menu.Item active={panelAction === 'products'} onClick={chooseProducts}>
          {qualifiedDeal.numberOrderRow > 0 && (
            <Label size="mini" className={css.numberonPane}>
              {qualifiedDeal.numberOrderRow}
            </Label>
          )}

          <img style={iconStyle} src={piplineSvg} />
          <span className={css.text}>{_l`Products`}</span>
        </Menu.Item>

        <Menu.Item style={menuStyle} active={panelAction === 'appointments'} onClick={chooseAppointments}>
          {qualifiedDeal.numberActiveMeeting > 0 && (
            <Label size="mini" className={css.numberonPane}>
              {qualifiedDeal.numberActiveMeeting}
            </Label>
          )}

          <img style={iconStyle} src={appointmentAdd} />
          <span className={css.text}>{_l`Meetings`}</span>
        </Menu.Item>
        <Menu.Item style={menuStyle} active={panelAction === 'tasks'} onClick={chooseTasks}>
          {qualifiedDeal.numberActiveTask > 0 && (
            <Label size="mini" className={css.numberonPane}>
              {qualifiedDeal.numberActiveTask}
            </Label>
          )}

          <img style={iconStyle} src={taskAdd} />
          <span className={css.text}>{_l`Reminders`}</span>
        </Menu.Item>
        <Menu.Item style={menuStyle} active={panelAction === 'action_plan'} onClick={chooseActionPlan}>
          <img style={iconStyle} src={actionPlanSvg} />
          <span className={css.text}>{_l`Action Plan`}</span>
        </Menu.Item>
      </Menu>
      <Menu fluid widths={4} size="mini" icon="labeled" borderless className={`${css.hasLabels}`}>
        <Menu.Item style={menuStyle} active={panelAction === 'photos'} onClick={choosePhotos}>
          {qualifiedDeal.numberPhoto > 0 && (
            <Label size="mini" className={css.numberonPane}>
              {qualifiedDeal.numberPhoto}
            </Label>
          )}

          <img style={iconStyle} src={photoSvg} />
          <span className={css.text}>{_l`Photos`}</span>
        </Menu.Item>
        <Menu.Item
          style={menuStyle}
          active={panelAction === 'documents'}
          onClick={() => chooseDocuments(qualifiedDeal)}
        >
          {qualifiedDeal.numberDocument > 0 && (
            <Label size="mini" className={css.numberonPane}>
              {qualifiedDeal.numberDocument}
            </Label>
          )}

          <img style={iconStyle} src={documentSvg} />
          <span className={css.text}>{_l`Documents`}</span>
        </Menu.Item>
        <Menu.Item style={menuStyle} active={panelAction === 'notes'} onClick={chooseNotes}>
          {qualifiedDeal.numberNote > 0 && (
            <Label size="mini" className={css.numberonPane}>
              {qualifiedDeal.numberNote}
            </Label>
          )}

          <img style={iconStyle} src={NotesMenu} />
          <span className={css.text}>{_l`Notes`}</span>
        </Menu.Item>
        <Menu.Item style={menuStyle}>
          <QuickAddMenu qualifiedDeal={qualifiedDeal} overviewType={overviewType} />
        </Menu.Item>
      </Menu>
      {ActivePane && (
        <ActivePane
          route={route}
          objectType={ObjectTypes.PipelineQualified}
          overviewType={OverviewTypes.Pipeline.Qualified_Task}
          overviewTypePhoto={OverviewTypes.Pipeline.Qualified_Photo}
          overviewTypeDocument={OverviewTypes.Pipeline.Qualified_Document}
          qualifiedDeal={qualifiedDeal}
          data={qualifiedDeal}
        />
      )}
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
    chooseDocuments: ({ setPanelAction, putError, connectedStorage }) => async (qualifiedDeal) => {
      if(!connectedStorage) {
        putError('Please setup your company storage account first!')
        return;
      }
      setPanelAction(overviewType, 'documents');
      // const data = await api.get({
      //   resource: `prospect-v3.0/getRootFolder/${qualifiedDeal.uuid}`,
      // });
      // if (data) {
      //   // setPanelAction(overviewType, 'documents');
      // } else {
      //   putError(
      //     _l`Please ask your Salesbox admin to connect OneDrive, GoogleDrive or Dropbox in company settings first!`
      //   );
      // }
    },
    chooseNotes: makeHandler('notes'),
    chooseActionPlan: makeHandler('action_plan'),
    chooseProducts: makeHandler('products'),
  })
)(QualifiedPaneMenu);
