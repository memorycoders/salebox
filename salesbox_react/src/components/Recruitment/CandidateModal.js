import React from 'react';
import _l from 'lib/i18n';
import { connect } from 'react-redux';
import { clearHighlight } from 'components/Overview/overview.actions';
import { isHighlightAction } from 'components/Overview/overview.selectors';
import { OverviewTypes, OverviewColors } from 'Constants';
// import { CampaignsForm } from './CampaignsForm';
import ModalCommon from '../ModalCommon/ModalCommon';
import css from '../Task/EditTaskModal/EditTaskModal.css';
import api from '../../lib/apiClient';
import { success, error } from '../Notification/notification.actions';
import { getCustomFieldsObject } from '../CustomField/custom-field.selectors';
import { CandidateForm } from './CandidateForm';
import { fetchRCActiveDataByCaseId, selectRecruitmentCase } from '../Recruitment/recruitment.actions';
import * as OverviewActions from '../Overview/overview.actions';
addTranslations({
  'en-US': {
    Cancel: 'Cancel',
    Save: 'Save',
    'Name is required': 'Name is required',
    'End date is required': 'End date is required',
    'Start date is required': 'Start date is required',
    'Product group is required': 'Product group is required',
    'Products is required': 'Products is required',
    'Units is required': 'Units is required',
    'Users is required': 'Users is required',
  },
});

class CandidateModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      errors: {},
    };
    this.params = {};
  }

  componentWillReceiveProps(nextProps) {

    if (this.props.listRC !== nextProps.listRC) {
    }
  }
  hideEditForm = () => {
    const { overviewType } = this.props;
    this.props.clearHighlight(overviewType);
  };

  onSave = async () => {
    const { contactId, userList, recruitmentCaseId } = this.params;
    console.log('params', this.params);
    const { userId, overviewType } = this.props;
    let errors = {};
    if (userList.length === 0) {
      errors.userList = _l`Responsible is required`;
    }
    if (!recruitmentCaseId) {
      errors.recruitmentCaseId = _l`Recruitment case is required`;
    }
    if (!contactId) {
      errors.contactId = _l`Candidate is required`;
    }

    if (Object.keys(errors).length === 0) {
      try {
        const create = await api.post({
          resource: `/recruitment-web-v3.0/candidate/add`,
          data: {
            // ...this.params,
            recruitmentCaseId: recruitmentCaseId,
            // contractDate: 1607844687086,
            contactIdList: contactId,
            participantList: userList,
          },
        });
        if (create) {
          console.log('Starting create candidate...', create);
          this.props.success(`Added`, '', 2000);
          this.props.clearHighlight(overviewType);
          this.props.fetchRCActiveDataByCaseId(recruitmentCaseId);
          this.props.selectRecruitmentCase(recruitmentCaseId);
        }
      } catch (error) {
        this.props.error(error.message);
      }
    } else {
      console.log('errors: ', errors);
      this.setState({ errors });
    }
  };

  render() {
    const { visible, customField, order, __CREATE } = this.props;
    return (
      <ModalCommon
        title={_l`Add candidate`}
        visible={visible}
        onDone={this.onSave}
        onClose={this.hideEditForm}
        size="small"
        okLabel={_l`Save`}
        scrolling={false}
        description={false}
        // closeOnDimmerClick={false}
      >
        <CandidateForm
          listRC={this.props.listRC}
          userId={this.props.userId}
          formKey="__CREATE"
          overviewType={this.props.overviewType}
          errors={this.state.errors}
          setParams={(params) => (this.params = params)}
          __CREATE={__CREATE}
        />
      </ModalCommon>
    );
  }
}
const mapStateToProps = (state, { overviewType }) => {
  const visible = isHighlightAction(state, overviewType, 'create');
  const customField = getCustomFieldsObject(state);
  return {
    visible,
    customField,
    userId: state.auth.userId,
    listRC: state.entities?.recruitment?.__COMMON_DATA?.listRecruitmentCase,
    __CREATE: state.entities.recruitment?.__CREATE


  };
};

export default connect(mapStateToProps, {
  clearHighlight,
  success,
  error,
  fetchRCActiveDataByCaseId,
  selectRecruitmentCase,
})(CandidateModal);
