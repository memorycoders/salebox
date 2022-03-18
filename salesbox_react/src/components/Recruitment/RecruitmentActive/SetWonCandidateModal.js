import React, { Component } from 'react';
import { connect } from 'react-redux';
import ModalCommon from '../../ModalCommon/ModalCommon';
import _l from 'lib/i18n';
import { isHighlightAction, getHighlighted } from '../../Overview/overview.selectors';
import { clearHighlight, highlight, deleteRowSuccessForRecruitment } from '../../Overview/overview.actions';
import api from 'lib/apiClient';
import { Endpoints } from '../../../Constants';
import { deleteCandidateLocal } from '../recruitment.actions';
import * as NotificationActions from '../../Notification/notification.actions';

export const SetWonCandidateModal = ({
  visible,
  overviewType,
  clearHighlight,
  candidateId,
  deleteCandidateLocal,
  highlight,
  deleteRowSuccessForRecruitment,
  notiSuccess
}) => {
  const onDone = async () => {
    try {
      const res = await api.post({
        resource: `${Endpoints.Recruitment}/candidate/updateStatus`,
        data: {
          uuid: candidateId,
          won: true,
        },
      });
      if (res) {
        notiSuccess('Success', null, 2000);
        deleteCandidateLocal(candidateId);
        clearHighlight(overviewType);
        highlight(overviewType, candidateId, 'confirmCloseRecruitmentCase');
        deleteRowSuccessForRecruitment(overviewType);

      }
    } catch (error) {}
  };
  const onClose = () => {
    clearHighlight(overviewType);
  };
  return (
    <ModalCommon
      title={_l`Confirm`}
      visible={visible}
      onClose={onClose}
      onDone={onDone}
      cancelLabel={_l`No`}
      okLabel={_l`Yes`}
      size="tiny"
    >
      <p>{_l`Do you really want to set this candidate as yes?`}</p>
    </ModalCommon>
  );
};

const mapStateToProps = (state, { overviewType }) => {
  const visible = isHighlightAction(state, overviewType, 'setWonCandidate');
  const candidateId = getHighlighted(state, overviewType);
  return {
    visible,
    candidateId,
  };
};

const mapDispatchToProps = {
  clearHighlight,
  deleteCandidateLocal,
  highlight,
  deleteRowSuccessForRecruitment,
  notiSuccess: NotificationActions.success
};

export default connect(mapStateToProps, mapDispatchToProps)(SetWonCandidateModal);
