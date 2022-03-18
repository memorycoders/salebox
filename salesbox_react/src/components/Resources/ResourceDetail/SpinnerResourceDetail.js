import React, { Fragment, memo, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Menu, Popup, Icon } from 'semantic-ui-react';
import qualifiedAdd from '../../../../public/Qualified_deals.svg';
import css from './LeftContent.css';
import api from 'lib/apiClient';
import _l from 'lib/i18n';
import ModalShareProfile from './ModalShareProfile';
import shareIcon from '../../../../public/Delegation.svg';
import { compose, withHandlers } from 'recompose';
import * as OverviewActions from 'components/Overview/overview.actions';
import { OverviewTypes } from 'Constants';
import { withRouter } from 'react-router';
import * as ResourcesActionsTypes from '../resources.actions';
import { isHighlightAction } from '../../Overview/overview.selectors';
import ModalCommon from '../../ModalCommon/ModalCommon';
import ModalSendEmailAddDeal from './ModalSendEmailAddDeal';
import * as NotificationActions from 'components/Notification/notification.actions';
import { Endpoints } from '../../../Constants';

export const SpinnerResourceDetail = ({
  addQualified,
  setAddDealResource,
  visibleAddDeal,
  isSavedEmailAfterAddDeal,
  setOpenSavedAfterAddDeal,
  currentVersion,
  profileDetail,
  infoAfterAddDeal,
  accountAllowedSendEmail,
  showInfo,
  resource,
  spinnerInList = false,
  setResourceForAddDealInListResource,
  fetchResourceDetail,
  deleteRowSuccess,
  notiSuccess,
  overviewType,
  deleteLocalResource
}: any) => {
  const [visible, setVisible] = useState(false);
  const [contactId, setContactId] = useState('');
  const [companyId, setCompanyId] = useState('');
  const [showModalSendEmail, setShowModalSendEmail] = useState(false);
  const [showModalDelete, setShowModalDelete] = useState(false);


  useEffect(() => {
    if (!visibleAddDeal) {
      setAddDealResource(false);
    }
  }, [visibleAddDeal]);

  const openAddDeal = () => {
    setAddDealResource(true);
    addQualified();
    if(spinnerInList) {
      setResourceForAddDealInListResource(resource);
    }
  };

  const shareProfile = () => {
    setVisible(true);
  };

  const onSavedCv = () => {
    if (!accountAllowedSendEmail) {
      showInfo(`You need to connect an Office365 or Gmail account to Salesbox first`, 'Info');
      return;
    }
    if (infoAfterAddDeal) {
      setContactId(infoAfterAddDeal?.contact ? infoAfterAddDeal?.contact[0]?.uuid : null);
      setCompanyId(infoAfterAddDeal?.company ? infoAfterAddDeal?.company?.uuid : null);
    }
    setShowModalSendEmail(true);
    setOpenSavedAfterAddDeal(false);
  };

  const onSendCV = () => {
    if (!accountAllowedSendEmail) {
      showInfo(`You need to connect an Office365 or Gmail account to Salesbox first`, 'Info');
      return;
    }
    if(spinnerInList && resource) {
      fetchResourceDetail(resource.uuid, 'en');
    }
    setShowModalSendEmail(true);

  };
  const onDelete = async () => {
    try {
      const res = await api.get({
        resource: `${Endpoints.Resource}/resource/delete/${resource.uuid}`,
      });
      if (res) {
        setShowModalDelete(false);
        notiSuccess('Success', null, 2000);
        deleteLocalResource(resource.uuid);
        deleteRowSuccess(overviewType, resource.uuid);
      }
    } catch (error) {
      console.log('You got an error =>', error)
    }
  };

  const onDeleteResource = () => {
    setShowModalDelete(true);
  };

  return (
    <Fragment>
      <Popup
        on="click"
        flowing
        position="bottom center"
        hoverable
        keepInViewPort
        hideOnScroll
        style={{ padding: 0 }}
        trigger={
          <img
            className={css.threeDot}
            style={{
              height: '20px !important',
              marginBottom: spinnerInList ? '0' : '10px',
              marginRight: spinnerInList ? '17px' : '0',
            }}
            src={require('../../../../public/3_dots.svg')}
          />
        }
        content={
          !spinnerInList ? (
            <Menu vertical color="teal">
              <Menu.Item icon onClick={openAddDeal}>
                <div className={css.actionIcon}>
                  {_l`Add to deal`}
                  <img style={{ height: '13px', width: '20px' }} src={qualifiedAdd} />
                </div>
              </Menu.Item>
              {profileDetail?.resourceType !== 'CONTRACTOR' && (
                <Menu.Item icon onClick={shareProfile}>
                  <div className={css.actionIcon}>
                    {_l`Share profile`}
                    <img style={{ height: '13px', width: '20px' }} src={shareIcon} />
                  </div>
                </Menu.Item>
              )}
            </Menu>
          ) : (
            <Menu vertical color="teal">
              <Menu.Item icon onClick={openAddDeal}>
                <div className={css.actionIcon}>
                  {_l`Add to deal`}
                  <img style={{ height: '13px', width: '20px' }} src={qualifiedAdd} />
                </div>
              </Menu.Item>
              {resource?.resourceType !== 1 && (
                <Menu.Item icon onClick={shareProfile}>
                  <div className={css.actionIcon}>
                    {_l`Share profile`}
                    <img style={{ height: '13px', width: '20px' }} src={shareIcon} />
                  </div>
                </Menu.Item>
              )}
              <Menu.Item icon onClick={onSendCV}>
                <div className={css.actionIcon}>
                  {_l`Send CV`}
                  <img style={{ height: '13px', width: '20px' }} src={shareIcon} />
                </div>
              </Menu.Item>
              {resource?.resourceType === 1 && (
                <Menu.Item icon onClick={onDeleteResource}>
                  <div className={css.actionIcon}>
                    {_l`Delete`}
                    <Icon name="trash alternate" color="grey" />
                  </div>
                </Menu.Item>
              )}
            </Menu>
          )
        }
      />

      <ModalShareProfile
        visible={visible}
        setVisible={setVisible}
        currentVesion={currentVersion}
        resource={resource}
        spinnerInList={spinnerInList}
      />
      <ModalSendEmailAddDeal
        currentVersion={currentVersion}
        companyId={companyId}
        contactIdAfterAddDeal={contactId}
        visible={showModalSendEmail}
        resource={resource}
        spinnerInList={spinnerInList}
        setVisible={setShowModalSendEmail}
      />

      <ModalCommon
        title={_l`Send CV`}
        visible={isSavedEmailAfterAddDeal}
        onDone={onSavedCv}
        onClose={() => setOpenSavedAfterAddDeal(false)}
        size="small"
        scrolling={false}
        okLabel={_l`OK`}
      >
        <p>{_l`Do you want to send the CV to the chosen contact?`}</p>
      </ModalCommon>

      <ModalCommon visible={showModalDelete} title={_l`Confirm`} onDone={onDelete} onClose={() => setShowModalDelete(false)} size="tiny">
        <p>{_l`Do you really want to delete this resoure?`}</p>
      </ModalCommon>
    </Fragment>
  );
};

