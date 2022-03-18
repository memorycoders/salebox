import React, { Component } from 'react';
import { connect } from 'react-redux';
import ModalCommon from '../../ModalCommon/ModalCommon';
import _l from 'lib/i18n';
import api from 'lib/apiClient';
import { clearHighlight } from '../../Overview/overview.actions';
import { isHighlightAction } from '../../Overview/overview.selectors';
import { Endpoints } from '../../../Constants';
import * as NotificationACtions from '../../Notification/notification.actions';
import { fetchListRC, selectRecruitmentCase } from '../recruitment.actions';
import { updateSelectedCaseInRecruitment, requestUpdateDisplaySetting } from '../../Settings/settings.actions';

export const CloseRecruitmentCaseModal = ({
  visible,
  clearHighlight,
  overviewType,
  currentRecruitmentCase,
  notiSuccess,
  fetchListRC,
  selectRecruitmentCase,
  updateSelectedCaseInRecruitment,
  requestUpdateDisplaySetting,
}) => {
  const onDone = async () => {
    try {
      if (currentRecruitmentCase) {
        const res = await api.post({
          resource: `${Endpoints.Recruitment}/recruitment/updateRecruitmentCase/${currentRecruitmentCase}`,
          data: {
            close: true,
          },
        });
        if (res) {
          updateSelectedCaseInRecruitment('candidateActive', null);
          notiSuccess('Success', null, 2000);
          clearHighlight(overviewType);
          selectRecruitmentCase(null);
          fetchListRC(false);
          requestUpdateDisplaySetting();
        }
      }
    } catch (error) {}
  };
  const onClose = () => {
    clearHighlight(overviewType);
  };

  return (
    <ModalCommon
      title={_l`Confirm`}
      cancelLabel={_l`No`}
      okLabel={_l`Yes`}
      visible={visible}
      onClose={onClose}
      onDone={onDone}
      size="tiny"
    >
      <p>{_l`Do you want to close this recruitment case?`}</p>
    </ModalCommon>
  );
};

const mapStateToProps = (state, { overviewType }) => ({
  visible: isHighlightAction(state, overviewType, 'confirmCloseRecruitmentCase'),
  currentRecruitmentCase: state.entities?.recruitment?.__COMMON_DATA?.currentRecruitmentCase,
});

const mapDispatchToProps = {
  clearHighlight,
  notiSuccess: NotificationACtions.success,
  fetchListRC,
  selectRecruitmentCase,
  updateSelectedCaseInRecruitment,
  requestUpdateDisplaySetting,
};

export default connect(mapStateToProps, mapDispatchToProps)(CloseRecruitmentCaseModal);
