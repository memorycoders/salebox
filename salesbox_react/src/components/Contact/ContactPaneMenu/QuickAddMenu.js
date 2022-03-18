// @flow
import * as React from 'react';
import { compose, withHandlers, withState } from 'recompose';
import { connect } from 'react-redux';
import _l from 'lib/i18n';
import { Menu, Popup } from 'semantic-ui-react';
import * as AppActions from 'components/App/app.actions';
import * as OverviewActions from 'components/Overview/overview.actions';
import { OverviewTypes } from 'Constants';
import { getAvatar } from 'components/Auth/auth.selector';
import { updateCreateEntity } from '../../Task/task.actions';
import add from '../../../../public/Add.svg';
import css from '../../CreateMenu/CreateMenu.css';
import taskAdd from '../../../../public/Tasks.svg';
import appointmentAdd from '../../../../public/Appointments.svg';
import NotesMenu from '../../../../public/Notes-Menu.svg';
import photoSvg from '../../../../public/Photos.svg';
import { fetchListByProspect } from '../../../components/OrderRow/order-row.actions';
import unqualifiedAdd from "../../../../public/Unqualified_deals.svg";
import qualifiedAdd from "../../../../public/Qualified_deals.svg";
import ColleaguesSVG from '../../../../public/Colleagues.svg';
import { updateCreateEntityUnqualified } from "../../PipeLineUnqualifiedDeals/unqualifiedDeal.actions";
import { updateCreateEntityQualified } from "../../PipeLineQualifiedDeals/qualifiedDeal.actions";
import { organisationItem } from "../../Organisation/organisation.actions";
import { contactItem, createEntity, createColleague } from '../../Contact/contact.actions';
import {getUser} from "../../Auth/auth.selector";
import orderAdd from "../../../../public/Orders.svg";
import documentAdd from "../../../../public/Documents.svg";
import { uploadFileToCloud } from '../../Common/common.actions';
import * as NotificationActions from 'components/Notification/notification.actions';

type PropsT = {
  open: boolean,
  onOpen: () => void,
  onClose: () => void,
  addTask: () => void,
};

addTranslations({
  'en-US': {
    'Add reminder': 'Add reminder',
    'Add note': 'Add note',
    'Update products': 'Update products',
    'Add Photo': 'Add Photo',
    'Quick add': 'Quick add',
    'Add product': 'Add product',
    'Add order': 'Add order',
    'Add document': 'Add document',

  },
});

const popupStyle = {
  padding: 0,
};

const menuStyle = {
  width: '25% !important',
};

const iconStyle = {
  height: 18,
  width: 18,
};

