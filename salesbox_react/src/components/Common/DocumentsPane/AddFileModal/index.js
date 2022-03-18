/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
import React from 'react';
import _l from 'lib/i18n';
import { connect } from 'react-redux';
import { Form, TextArea, Input, Menu, Icon } from 'semantic-ui-react';
import { clearHighlightAction } from '../../../../components/Overview/overview.actions';
import { isHighlightAction } from '../../../../components/Overview/overview.selectors';
import { fetchDocumentsByFileIdSuccess } from '../../common.actions';
import ModalCommon from '../../../ModalCommon/ModalCommon';
import { OverviewTypes } from 'Constants';
import api from '../../../../lib/apiClient';
import css from '../../../../components/Task/EditTaskModal/EditTaskModal.css';

import googleDriveCustomService from '../service/googleDriveCustomService';
import * as NotificationActions from 'components/Notification/notification.actions';

addTranslations({
  'en-US': {
    Cancel: 'Cancel',
    Save: 'Save',
    'File name': 'File name',
    'File name is required': 'File name is required',
  },
});

class AddFileModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      message: '',
    };
  }

  _handleName = (e, { value }) => {
    this.setState({ name: value, message: '' });
  };

  hideEditForm = () => {
    this.props.clearHighlightAction(this.props.overviewType);
  };

  onSave = async () => {
    const { name } = this.state;
    if (!name) {
      this.setState({ message: _l`File name is required` });
    }
    if (name) {
      const { rootFolder } = this.props;
      const cloudParentFolderId = rootFolder.fileId;
      switch (this.props.highlightAction) {
      case 'add_google_doc':
        this.createOnlineDocument('GOOGLE_DOCS');
        break;

      case 'add_google_spreadsheet':
        this.createOnlineDocument('GOOGLE_EXCEL');
        break;

      case 'add_google_presentation':
        this.createOnlineDocument('GOOGLE_SLIDE');
        break;

      default:
        break;
      }
    }
  };

  createOnlineDocument = async(documentType) => {
    const { rootFolder, currentOverviewType } = this.props;
    let objectType = 'ACCOUNT';
    switch(currentOverviewType) {
      case OverviewTypes.Account:
        objectType = 'ACCOUNT';
        break;
      case OverviewTypes.CallList.Contact:
      case OverviewTypes.Contact:
        objectType = "CONTACT";
        break;
      case OverviewTypes.Pipeline.Qualified:
        objectType = "OPPORTUNITY";
        break;
      case OverviewTypes.Pipeline.Order:
        objectType = "OPPORTUNITY";
        break;
    }
    try {
      const res = await api.post({
        resource: 'document-v3.0/document/createOnlineDocument',
        query: {
          objectType: objectType,
          objectId: this.props.objectId,
          folderId: rootFolder.fileId,
          documentType,
          name: this.state.name,
        },
      });
      if (res) {
        this.props.clearHighlightAction(this.props.overviewType);
        this.props.fetchDocumentsByFileIdSuccess({ documentDTOList: [res] }, false);
        res.fileURL && window.open(res.fileURL);
      }
    } catch (error) {
      this.props.putError(error.message);
    }
  }

  onSuccess = async (res) => {
    const { rootFolder } = this.props;
    const cloudParentFolderId = rootFolder.fileId;
    const parentFolderId = rootFolder.uuid;
    const transformedResponse = googleDriveCustomService.transformSuccessResponse(res);
    const documentDTO = {
      name: this.state.name,
      isFolder: false,
      authorId: rootFolder.authorId,
      sourceType: rootFolder.sourceType,
      prospectId: rootFolder.prospectId,
      fileURL: transformedResponse.fileURL,
      fileId: transformedResponse.fileId,
      folderId: parentFolderId,
    };
    try {
      const res = await api.post({
        resource: 'document-v3.0/document/add',
        data: documentDTO,
      });
      if (res) {
        this.props.clearHighlightAction(this.props.overviewType);
        this.props.fetchDocumentsByFileIdSuccess({ documentDTOList: [res] }, false);
        window.open(transformedResponse.fileURL);
      }
    } catch (error) {
      this.props.putError(error.message);
    }
  };

  onFail = (error) => {
    this.props.putError(error.message);
    console.log(error);
  };

  render() {
    const { visible } = this.props;
    const { message } = this.state;
    return (
      <React.Fragment>
        <ModalCommon
          title={_l`Add file`}
          visible={visible}
          onDone={this.onSave}
          onClose={this.hideEditForm}
          className={css.editTaskModal}
          okLabel={_l`Save`}
          scrolling={true}
        >
          <div className="qualified-add-form">
            <Form>
              <Form.Group className="unqualified-fields">
                <div className="unqualified-label">
                  {_l`File name`}
                  <span className="required">*</span>
                </div>
                <div className="dropdown-wrapper">
                  <Input value={this.state.name} onChange={this._handleName} error={message ? true : false} />
                  <span className="form-errors">{message && message}</span>
                </div>
              </Form.Group>
            </Form>
          </div>
        </ModalCommon>
      </React.Fragment>
    );
  }
}
const mapStateToProps = (state, { overviewType }) => {

  const visible =
    isHighlightAction(state, overviewType, 'add_google_doc') ||
    isHighlightAction(state, overviewType, 'add_google_spreadsheet') ||
    isHighlightAction(state, overviewType, 'add_google_presentation');

  return {
    selected: state.common.__DOCUMENTS.selected
      ? state.common.__DOCUMENTS.selected
      : {},
    rootFolder: state.common.__DOCUMENTS.rootFolder
      ? state.common.__DOCUMENTS.rootFolder
      : {},
    visible,
    highlightAction: state.overview[overviewType] ? state.overview[overviewType].highlightAction : null,
    objectId: state.common.__DOCUMENTS.objectId,
    currentOverviewType: state.common.currentOverviewType,
  };
};

export default connect(mapStateToProps, {
  clearHighlightAction,
  isHighlightAction,
  fetchDocumentsByFileIdSuccess,
  putError: NotificationActions.error,
})(AddFileModal);
