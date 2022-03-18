/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/prop-types */
import React from 'react';
import _l from 'lib/i18n';
import { connect } from 'react-redux';
import api from 'lib/apiClient';
import { isValidPhone, isEmail } from 'lib';
import ModalCommon from '../../ModalCommon/ModalCommon';
import CreateContactForm from '../CreateContactForm/index';
import { clearHighlight } from '../../Overview/overview.actions';
import { isHighlightAction } from '../../Overview/overview.selectors';
import CropPhotoModal from '../../Organisation/CreateAccountForm/CropPhotoModal';
import css from '../../Organisation/CreateAccountModal/CreateAccountModal.css';
import {
  uploadErrors,
  requestUpdate,
  succeedCreate,
  clearContactDetailToEdit,
  update as updateField,
} from '../contact.actions';
addTranslations({
  'en-US': {
    save: 'Save',
    'Edit contact': 'Edit contact',
    'First name is required': 'First name is required',
    Confirm: 'Confirm',
  },
});

class EditContactModal extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      message: '',
      closeOnDimmerClick: true,
    };
    this.isKeep = false;
  }

  hideEditForm = () => {
    const { overviewType } = this.props;
    this.props.clearHighlight(overviewType, '');
    // this.props.succeedCreate();
    this.props.clearContactDetailToEdit();
  };

  hideEditConfirm = () => {
    this.setState({ showModal: false, message: '' });
  };

  onSave = async () => {
    let isValid = true;
    let isEmailValid = true;
    const { form } = this.props;
    const { firstName, additionalEmailList = [], lastName } = form;
    if (!firstName) {
      this.props.uploadErrors({ firstName: _l`First name is required` });
      isValid = false;
    }
    if (!lastName) {
      this.props.uploadErrors({ lastName: _l`Last name is required` });
      isValid = false;
    }
    const listEmail = [];
    const emailErrors = this.props.errors.emails || [];
    additionalEmailList.forEach((e) => {
      if (e.value && !isEmail(e.value)) {
        isValid = false;
        isEmailValid = false;
        emailErrors.push(e);
        this.props.uploadErrors({ emails: emailErrors });
      } else {
        listEmail.push(e.value);
      }
    });
    if (isEmailValid) {
      this.props.uploadErrors({ emails: [] });
    }
    if (isValid) {
      this.props.uploadErrors({ emails: [] });
      console.log('this.props.detailToEdit.organisationId', this.props.detailToEdit.organisationId);
      console.log('form.organisationId ', form.organisationId);
      if (form.organisationId != this.props.detailToEdit.organisationId) {
        this.setState({
          visibleConfirmKeepContact: true,
        });
        //close Detail
        let path = window.location.pathname;
        let uuid = path.slice('/contacts'.length + 1);
        if (path.includes(this.props.detailToEdit.uuid)) {
          let newDirection = path.slice(0, path.length - uuid.length - 1);
          window.browserHistory.push(newDirection);
        }
      } else {
        this.onSaveConfirm();
      }
    }
    // this.props.clearContactDetailToEdit();
  };

  dataURLtoFile(dataurl, filename) {
    let arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }

  uploadAvatar = async (fileData) => {
    if (!fileData) return null;
    try {
      const formData = new FormData();
      formData.append('avatar', this.dataURLtoFile(this.props.dataURL, fileData.name));
      const res = await api.post({
        resource: `document-v3.0/photo/uploadAvatar`,
        data: formData,
        options: {
          headers: {
            'content-type': 'multipart/form-data',
          },
        },
      });
      if (res) {
        return res.avatar;
      }
    } catch (error) {
      console.log(error);
    }
  };

  getDetailsFromEmail = async (emails) => {
    return Promise.all(
      emails.map((email) => {
        return api.get({
          resource: 'contact-v3.0/getDetailsFromEmail',
          query: {
            languageCode: 'en',
            email: email,
          },
        });
      })
    ).then((results) => {
      return results;
    });
  };

  checkEmailExist = (rs) => {
    for (let i = 0; i < rs.length; i++) {
      if (rs[i] && rs[i].uuid) {
        return rs[i];
      }
    }
    return null;
  };

  onSaveConfirm = async () => {
    this.setState({ showModal: false, message: '' });
    const { form, fileData } = this.props;
    let avatar = form.avatar || null;
    if (fileData) {
      avatar = await this.uploadAvatar(fileData);
    }
    console.log('this.isKeep ', this.isKeep);
    if (this.isKeep) {
      this.props.updateField('__EDIT', { ['keepOldData']: true });
    }
    this.props.requestUpdate(avatar);
  };
  confirmKeepInfo = async (isKeep) => {
    this.isKeep = isKeep;
    this.setState((state) => ({
      visibleConfirmKeepContact: false,
    }));
    this.onSaveConfirm();
  };
  yesKeeInfo = () => {
    this.confirmKeepInfo(true);
  };
  noKeeInfo = () => {
    this.confirmKeepInfo(false);
  };
  changeCloseOnDimmerClick = (closeOnDimmerClick) => {
    this.setState({ closeOnDimmerClick });
  };
  render() {
    const { visible } = this.props;
    const { closeOnDimmerClick } = this.state;

    return (
      <React.Fragment>
        <ModalCommon
          closeOnDimmerClick={closeOnDimmerClick}
          title={_l`Update contact`}
          visible={visible}
          onDone={this.onSave}
          onClose={this.hideEditForm}
          okLabel={_l`save`}
          scrolling={true}
          className={css.modal}
          paddingAsHeader
        >
          <CreateContactForm formKey="__EDIT" changeCloseOnDimmerClickParent={this.changeCloseOnDimmerClick} />
        </ModalCommon>
        <CropPhotoModal type="contact" />

        <ModalCommon
          closeOnDimmerClick={false}
          title={_l`Confirm`}
          visible={this.state.showModal}
          onDone={this.onSaveConfirm}
          onClose={this.hideEditConfirm}
          okLabel={_l`save`}
          scrolling={true}
          className={css.confirmModal}
          paddingAsHeader
        >
          <p>{this.state.message}</p>
        </ModalCommon>

        <ModalCommon
          closeOnDimmerClick={false}
          title={_l`Confirm`}
          visible={this.state.visibleConfirmKeepContact}
          onDone={this.yesKeeInfo}
          onClose={this.noKeeInfo}
          size="tiny"
          paddingAsHeader
        >
          <p style={{ wordBreak: 'break-word' }}>
            {_l`Do you want to keep current information on the contact (Notes, Communication history and data in custom fields)?`}
          </p>
        </ModalCommon>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state, { overviewType }) => {
  const visible = isHighlightAction(state, overviewType, 'edit');

  return {
    visible,
    form: state.entities.contact.__EDIT || {},
    detailToEdit: state.entities.contact.__DETAIL_TO_EDIT || {},
    fileData: state.entities.contact.__UPLOAD ? state.entities.contact.__UPLOAD.fileData : null,
    dataURL: state.entities.contact.__UPLOAD ? state.entities.contact.__UPLOAD.dataURL : null,
    errors: state.entities.contact.__ERRORS,
  };
};
export default connect(mapStateToProps, {
  isHighlightAction,
  clearHighlight,
  uploadErrors,
  requestUpdate,
  succeedCreate,
  clearContactDetailToEdit,
  updateField,
})(EditContactModal);
