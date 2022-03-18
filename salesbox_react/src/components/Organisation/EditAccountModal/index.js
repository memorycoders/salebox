/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/prop-types */
import React from 'react';
import _l from 'lib/i18n';
import { connect } from 'react-redux';
import api from 'lib/apiClient';
import { isValidPhone, isEmail } from 'lib';
import ModalCommon from '../../ModalCommon/ModalCommon';
import { clearHighlight } from '../../Overview/overview.actions';
import { isHighlightAction } from '../../Overview/overview.selectors';
import CreateAccountForm from '../CreateAccountForm';
import CropPhotoModal from '../CreateAccountForm/CropPhotoModal';
import { uploadErrors, requestUpdate } from '../organisation.actions';
import css from '../CreateAccountModal/CreateAccountModal.css';
import * as AccountActions from '../organisation.actions';

addTranslations({
  'en-US': {
    save: 'Save',
    'Edit account': 'Edit account',
    'Name is required': 'Name is required',
  },
});

class EditAccountModal extends React.PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      closeOnDimmerClick: true
    }
  }

  hideEditForm = () => {
    const { overviewType } = this.props;
    this.props.clearHighlight(overviewType, '');
    this.props.clearAccountDetailToEdit();
  };

  onSave = async () => {
    let isValid = true;
    let isEmailValid = true;
    const { form, fileData } = this.props;
    const { name, additionalEmailList = [] } = form;
    if (!name) {
      this.props.uploadErrors({ name: _l`Name is required` });
      isValid = false;
    }
    const emailErrors = this.props.errors.emails || [];
    additionalEmailList.forEach((e) => {
      if (e.value && !isEmail(e.value)) {
        isValid = false;
        isEmailValid = false;
        emailErrors.push(e);
        this.props.uploadErrors({ emails: emailErrors });
      }
    });
    if (isEmailValid) {
      this.props.uploadErrors({ emails: [] });
    }
    if (isValid) {
      let avatar = form.avatar || null;
      if (fileData) {
        avatar = await this.uploadAvatar(fileData);
      }
      this.props.requestUpdate(avatar);
    }
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

  changeCloseOnDimmerClick = closeOnDimmerClick => {
    this.setState({ closeOnDimmerClick })
  }
  render() {
    const { visible } = this.props;
    const { closeOnDimmerClick } = this.state;

    return (
      <React.Fragment>
        <ModalCommon
          closeOnDimmerClick={closeOnDimmerClick}
          title={_l`Update company`}
          visible={visible}
          onDone={this.onSave}
          onClose={this.hideEditForm}
          okLabel={_l`save`}
          scrolling={true}
          className={css.modal}
          paddingAsHeader
        >
          <CreateAccountForm changeCloseOnDimmerClickParent={this.changeCloseOnDimmerClick}  formKey="__EDIT" />
        </ModalCommon>
        <CropPhotoModal type="organisation" />
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state, { overviewType }) => {
  const visible = isHighlightAction(state, overviewType, 'edit');

  return {
    visible,
    form: state.entities.organisation.__EDIT || {},
    fileData: state.entities.organisation.__UPLOAD ? state.entities.organisation.__UPLOAD.fileData : null,
    dataURL: state.entities.organisation.__UPLOAD ? state.entities.organisation.__UPLOAD.dataURL : null,
    errors: state.entities.organisation.__ERRORS,
  };
};
export default connect(mapStateToProps, {
  isHighlightAction,
  clearHighlight,
  uploadErrors,
  requestUpdate,
  editEntity: AccountActions.editEntity,
  clearAccountDetailToEdit: AccountActions.clearAccountDetailToEdit,
})(EditAccountModal);
