import React from 'react';
import _l from 'lib/i18n';
import { connect } from 'react-redux';
import { clearHighlight } from 'components/Overview/overview.actions';
import { getItemSelected, isHighlightAction } from 'components/Overview/overview.selectors';
import { OverviewTypes, OverviewColors } from 'Constants';
// import { CampaignsForm } from './CampaignsForm';
import ModalCommon from '../../ModalCommon/ModalCommon';
import api from '../../../lib/apiClient';
import { success, error } from '../../Notification/notification.actions';
import { getCustomFieldsObject } from '../../CustomField/custom-field.selectors';
import { CandidateForm } from '../CandidateForm';
import { fetchRCActiveDataByCaseId, selectRecruitmentCase, fetchListRC } from '../recruitment.actions';
import * as OverviewActions from '../../Overview/overview.actions';
import { Endpoints } from '../../../Constants';
import { AddRecruitmentForm } from '../RecruitmentClosed/AddRecruitmentForm';
import * as NotificationActions from '../../Notification/notification.actions';
import { updateSelectedCaseInRecruitment } from '../../Settings/settings.actions';

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

class CopyRecuitmentCase extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      errors: {},
      responsibles: [],
    };
    this.params = {};
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.visible) {
      this.fetchListResponsible();
    }
    if (this.props.listRC !== nextProps.listRC) {
    }
  }
  hideEditForm = () => {
    const { overviewType } = this.props;
    this.props.clearHighlight(overviewType);
  };
  fetchListResponsible = async () => {
    const { candidate } = this.props;
    try {
      const res = await api.get({
        resource: `${Endpoints.Recruitment}/candidate/${candidate.uuid}/listParticipant`,
      });
      if (res) {
        let a = res.userDTOList.map((e) => {
          return e.uuid;
        });
        this.setState({ ...this.state, responsibles: a });
      }
    } catch (error) {}
  };

  onSave = async () => {
    const { listRC, currentRC } = this.props
    let RCcopy = listRC?.filter((e) => e.uuid == currentRC);
    let currentRCName = RCcopy[0]?.name;
    let currentRCProcess = RCcopy[0]?.processId;
    const { errors } = this.setState;
    if (!this.params.values.processId) {
      this.setState({
        errors: {
          ...errors,
          processId: _l`Process is required`,
        },
      });
      return;
    }
    if (!this.params.values.name) {
      this.setState({
        errors: {
          ...errors,
          name: _l`Name is required`,
        },
      });
      return;
    }
    if (this.params.values.name === currentRCName) {
      this.setState({
        errors: {
          ...errors,
          name: _l`Recruitment case name is existed`,
        },
      });
      return;
    }
    // if (this.params.values.processId === currentRCProcess) {
    //   this.setState({
    //     errors: {
    //       ...errors,
    //       name: _l`Recruitment case process is existed`,
    //     },
    //   });
    //   return;
    // }
    if(!errors) {
      try {
        const res = await api.post({
          resource: `${Endpoints.Recruitment}/recruitment/addRecruitmentCase`,
          data: {
            name: this.params.values.name,
            processId: this.params.values.processId,
          },
        });
        if (res) {
          this.props.notiSuccess('Added', null, 2000);
          this.props.updateSelectedCaseInRecruitment('candidateActive', res.uuid);
          this.props.fetchListRC(false);
          this.props.selectRecruitmentCase(res.uuid);
          this.hideEditForm();
        }
      } catch (error) {}
    }

  };

  render() {
    const { visible, customField, order, currentRC, listRC } = this.props;
    const { responsibles } = this.state;
    let RCcopy = listRC?.filter((e) => e.uuid == currentRC);
    let currentRCName = RCcopy?.[0]?.name;
    let currentRCProcess = RCcopy?.[0]?.processId;
    // console.log('2222', RCcopy[0], RCcopy[0].name, currentRCProcess)
    return (
      <ModalCommon
        title={_l`Copy`}
        visible={visible}
        onDone={this.onSave}
        onClose={this.hideEditForm}
        size="tiny"
        okLabel={_l`Save`}
        scrolling={false}
        description={false}
        // closeOnDimmerClick={false}
      >
        <AddRecruitmentForm
          hightlightAction="copy"
          formKey="__CREATE"
          currentRCName={currentRCName}
          currentRCProcess={currentRCProcess}
          overviewType={this.props.overviewType}
          errors={this.state.errors}
          setParams={(params) => (this.params = params)}
        />
      </ModalCommon>
    );
  }
}
const mapStateToProps = (state, { overviewType }) => {
  const visible = isHighlightAction(state, overviewType, 'copyRC');
  const candidate = getItemSelected(state, overviewType);
  const customField = getCustomFieldsObject(state);
  return {
    visible,
    candidate,
    customField,
    userId: state.auth.userId,
    listRC: state.entities?.recruitment?.__COMMON_DATA?.listRecruitmentCase,
    currentRC: state.entities?.recruitment?.__COMMON_DATA?.currentRecruitmentCase,
    __CREATE: state.entities.recruitment?.__CREATE,
  };
};

export default connect(mapStateToProps, {
  clearHighlight,
  success,
  notiSuccess: NotificationActions.success,
  error,
  fetchRCActiveDataByCaseId,
  updateSelectedCaseInRecruitment,
  fetchListRC,
  selectRecruitmentCase,
})(CopyRecuitmentCase);
