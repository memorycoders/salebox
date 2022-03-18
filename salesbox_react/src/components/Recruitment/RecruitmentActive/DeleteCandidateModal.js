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
import { deleteCandidateLocal } from '../recruitment.actions';
import { OverviewTypes } from '../../../Constants';

export const DeleteCandidateModal = ({
  visible,
  overviewType,
  clearHighlight,
  candidateId,
  notiError,
  notiSuccess,
  deleteCandidateLocal,
  deleteCandidateClosedSuccess,
  deleteRowSuccessForRecruitment,
}) => {
  const onDone = async () => {
    // notiSuccess('Success', null, 2000);
    // deleteCandidateLocal(candidateId);
    // clearHighlight(overviewType);

    try {
      const res = await api.get({
        resource: `${Endpoints.Recruitment}/candidate/delete/${candidateId}`,
        query: {
          close: overviewType === OverviewTypes.RecruitmentClosed,
        },
      });
      if (res) {
        notiSuccess('Success', null, 2000);
        clearHighlight(overviewType);
        deleteRowSuccessForRecruitment(overviewType);
        if (overviewType === OverviewTypes.RecruitmentClosed) {
          deleteCandidateClosedSuccess(candidateId);
        } else {
          deleteCandidateLocal(candidateId);
        }
      }
    } catch (error) {}
  };
  const onClose = () => {
    clearHighlight(overviewType);
  };
  return (
    <ModalCommon visible={visible} title={_l`Confirm`} onDone={onDone} onClose={onClose} size="tiny">
      <p>{_l`Do you really want to delete this candidate?`}</p>
    </ModalCommon>
  );
};

const mapStateToProps = (state, { overviewType }) => ({
  visible: isHighlightAction(state, overviewType, 'deleteCandidate'),
  candidateId: getHighlighted(state, overviewType),
});

const mapDispatchToProps = {
  clearHighlight,
  notiError: NotificationActions.error,
  notiSuccess: NotificationActions.success,
  deleteCandidateLocal,
  deleteRowSuccessForRecruitment,
  deleteCandidateClosedSuccess,
};

export default connect(mapStateToProps, mapDispatchToProps)(DeleteCandidateModal);
