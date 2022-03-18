import React, { Component } from 'react';
import { connect } from 'react-redux';
import ModalCommon from '../../ModalCommon/ModalCommon';
import _l from 'lib/i18n';
import api from 'lib/apiClient';
import {
  clearHighlight,
  deleteRowSuccessForRecruitment,
  deleteCandidateClosedSuccess,
} from '../../Overview/overview.actions';
import { getHighlighted, isHighlightAction } from '../../Overview/overview.selectors';
import { Endpoints } from '../../../Constants';
import * as NotificationActions from '../../Notification/notification.actions';
import { deleteCandidateLocal, fetchListRC, selectRecruitmentCase } from '../recruitment.actions';
import { OverviewTypes } from '../../../Constants';
import { updateSelectedCaseInRecruitment } from '../../Settings/settings.actions';
export const DeleteRecruitmentCase = ({
  visible,
  overviewType,
  clearHighlight,
  currentRC,
  notiSuccess,
  fetchListRC,
  selectRecruitmentCase,
  updateSelectedCaseInRecruitment,
}) => {
  const onDone = async () => {
    try {
      const res = await api.get({
        resource: `${Endpoints.Recruitment}/recruitment/delete/${currentRC}`,
        // query: {
        //   close: overviewType === OverviewTypes.RecruitmentClosed,
        // },
      });
      if (res) {
        notiSuccess('Success', null, 2000);
        clearHighlight(overviewType);
        updateSelectedCaseInRecruitment('candidateActive', null);
        selectRecruitmentCase(null);
        fetchListRC(false);
      }
    } catch (error) {
      console.log('You have error when delete RC', error)
    }
  };
  const onClose = () => {
    clearHighlight(overviewType);
  };
  return (
    <ModalCommon visible={visible} title={_l`Confirm`} onDone={onDone} onClose={onClose} size="tiny">
      <p>{_l`Do you really want to delete this recruitment case?`}</p>
    </ModalCommon>
  );
};

const mapStateToProps = (state, { overviewType }) => ({
  visible: isHighlightAction(state, overviewType, 'deleteRC'),
  candidateId: getHighlighted(state, overviewType),
  currentRC: state.entities?.recruitment?.__COMMON_DATA?.currentRecruitmentCase,
});

const mapDispatchToProps = {
  clearHighlight,
  notiError: NotificationActions.error,
  notiSuccess: NotificationActions.success,
  deleteCandidateLocal,
  selectRecruitmentCase,
  fetchListRC,
  updateSelectedCaseInRecruitment,
  deleteRowSuccessForRecruitment,
  deleteCandidateClosedSuccess,
};

export default connect(mapStateToProps, mapDispatchToProps)(DeleteRecruitmentCase);
