/* eslint-disable react/prop-types */
import React from 'react';
import _l from 'lib/i18n';
import { connect } from 'react-redux';
import api from 'lib/apiClient';
import { Modal, Button } from 'semantic-ui-react';
import cx from 'classnames';
import { clearHighlight } from '../../Overview/overview.actions';
import { isHighlightAction } from '../../Overview/overview.selectors';
import { createErros, updateEntityFetch, clearCreateEntity, clearErrors } from '../unqualifiedDeal.actions';
import { OverviewTypes } from 'Constants';
import ModalCommon from '../../ModalCommon/ModalCommon';
import css from '../../Task/EditTaskModal/EditTaskModal.css';
import cssComon from '../../ModalCommon/ModalCommon.css';
import localCss from '../../Notification/NotificationItem.css';
import CreatePipelineForm from '../CreatePipelineForm/CreatePipelineForm';

addTranslations({
  'en-US': {
    Cancel: 'Cancel',
    Save: 'Save',
    'Edit unqualified deal': 'Edit unqualified deal',
    'Priority is required': 'Priority is required',
    'You already have this lead, do you still want to add?': 'You already have this lead, do you still want to add?',
    Yes: 'Yes',
    No: 'No',
  },
});

class EditPipelineModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openPopup: false,
    };
  }

  hideEditForm = () => {
    const { overviewType } = this.props;
    this.props.clearHighlight(overviewType);
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

  onSave = () => {
    const { form, overviewType } = this.props;
    const { contactId, organisationId, priority } = form;
    if (!contactId && !organisationId) {
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
    if ((contactId || organisationId) && priority) {
      this.props.updateEntityFetch(overviewType);
    }
  };

  onClose = () => {
    this.setState({ openPopup: false });
  };

  onSubmit = () => {
    this.setState({ openPopup: false });
    this.props.updateEntityFetch();
  };

  render() {
    const { visible } = this.props;
    return (
      <React.Fragment>
        <ModalCommon
          title={_l`Update prospect`}
          visible={visible}
          onDone={this.onSave}
          onClose={this.hideEditForm}
          className={css.editTaskModal}
          okLabel={_l`Save`}
          scrolling={true}
        >
          <CreatePipelineForm formKey="__EDIT" hideOwner={this.props.hideOwner} />
        </ModalCommon>
        <Modal className={cx(cssComon.modalContainer, localCss.notificationModal)} open={this.state.openPopup}>
          <Modal.Header className={css.commonModalHeader}>
            <div className={cssComon.title}>Error</div>
          </Modal.Header>

          <Modal.Content className={localCss.body}>
            <Modal.Description className={cssComon.paddingAsHeader} style={{ fontSize: 11 }}>
              {_l`You already have this prospect, do you still want to add ?`}
            </Modal.Description>
          </Modal.Content>
          <Modal.Actions className={cssComon.commonActionModal}>
            <Button className={cx(css.commonCloseButton, css.commonButton)} tabIndex={0} onClick={this.onClose}>
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
  const visible = isHighlightAction(state, overviewType, 'edit');
  return {
    form: state.entities.unqualifiedDeal.__EDIT || {},
    visible,
  };
};

export default connect(mapStateToProps, {
  clearHighlight,
  createErros,
  updateEntityFetch,
  clearCreateEntity,
  clearErrors,
})(EditPipelineModal);
