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
import cssDeals from './UnqualifiedDealsPaneMenu.css';
import appointmentAdd from '../../../../public/Appointments.svg';
import NotesMenu from '../../../../public/Notes-Menu.svg';
import photoSvg from '../../../../public/Photos.svg';
import piplineSvg from '../../../../public/Pipeline.svg';
import { fetchListByProspect } from '../../../components/OrderRow/order-row.actions';
import { contactItem } from '../../Contact/contact.actions';
import { organisationItem } from '../../Organisation/organisation.actions';
import { prospectConcatItem } from '../../Prospect/prospect.action';
import { getUser } from '../../Auth/auth.selector';
import documentAdd from '../../../../public/Documents.svg';
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

const QuickAddMenu = ({
  open,
  onOpen,
  onClose,
  addTask,
  addNote,
  updateProducts,
  addphoto,
  addAppointment,
  addDocument,
}: PropsT) => {
  const profileMenuItem = (
    <Menu.Item style={menuStyle}>
      <img style={iconStyle} src={add} />
      <span className={cssDeals.text}>{_l`Quick add`}</span>
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
      <input hidden id="file-upload-deals" name="file-upload-deals" type="file" />
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
        <Menu.Item onClick={updateProducts}>
          <div className={css.actionIcon}>
            {_l`Update products`}
            <img style={{ height: '13px', width: '20px' }} src={piplineSvg} />
          </div>
        </Menu.Item>
        {/* <Menu.Item onClick={updateProducts}>
          <div className={css.actionIcon}>
            {_l`Update products`}
            <img style={{ height: '13px', width: '20px' }} src={piplineSvg} />
          </div>
        </Menu.Item> */}
        <Menu.Item onClick={addphoto}>
          <div className={css.actionIcon}>
            {_l`Add Photo`}
            <img style={{ height: '13px', width: '20px' }} src={photoSvg} />
          </div>
        </Menu.Item>
        <Menu.Item onClick={addDocument}>
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
      contactItem,
      organisationItem,
      prospectConcatItem,
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
    addTask: ({ overviewType, setActionForHighlight, qualifiedDeal, updateCreateEntity }) => () => {
      // let overviewT = overviewType == OverviewTypes.Pipeline.Order || qualifiedDeal.won != null ? OverviewTypes.Pipeline.Order_Task : OverviewTypes.Pipeline.Qualified_Task;
      let overviewT = OverviewTypes.Pipeline.Qualified_Task;
      updateCreateEntity(qualifiedDeal, overviewT);
      setActionForHighlight(overviewT, 'create');
    },

    addphoto: ({ highlight }) => () => {
      highlight(OverviewTypes.Pipeline.Qualified_Photo, null, 'add_photo');
    },

    addNote: ({ highlight, qualifiedDeal }) => () => {
      if (qualifiedDeal.uuid) highlight(OverviewTypes.Pipeline.Qualified_Note, qualifiedDeal.uuid, 'add_note');
    },
    updateProducts: ({ highlight, qualifiedDeal, fetchListByProspect, overviewType }) => () => {
      if (qualifiedDeal.uuid) {
        fetchListByProspect(qualifiedDeal.uuid);
        if (qualifiedDeal.won !== null) {
          highlight(OverviewTypes.Pipeline.Order, qualifiedDeal.uuid, 'editProducts');
        } else {
          highlight(OverviewTypes.Pipeline.Qualified, qualifiedDeal.uuid, 'editProducts');
        }
      }
    },
    addAppointment: ({
      overviewType,
      createEntityOverview,
      userAccount,
      organisationItem,
      highlight,
      contactItem,
      qualifiedDeal,
      prospectConcatItem,
    }) => () => {
      // console.log("addAppointment overviewType",overviewType);
      // console.log("addAppointment qualifiedDeal",qualifiedDeal);
      contactItem(qualifiedDeal.sponsorList);
      organisationItem(
        qualifiedDeal.organisation || { uuid: qualifiedDeal.organisationId, name: qualifiedDeal.organisationName }
      );
      prospectConcatItem(qualifiedDeal);
      // let overviewT = overviewType == OverviewTypes.Pipeline.Order ? OverviewTypes.Pipeline.Order_Task : OverviewTypes.Pipeline.Qualified_Task;
      let overviewT = OverviewTypes.Pipeline.Qualified_Appointment;
      switch (overviewType) {
        case OverviewTypes.Account_Qualified:
        case OverviewTypes.Account_Order:
          overviewT = OverviewTypes.Account_Appointment;
          break;
        case OverviewTypes.Pipeline.Order:
          overviewT = OverviewTypes.Pipeline.Qualified_Appointment;
          break;
        // case OverviewTypes.Contact_Qualified:
        //   overviewT = OverviewTypes.Contact_Qualified_Task;
        //   break;
        // case OverviewTypes.Contact_Order:
        //   overviewT = OverviewTypes.Contact_Order_Task;
        //   break;
      }
      createEntityOverview(overviewT, {
        // contactList: qualifiedDeal.sponsorList != null ? qualifiedDeal.sponsorList.map(value => value.uuid) : [],
        contacts: qualifiedDeal.sponsorList != null ? qualifiedDeal.sponsorList.map((value) => value.uuid) : [],
        responsible: userAccount.uuid,
        organisation:
          qualifiedDeal.organisation != null ? qualifiedDeal.organisation.uuid : qualifiedDeal.organisationId,
        prospect: { prospectId: qualifiedDeal.uuid },
      });
      highlight(overviewT, null, 'create');
    },
    addDocument: ({ uploadFileToCloud, connectedStorage, putError }) => () => {
      if(!connectedStorage) {
        putError('Please setup your company storage account first!')
        return;
      }
      document.getElementById('file-upload-deals').click();
      document.getElementById('file-upload-deals').onchange = function() {
        if (this.files && this.files.length) {
          uploadFileToCloud(this.files[0]);
        }
      };
    },
  })
)(QuickAddMenu);
