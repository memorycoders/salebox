import React from 'react';
import { connect } from 'react-redux';
import ModalCommon from '../ModalCommon/ModalCommon';
import _l from 'lib/i18n';
import { withRouter } from 'react-router';
import { setVisibleNotiAddFortnoxFirst, setIsLoginFromStartPageFortnox } from '../Common/common.actions';

export const ModalAddFortnoxAddonFirst = (props) => {
  const { setVisibleNotiAddFortnoxFirst, visible, setIsLoginFromStartPageFortnox } = props;

  const onClose = () => {
    setIsLoginFromStartPageFortnox(false, null);
    setVisibleNotiAddFortnoxFirst(false);
  };
  const onDone = () => {
    setIsLoginFromStartPageFortnox(false, null);
    setVisibleNotiAddFortnoxFirst(false);
    props.history.push('/billing-info');
  };
  return (
    <ModalCommon
      size="small"
      title={_l`Add the Fortnox add-on first`}
      okLabel={_l`Billing page`}
      visible={visible}
      onClose={onClose}
      onDone={onDone}
    >
      <p>{_l`We noticed that you have not added the Fortnox add-on to Salesbox yet. To be bale to activate your connection between Salesbox and Fortnox, please go to Salesbox Billing and add the Fortnox add-on.`}</p>
      <p>{_l`Once the add-on is added you can go back to Fortnox app market and click the Get/Activate button again and login to Salesbox to activate the connection.`}</p>
      <p>{_l`Once the connection is activated we will automatically begin transferring your customer data from Fortnox to Salesbox.`}</p>
      <p>{_l`Click on the blur button to go to the Billing page and add the Fortnox add-on.`}</p>
    </ModalCommon>
  );
};

const mapStateToProps = (state) => ({
  visible: state.common.visibleNotiAddFortnoxFirst,
});

const mapDispatchToProps = {
  setVisibleNotiAddFortnoxFirst,
  setIsLoginFromStartPageFortnox,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ModalAddFortnoxAddonFirst));