const QuickAddMenu = ({ open, onOpen, onClose, addTask, addNote,
  openAddUnqualifiedDealsModal,
  openAddQualifiedDealsModal, addPhoto, addContact,  addAppointment, addOrder,
  handleUpload
}: PropsT) => {
  const profileMenuItem = (
    <Menu.Item style={menuStyle}>
      <img style={iconStyle} src={add} />
      <span style={{ marginTop: 10 }}>{_l`Quick add`}</span>
    </Menu.Item>
  );
  return (
    <Popup
      hoverable
      trigger={profileMenuItem}
      onOpen={onOpen}
      onClose={onClose}
      onClick={onClose}
      open={open}
      flowing
      position="bottom right"
      style={popupStyle}
      keepInViewPort
      hideOnScroll
      on="click"
    >
      <input hidden id="file-upload" name="file-upload" type="file" />
      <Menu vertical color="teal">
        <Menu.Item onClick={addNote}>
          <div className={css.actionIcon}>
            {_l`Add note`}
            <img style={{ height: '13px', width: '20px' }} src={NotesMenu} />
          </div>
        </Menu.Item>
        <Menu.Item onClick={addTask}>
          <div className={css.actionIcon}>
            {_l`Add reminder`}
            <img style={{ height: '13px', width: '20px' }} src={taskAdd} />
          </div>
        </Menu.Item>
        <Menu.Item onClick={addAppointment}>
          <div className={css.actionIcon}>
            {_l`Add meeting`}
            <img style={{ height: '13px', width: '20px' }} src={appointmentAdd} />
          </div>
        </Menu.Item>
        <Menu.Item icon onClick={openAddUnqualifiedDealsModal}>
          <div className={css.actionIcon}>
            {_l`Add prospect`}
            <img style={{ height: '15px', width: '20px' }} src={unqualifiedAdd} />
          </div>
        </Menu.Item>
        <Menu.Item icon onClick={openAddQualifiedDealsModal}>
          <div className={css.actionIcon}>
            {_l`Add deal`}
            <img style={{ height: '15px', width: '20px' }} src={qualifiedAdd} />
          </div>
        </Menu.Item>
        <Menu.Item icon onClick={addOrder}>
          <div className={css.actionIcon}>
            {_l`Add order`}
            <img style={{ height: '15px', width: '20px' }} src={orderAdd} />
          </div>
        </Menu.Item>

        {/*<Menu.Item onClick={updateProducts}>
          <div className={css.actionIcon}>
            {_l`Add product`}
            <img style={{ height: '13px', width: '20px' }} src={piplineSvg} />
          </div>
        </Menu.Item>
        <Menu.Item onClick={updateProducts}>
          <div className={css.actionIcon}>
            {_l`Update products`}
            <img style={{ height: '13px', width: '20px' }} src={piplineSvg} />
          </div>
        </Menu.Item>*/}
        <Menu.Item onClick={addContact}>
          <div className={css.actionIcon}>
            {_l`Add colleague`}
            <img style={{ height: '13px', width: '20px' }} src={ColleaguesSVG} />
          </div>
        </Menu.Item>

        <Menu.Item onClick={addPhoto}>
          <div className={css.actionIcon}>
            {_l`Add Photo`}
            <img style={{ height: '11px', width: '20px' }} src={photoSvg} />
          </div>
        </Menu.Item>
        <Menu.Item onClick={handleUpload}>
          <div className={css.actionIcon}>
            {_l`Add document`}
            <img style={{ height: '11px', width: '20px' }} src={documentAdd} />
          </div>
        </Menu.Item>

      </Menu>
    </Popup>
  );
};

