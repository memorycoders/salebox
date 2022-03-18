/* eslint-disable react/prop-types */
import React from 'react';
import _l from 'lib/i18n';
import { connect } from 'react-redux';
import api from 'lib/apiClient';
import { Modal, Button } from 'semantic-ui-react';
import cx from 'classnames';
import { clearHighlight } from '../../Overview/overview.actions';
import { isHighlightAction } from '../../Overview/overview.selectors';
import { createErros, createEntityFetch, clearCreateEntity, clearErrors } from '../unqualifiedDeal.actions';
import { changeOnMultiMenu } from '../../Contact/contact.actions';
import { OverviewTypes } from 'Constants';
import ModalCommon from '../../ModalCommon/ModalCommon';
import css from '../../Task/EditTaskModal/EditTaskModal.css';
import cssComon from '../../ModalCommon/ModalCommon.css';
import localCss from '../../Notification/NotificationItem.css';
import CreatePipelineForm from '../CreatePipelineForm/CreatePipelineForm';
import { FORM_KEY } from '../../../Constants';
import { getCustomFieldsObject } from '../../CustomField/custom-field.selectors';

const overviewTypeDefault = OverviewTypes.Pipeline.Lead;

addTranslations({
  'en-US': {
    Cancel: 'Cancel',
    Save: 'Save',
    'Want to create a qualify prospect reminder?': 'Want to create a qualify prospect reminder?',
    'Priority is required': 'Priority is required',
    'You already have this lead, do you still want to add?': 'You already have this lead, do you still want to add?',
    Yes: 'Yes',
    No: 'No',
    Confirm: 'Confirm',
  },
});

class CreatePipelineModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openPopup: false,
      message: '',
      overviewType: props.overviewType || overviewTypeDefault,
      hiddenAccount: this.isHiddenAccount(),
    };
  }

  isHiddenAccount = () => {
    return (
      this.props.overviewType == OverviewTypes.Account_Unqualified_Multi ||
      this.props.overviewType == OverviewTypes.Contact_Unqualified_Multi
    );
  };

  hideEditForm = () => {
    this.props.clearHighlight(this.state.overviewType);
    this.props.clearCreateEntity();
    this.props.clearErrors();
  };

  checkDup = async () => {
    const { form } = this.props;
    if (form.productList && form.productList === null) delete form.productList;
    try {
      const data = await api.post({
        resource: `lead-v3.0/checkDuplicateAdding`,
        data: {
          ...form,
        },
      });
      return data;
    } catch (e) {
      return e.message;
    }
  };

  onSave = async () => {
    const { form } = this.props;
    const { contactId, organisationId, priority } = form;
    if (!this.state.hiddenAccount && !contactId && !organisationId) {
      this.props.createErros({
        contactId: _l`Company or contact is required`,
        organisationId: _l`Company or contact is required`,
      });
    }
    if (!priority) {
      this.props.createErros({
        priority: _l`Priority is required`,
      });
    }
    if (!this.state.hiddenAccount && (contactId || organisationId) && priority) {
      const checked = await this.checkDup();
      if (checked === 'SUCCESS') {
        this.props.createEntityFetch(this.state.overviewType);
      }
      if (checked === 'DUPLICATED_LEAD_OF_MINE') {
        this.setState({ openPopup: true, message: _l`You already have this prospect, do you still want to add ?` });
      }
      if (checked === 'DUPLICATED_LEAD_OF_OTHER') {
        this.setState({
          openPopup: true,
          message: `A similar lead already exist on ${this.props.user &&
            this.props.user.email}, do you still want to add?`,
        });
      }
    } else if (this.state.hiddenAccount && priority) {
      if (this.state.overviewType == OverviewTypes.Contact_Unqualified_Multi) {
        this.props.changeOnMultiMenuContact('add_multi_unqualified', null, this.state.overviewType);
      } else {
        this.props.createEntityFetch(this.state.overviewType);
      }
    }
  };

  onClose = () => {
    this.setState({ openPopup: false });
  };

  onSubmit = () => {
    this.setState({ openPopup: false });
    this.props.createEntityFetch(this.state.overviewType);
  };

  render() {
    const { visible, customField } = this.props;
    return (
      <React.Fragment>
        <ModalCommon
          title={_l`Add prospect`}
          visible={visible}
          onDone={this.onSave}
          onClose={this.hideEditForm}
          className={customField.length > 0 ? css.modalCustomField : css.editTaskModal}
          okLabel={_l`Save`}
          scrolling={true}
        >
          <CreatePipelineForm formKey={FORM_KEY.CREATE} overviewType={this.state.overviewType} />
        </ModalCommon>
        <Modal className={cx(cssComon.modalContainer, localCss.notificationModal)} open={this.state.openPopup}>
          <Modal.Header className={cssComon.commonModalHeader}>
            <div className={cssComon.title}>{_l`Confirm`}</div>
          </Modal.Header>

          <Modal.Content className={localCss.body}>
            <Modal.Description className={cssComon.paddingAsHeader} style={{ fontSize: 11 }}>
              {this.state.message}
            </Modal.Description>
          </Modal.Content>
          <Modal.Actions className={cssComon.commonActionModal}>
            <Button
              className={cx(cssComon.commonCloseButton, cssComon.commonButton)}
              tabIndex={0}
              onClick={this.onClose}
            >
              {_l`No`}
            </Button>
            <Button
              className={cx(cssComon.commonDoneButton, cssComon.commonButton)}
              onClick={this.onSubmit}
            >{_l`Yes`}</Button>
          </Modal.Actions>
        </Modal>
      </React.Fragment>
    );
  }
}
const mapStateToProps = (state, { overviewType }) => {
  let overviewT = overviewType || overviewTypeDefault;
  const visible = isHighlightAction(state, overviewT, 'create');
  const customField = getCustomFieldsObject(state);
  return {
    customField,
    form: state.entities.unqualifiedDeal.__CREATE || {},
    user: state.auth.user,
    visible,
  };
};

export default connect(mapStateToProps, {
  clearHighlight,
  createErros,
  createEntityFetch,
  clearCreateEntity,
  clearErrors,
  changeOnMultiMenuContact: changeOnMultiMenu,
})(CreatePipelineModal);
