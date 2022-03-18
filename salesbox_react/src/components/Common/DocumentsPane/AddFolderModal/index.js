/* eslint-disable react/prop-types */
import React from 'react';
import _l from 'lib/i18n';
import { connect } from 'react-redux';
import { Form, TextArea, Input, Menu, Icon } from 'semantic-ui-react';
import { clearHighlightAction } from '../../../../components/Overview/overview.actions';
import { isHighlightAction } from '../../../../components/Overview/overview.selectors';
import { fetchDocumentsByFileIdSuccess } from '../../../PipeLineQualifiedDeals/qualifiedDeal.actions';
import ModalCommon from '../../../ModalCommon/ModalCommon';
import { OverviewTypes } from 'Constants';
import api from '../../../../lib/apiClient';
import css from '../../../../components/Task/EditTaskModal/EditTaskModal.css';

const overviewType = OverviewTypes.Pipeline.Lead;

addTranslations({
  'en-US': {
    Cancel: 'Cancel',
    Save: 'Save',
    'Add folder': 'Add folder',
  },
});

class AddFolderModal extends React.Component {
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
      this.setState({ message: _l`Folder name is required` });
    }
    if (name) {
      const { selected, rootFolder } = this.props;
      const documentDTO = {
        name,
        isFolder: true,
        authorId: rootFolder.authorId,
        sourceType: rootFolder.sourceType,
        prospectId: rootFolder.prospectId,
        folderPathById: selected.fileId ? selected.fileId : rootFolder.fileId,
        fileURL: selected.fileURL ? selected.fileURL : rootFolder.fileURL,
      };
      try {
        const res = await api.post({
          resource: 'document-v3.0/document/putFolderToCloud',
          data: documentDTO,
        });
        if (res) {
          this.props.clearHighlightAction(this.props.overviewType);
          this.props.fetchDocumentsByFileIdSuccess({ documentDTOList: [res] }, selected.fileId);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  render() {
    const { visible } = this.props;
    const { message } = this.state;
    return (
      <React.Fragment>
        <ModalCommon
          title={_l`Add folder`}
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
                  {_l`Folder name`}
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
  const visible = isHighlightAction(state, overviewType, 'add_folder');
  return {
    selected: state.entities.qualifiedDeal.__DOCUMENTS.selected
      ? state.entities.qualifiedDeal.__DOCUMENTS.selected
      : {},
    rootFolder: state.entities.qualifiedDeal.__DOCUMENTS.rootFolder
      ? state.entities.qualifiedDeal.__DOCUMENTS.rootFolder
      : {},
    visible,
  };
};

export default connect(mapStateToProps, {
  clearHighlightAction,
  isHighlightAction,
  fetchDocumentsByFileIdSuccess,
})(AddFolderModal);