export default compose(
  connect(
    (state) => ({
      activeTab: state.ui.app.roleTab,
      avatar: getAvatar(state),
      userAccount: getUser(state),
      connectedStorage: state.common.connectedStorage
    }),
    {
      setActiveTab: AppActions.setRoleTab,
      setActionForHighlight: OverviewActions.setActionForHighlight,
      updateCreateEntity,
      highlight: OverviewActions.highlight,
      fetchListByProspect,
      updateCreateEntityUnqualified: updateCreateEntityUnqualified,
      updateCreateEntityQualified: updateCreateEntityQualified,
      organisationItem,
      contactItem,
      createEntity,
      createColleague,
      createEntityOverview: OverviewActions.createEntity,
      uploadFileToCloud: uploadFileToCloud,
      putError: NotificationActions.error,
    }
  ),
  withState('open', 'setOpen', false),
  withHandlers({
    onOpen: ({ setOpen }) => () => {
      setOpen(true);
    },
    onClose: ({ setOpen }) => () => {
      setOpen(false);
    },
    addTask: ({ overviewType, setActionForHighlight, contact, updateCreateEntity,contactItem, organisationItem }) => () => {
      contactItem([contact]);
      organisationItem({ uuid: contact.organisationId, name: contact.organisationName });
      // let overviewT = overviewType == OverviewTypes.Pipeline.Order || qualifiedDeal.won != null ? OverviewTypes.Pipeline.Order_Task : OverviewTypes.Pipeline.Qualified_Task;
      let overviewT = OverviewTypes.Contact_Task;
      updateCreateEntity({organisationId: contact.organisationId, contactDTO: contact, organisation: contact.organisation}, overviewT);
      setActionForHighlight(overviewT, 'create');
    },
    addPhoto: ({ highlight, contact }) => () => {
      highlight(OverviewTypes.Contact_Photo, null, 'add_photo')
    },
    addNote: ({ highlight, contact }) => () => {
      if(contact.uuid)
      highlight(OverviewTypes.Contact_Note, contact.uuid, 'add_note');
    },
    updateProducts: ({ highlight, qualifiedDeal, fetchListByProspect, overviewType }) => () => {
      fetchListByProspect(qualifiedDeal.uuid);
      if (qualifiedDeal.won !== null) {
        highlight(OverviewTypes.Pipeline.Order, qualifiedDeal.uuid, 'editProducts');

      } else {
        highlight(OverviewTypes.Pipeline.Qualified, qualifiedDeal.uuid, 'editProducts');

      }
    },
    openAddUnqualifiedDealsModal: ({ overviewType, highlight, updateCreateEntityUnqualified, contact, organisationItem, contactItem }) => () => {
      // if(overviewType == OverviewTypes.Account_Unqualified_Multi){
      contactItem([contact]);
      organisationItem({uuid:contact.organisationId, name: contact.organisationName});
      let overviewT = OverviewTypes.Account_Unqualified;
      switch (overviewType) {
        case OverviewTypes.Contact:
          overviewT = OverviewTypes.Contact_Quick_Unqualified;
          break;
        default:
          break;
      }
      updateCreateEntityUnqualified({organisationId: contact.organisationId, contactId: contact.uuid}, overviewT);
      highlight(overviewT, null, 'create');
    },
    openAddQualifiedDealsModal: ({ overviewType, highlight, updateCreateEntityQualified, contact, organisationItem, contactItem }) => () => {
      contactItem([contact]);
      organisationItem({uuid:contact.organisationId, name: contact.organisationName});
      let overviewT = OverviewTypes.Account_Qualified;
      switch (overviewType) {
        case OverviewTypes.Contact:
          overviewT = OverviewTypes.Contact_Quick_Qualified;
          break;
        default:
          break;
      }
      updateCreateEntityQualified({organisation:{ uuid: contact.organisationId}, contacts: [{uuid: contact.uuid}]}, overviewT);
      highlight(overviewT, null, 'create');
    },
    addOrder: ({ overviewType, highlight, updateCreateEntityQualified, contact, organisationItem, contactItem }) => () => {
      contactItem([contact]);
      organisationItem({uuid:contact.organisationId, name: contact.organisationName});
      let overviewT = OverviewTypes.Contact_Order;
      switch (overviewType) {
        case OverviewTypes.Contact:
          overviewT = OverviewTypes.Contact_Order;
          break;
        default:
          break;
      }
      updateCreateEntityQualified({organisation:{ uuid: contact.organisationId}, contacts: [{uuid: contact.uuid}]}, overviewT);
      highlight(overviewT, null, 'create');
    },
    addContact: ({ overviewType, contact, organisationItem, contactItem, highlight, createColleague}) => () => {
      createColleague(contact.organisationId);
      organisationItem({ uuid: contact.organisationId, name: contact.organisationName});
      highlight(OverviewTypes.Contact_Add_Colleague, contact.uuid, 'create');
    },
    addAppointment: ({ createEntityOverview, contact, userAccount,organisationItem, contactItem, highlight }) => () => {
      contactItem([contact]);
      organisationItem({ uuid: contact.organisationId, name: contact.organisationName} );
      createEntityOverview(OverviewTypes.Contact_Appointment, {
        contacts: [contact.uuid],
        responsible: userAccount.uuid,
        organisation: contact.organisation != null ? contact.organisation.uuid : contact.organisationId,
        // contactList: [contact.uuid],
        // responsible: user.uuid,
      });
      highlight(OverviewTypes.Contact_Appointment, null, 'create');
    },
    handleUpload: ({uploadFileToCloud, connectedStorage, putError}) => () => {
      if(!connectedStorage) {
        putError('Please setup your company storage account first!')
        return;
      }
      document.getElementById("file-upload").click();
      document.getElementById('file-upload').onchange = function() {
       if (this.files && this.files.length) {
        uploadFileToCloud(this.files[0])
        }
      }
    }
  })
)(QuickAddMenu);
