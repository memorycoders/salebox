/* eslint-disable react/prop-types */
import React from 'react';
import _l from 'lib/i18n';
import { connect } from 'react-redux';
import { clearHighlight } from 'components/Overview/overview.actions';
import ModalCommon from '../../ModalCommon/ModalCommon';
import api from 'lib/apiClient';
import { success } from '../../Notification/notification.actions';
import { getCustomFieldsObject } from '../../CustomField/custom-field.selectors';
import { AddRecruitmentForm } from './AddRecruitmentForm';
import { Endpoints } from '../../../Constants';
import { fetchListRC } from '../recruitment.actions';

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

class AddRecruitmentModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      errors: {},
    };
    this.params = {};
  }

  onSave = async () => {
    console.log('---------------------', this.params);
    const { errors } = this.setState;
    if (!this.params.values.processId) {
      this.setState({
        errors: {
          ...errors,
          processId: _l`Process is required`,
        },
      });
    }
    if (!this.params.values.name) {
      this.setState({
        errors: {
          ...errors,
          name: _l`Name is required`,
        },
      });
    }

    try {
      const res = await api.post({
        resource: `${Endpoints.Recruitment}/recruitment/addRecruitmentCase`,
        data: {
          name: this.params.values.name,
          processId: this.params.values.processId,
        },
      });
      if (res) {
        this.props.fetchListRC(true);
        this.props.onClose();
      }
    } catch (error) {}
  };

  render() {
    const { visible, customField, order, onClose } = this.props;
    return (
      <ModalCommon
        title={_l`Add recruitment case`}
        visible={visible}
        onDone={this.onSave}
        onClose={onClose}
        size="tiny"
        okLabel={_l`Save`}
        scrolling={false}
        description={false}
        // closeOnDimmerClick={false}
      >
        <AddRecruitmentForm
          formKey="__CREATE"
          overviewType={this.props.overviewType}
          errors={this.state.errors}
          setParams={(params) => (this.params = params)}
        />
      </ModalCommon>
    );
  }
}
const mapStateToProps = (state, { overviewType }) => {
  // const visible = isHighlightAction(state, overviewType, 'createRecruitment');
  const customField = getCustomFieldsObject(state);
  return {
    // visible,
    customField,
    userId: state.auth.userId,
  };
};

export default connect(mapStateToProps, {
  fetchListRC,
  clearHighlight,
  success,
})(AddRecruitmentModal);
