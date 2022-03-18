//@flow
import * as React from 'react';
import { Transition, Modal, Button, Form } from 'semantic-ui-react';
import _l from 'lib/i18n';
import { compose, withHandlers, withState } from 'recompose';
import { connect } from 'react-redux';
import * as TaskActions from 'components/Task/task.actions';
import * as OverviewActions from 'components/Overview/overview.actions';
import { isHighlightAction, getHighlighted } from 'components/Overview/overview.selectors';
import TagDropdown from 'components/Tag/TagDropdown';
import type { EventHandlerType } from 'types/semantic-ui.types';
import { FormPair } from 'components';
import { makeGetTask } from '../task.selector';
import ModalCommon from '../../ModalCommon/ModalCommon';
import css from '../Delegation.css';
import { getAuth } from '../../Auth/auth.selector';
import UserDropdown from '../../../components/User/UserDropdown';
import { changeOnMutilTaskMenu } from '../task.actions';
import { calculatingPositionMenuDropdown, OverviewTypes } from '../../../Constants';
import * as ApppointmentActions from '../../../components/Appointment/appointment.actions';
type PropsT = {
  task: {},
  visible: boolean,
  hideAssignForm: () => void,
  onSave?: () => void,
  handleTagChange: EventHandlerType,
};

addTranslations({
  'en-US': {
    Cancel: 'Cancel',
    Save: 'Save',
    Responsible: 'Responsible',
  },
});
let tagID = '';
const ChangeReponsibleModal = ({ visible, hideAssignForm, onSave, setOwner, owner, error }: PropsT) => {
  return (
    <ModalCommon
      title={_l`Select responsible`}
      visible={visible}
      cancelLabel={_l`Cancel`}
      okLabel={_l`Save`}
      onDone={onSave}
      onClose={hideAssignForm}
      size="small"
      className={css.mutilActionModal}
      scrolling={false}
    >
      <Form className="position-unset">
        <FormPair required label={_l`Responsible`} labelStyle={css.delegateFormLabel} left>
          <UserDropdown
            id="userDropdownChangeResponsibleTask"
            onClick={() => {
              calculatingPositionMenuDropdown('userDropdownChangeResponsibleTask');
            }}
            className="position-clear"
            hasSearch
            value={owner}
            onChange={setOwner}
            error={error}
          />
          {error && <span className="form-errors">{_l`Responsible is required`}</span>}
        </FormPair>
      </Form>
    </ModalCommon>
  );
};

const makeMapStateToProps = () => {
  const mapStateToProps = (state, { overviewType }) => {
    const visible = isHighlightAction(state, overviewType, 'change_reponsible');
    return {
      visible,
    };
  };
  return mapStateToProps;
};

export default compose(
  connect(makeMapStateToProps, {
    clearHighlightAction: OverviewActions.clearHighlightAction,
    changeOnMutilTaskMenu: changeOnMutilTaskMenu,
    changeOnMultiAppointmentMenu: ApppointmentActions.changeOnMultiMenu,
  }),
  withState('owner', 'setOwner', null),
  withState('error', 'setError', false),
  withHandlers({
    hideAssignForm: ({ clearHighlightAction, overviewType, setOwner, setError }) => () => {
      setOwner(null);
      setError(false);
      clearHighlightAction(overviewType);
    },
    setOwner: ({ setOwner, setError }) => (event, { value: owner }) => {
      setOwner(owner);
      setError(false);
    },
    onSave: ({
      changeOnMutilTaskMenu,
      owner,
      setOwner,
      overviewType,
      changeOnMultiAppointmentMenu,
      setError,
    }) => () => {
      if (owner) {
        if (overviewType === OverviewTypes.Activity.Task) {
          changeOnMutilTaskMenu('change_reponsible', owner, overviewType);
          setOwner(null);
          setError(false);
        } else if (overviewType === OverviewTypes.Activity.Appointment) {
          changeOnMultiAppointmentMenu('change_reponsible', owner, overviewType);
          setOwner(null);
          setError(false);
        }
      } else {
        setError(true);
      }
    },
  })
)(ChangeReponsibleModal);
