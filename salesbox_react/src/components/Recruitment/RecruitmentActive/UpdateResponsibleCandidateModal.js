import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import ModalCommon from '../../ModalCommon/ModalCommon';
import _l from 'lib/i18n';
import api from 'lib/apiClient';
import UserDropdown from '../../User/UserDropdown';
import { FormPair } from 'components';
import css from '../../Task/Delegation.css';
import { Form } from 'semantic-ui-react';
import { clearHighlight } from '../../Overview/overview.actions';
import { isHighlightAction, getHighlighted, getItemSelected } from '../../Overview/overview.selectors';
import { calculatingPositionMenuDropdown, Endpoints, OverviewTypes } from '../../../Constants';
import { getUser } from '../../Auth/auth.selector';
import { requestFetchContact } from '../../Contact/contact.actions';

export const UpdateResponsibleCandidateModal = ({
  visible,
  clearHighlight,
  overviewType,
  candidate,
  currentUser,
  requestFetchContact,
}) => {
  const [responsibles, setResponsibles] = useState([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (visible) {
      fetchListResponsible();
    }
  }, [visible]);

  const fetchListResponsible = async () => {
    try {
      const res = await api.get({
        resource: `${Endpoints.Recruitment}/candidate/${candidate.uuid}/listParticipant`,
      });
      if (res) {
        let a = res.userDTOList.map((e) => {
          return e.uuid;
        });
        setResponsibles(a);
      }
    } catch (error) {}
  };

  const onDone = async () => {
    if (responsibles.length === 0) {
      setError(true);
      return;
    }
    try {
      const res = await api.post({
        resource: `${Endpoints.Recruitment}/candidate/update`,
        data: {
          uuid: candidate.uuid,
          contactId: candidate.contactId,
          participantList: responsibles,
          userId: currentUser.uuid,
          close: overviewType === OverviewTypes.RecruitmentClosed
        },
      });
      if (res) {
        setResponsibles([]);
        requestFetchContact(candidate.contactId);
        clearHighlight(overviewType);
      }
    } catch (error) {}
  };
  const onClose = () => {
    setResponsibles([]);
    clearHighlight(overviewType);
  };
  const onChangeOwner = (e, { value }) => {
    console.log('Value:', value);
    setError(false);
    setResponsibles(value);
  };

  return (
    <ModalCommon title={_l`Update responsible`} size="small" visible={visible} onDone={onDone} onClose={onClose}>
      <Form className="position-unset">
        <FormPair required label={_l`Responsible`} labelStyle={css.delegateFormLabel} left>
          <UserDropdown
            id="updateResponsibleCandidate"
            className="position-clear"
            onClick={() => {
              calculatingPositionMenuDropdown('updateResponsibleCandidate');
            }}
            hasSearch
            multiple
            value={responsibles}
            onChange={onChangeOwner}
            error={error}
          />
          {error && <span className="form-errors">{_l`Responsible is required`}</span>}
        </FormPair>
      </Form>
    </ModalCommon>
  );
};

const mapStateToProps = (state, { overviewType }) => ({
  visible: isHighlightAction(state, overviewType, 'updateResponsibleCandiate'),
  candidate: getItemSelected(state, overviewType),
  currentUser: getUser(state),
});

const mapDispatchToProps = {
  clearHighlight,
  requestFetchContact,
};

export default connect(mapStateToProps, mapDispatchToProps)(UpdateResponsibleCandidateModal);