const mapStateToProps = (state, props) => {
  const visible = isHighlightAction(state, OverviewTypes.Pipeline.Qualified, 'create');
  return {
    visibleAddDeal: visible,
    isSavedEmailAfterAddDeal: state.entities?.resources?.isSavedEmailAfterAddDeal,
    infoAfterAddDeal: state.entities?.resources?.infoAfterAddDeal,
    profileDetail: state.entities?.resources?.__DETAIL,
    accountAllowedSendEmail: state.common.accountAllowedSendEmail,
  };
};

const mapDispatchToProps = {
  setActionForHighlight: OverviewActions.setActionForHighlight,
  deleteRowSuccess: OverviewActions.deleteRowSuccess,
  setAddDealResource: ResourcesActionsTypes.setAddDealResource,
  setOpenSavedAfterAddDeal: ResourcesActionsTypes.setOpenSavedAfterAddDeal,
  showInfo: NotificationActions.info,
  setResourceForAddDealInListResource: ResourcesActionsTypes.setResourceForAddDealInListResource,
  fetchResourceDetail: ResourcesActionsTypes.fetchResourceDetail,
  deleteLocalResource: ResourcesActionsTypes.deleteLocalResource,
  notiError: NotificationActions.error,
  notiSuccess: NotificationActions.success,
};

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
  memo,
  withHandlers({
    addQualified: ({ setActionForHighlight }) => () => {
      setActionForHighlight(OverviewTypes.Pipeline.Qualified, 'create');
    },
  })
)(SpinnerResourceDetail);
