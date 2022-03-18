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
// import { makeGetTask } from '../task.selector';
import ModalCommon from '../../ModalCommon/ModalCommon';
import css from '../../Task/Delegation.css';
import { getAuth } from '../../Auth/auth.selector';
import UserDropdown from '../../../components/User/UserDropdown';
import { changeOnMultiMenu } from '../unqualifiedDeal.actions';
import { calculatingPositionMenuDropdown } from '../../../Constants';
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
const ChangeReponsibleModal = ({ visible, hideAssignForm, onSave, setOwner, owner }: PropsT) => {
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
            id="userDropdownChangeResponsibleUnqualified"
            onClick={() => {
              calculatingPositionMenuDropdown('userDropdownChangeResponsibleUnqualified');
            }}
            className="position-clear"
            hasSearch
            value={owner}
            onChange={setOwner}
          />
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
    changeOnMultiMenu: changeOnMultiMenu,
  }),
  withState('owner', 'setOwner', null),
  withHandlers({
    hideAssignForm: ({ clearHighlightAction, overviewType, setOwner }) => () => {
      setOwner(null);
      clearHighlightAction(overviewType);
    },
    setOwner: ({ setOwner }) => (event, { value: owner }) => {
      setOwner(owner);
    },
    onSave: ({ changeOnMultiMenu, owner, setOwner }) => () => {
      if (owner) {
        changeOnMultiMenu('change_reponsible', owner);
        setOwner(null);
      }
    },
  })
)(ChangeReponsibleModal);
