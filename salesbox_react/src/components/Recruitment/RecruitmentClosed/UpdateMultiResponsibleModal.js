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
import { calculatingPositionMenuDropdown, Endpoints } from '../../../Constants';
import { getUser } from '../../Auth/auth.selector';
import { requestFetchContact } from '../../Contact/contact.actions';
import { changeOnMultiMenu } from '../recruitment.actions';

export const UpdateMultiResponsibleModal = ({
  visible,
  clearHighlight,
  overviewType,
  candidate,
  currentUser,
  requestFetchContact,
  changeOnMultiMenu,
}) => {
  const [responsibles, setResponsibles] = useState([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    console.log('------------NHan visisble', visible);
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

  const onDone = () => {
    if (responsibles.length === 0) {
      setError(true);
      return;
    }
    changeOnMultiMenu('change_responsible_multi', responsibles, overviewType);
    setResponsibles([]);
    setError(false);
    clearHighlight(overviewType);
  };
  const onClose = () => {
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
  visible: isHighlightAction(state, overviewType, 'updateResponsibleClose'),
  candidate: getItemSelected(state, overviewType),
  currentUser: getUser(state),
});

const mapDispatchToProps = {
  clearHighlight,
  requestFetchContact,
  changeOnMultiMenu,
};

export default connect(mapStateToProps, mapDispatchToProps)(UpdateMultiResponsibleModal);
