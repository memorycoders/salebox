//@flow
import * as React from 'react';
import _l from 'lib/i18n';
import { compose, withHandlers, withState } from 'recompose';
import { connect } from 'react-redux';
import * as OverviewActions from 'components/Overview/overview.actions';
import { isHighlightAction } from 'components/Overview/overview.selectors';
import CreateCallListForm from 'components/CallList/CreateCallListForm';
import { addEditAccountCallList } from '../CallListAccount/callListAccount.actions';
import { OverviewTypes } from 'Constants';
import ModalCommon from '../ModalCommon/ModalCommon';
import { CALL_LIST_TYPE, FORM_ACTION, FORM_KEY } from '../../Constants';
import { addEditContactCallList } from '../CallListContact/callListContact.actions';
import { getHighlighted } from '../Overview/overview.selectors';
import * as CallListContactActions from "../CallListContact/callListContact.actions";
import * as CallListAccountActions from "../CallListAccount/callListAccount.actions";

type PropsT = {
  visible: boolean,
  hideEditForm: () => void,
  onSave?: () => void,
  form: {},
  onClose: () => void,
  accountForm: Object,
  contactForm: Object,
  __error: Object,
  userId: String,
  isCreate: Boolean,
  editType: String,
};

addTranslations({
  'en-US': {
    Cancel: 'Cancel',
    Save: 'Save',
    'Add call list': 'Add call list',
    'Edit call list': 'Edit call list',
    'Name is required': 'Name is required',
  },
});
let overviewType = OverviewTypes.CallList.List;

const CreateContactModal = ({
  setError,
  visible,
  hideEditForm,
  onSave,
  setCallListType,
  callListType,
  accountForm,
  contactForm,
  __error,
  userId,
  isCreate,
  editType,
  __formKey,
  callListAccountId,
}: PropsT) => {
  return (
    <ModalCommon
      title={isCreate ? _l`Add call list` : _l`Update call list`}
      visible={visible}
      onDone={onSave}
      onClose={hideEditForm}
      okLabel={_l`save`}
      scrolling={true}
      size="small"
    >
      <CreateCallListForm
        visible={visible}
        setCallListType={setCallListType}
        callListType={callListType}
        contactForm={contactForm}
        accountForm={accountForm}
        userId={userId}
        __error={__error}
        formKey={__formKey}
        setError={setError}
        isCreate={isCreate}
        editType={editType}
        callListAccountId={callListAccountId}
      />
    </ModalCommon>
  );
};

const mapStateToProps = (state,{setCallListType}) => {
  let visible, isCreate, editType, __formKey;
  switch (true) {
    case isHighlightAction(state, OverviewTypes.CallList.List, FORM_ACTION.CREATE):
      visible = true;
      isCreate = true;
      overviewType = OverviewTypes.CallList.List;
      __formKey = FORM_KEY.CREATE;
      break;
    case isHighlightAction(state, OverviewTypes.CallList.Account, FORM_ACTION.CREATE):
      visible = true;
      isCreate = true;
      // editType = CALL_LIST_TYPE.ACCOUNT;
      overviewType = OverviewTypes.CallList.Account;
      __formKey = FORM_KEY.CREATE;
      setCallListType(CALL_LIST_TYPE.ACCOUNT);

      break;
    case isHighlightAction(state, OverviewTypes.CallList.Contact, FORM_ACTION.CREATE):
      visible = true;
      isCreate = true;
      // editType = CALL_LIST_TYPE.CONTACT;
      setCallListType(CALL_LIST_TYPE.CONTACT);

      overviewType = OverviewTypes.CallList.Contact;
      __formKey = FORM_KEY.CREATE;

      break;
    case isHighlightAction(state, OverviewTypes.CallList.Account, FORM_ACTION.EDIT):
      visible = true;
      isCreate = false;
      editType = CALL_LIST_TYPE.ACCOUNT;
      overviewType = OverviewTypes.CallList.Account;
      __formKey = FORM_KEY.EDIT;

      break;
    case isHighlightAction(state, OverviewTypes.CallList.Contact, FORM_ACTION.EDIT):
      visible = true;
      isCreate = false;
      editType = CALL_LIST_TYPE.CONTACT;
      overviewType = OverviewTypes.CallList.Contact;
      __formKey = FORM_KEY.EDIT;

      break;
  }

  return {
    visible,
    isCreate,
    editType,
    __formKey,
    contactForm: state.entities.callListContact[__formKey] || {},
    accountForm: state.entities.callListAccount[__formKey] || {},
    userId: state.auth && state.auth.userId ? state.auth.userId : '',
    callListAccountId: getHighlighted(state, OverviewTypes.CallList.List),
  };
};

const mapDispatchToProps = {
  clearHighlight: OverviewActions.clearHighlight,
  addEditAccountCallList: addEditAccountCallList,
  addEditContactCallList: addEditContactCallList,
  clearCreateEntityContact: CallListContactActions.clearCreateEntity,
  clearCreateEntityAccount: CallListAccountActions.clearCreateEntity
};
const save = (
  _type,
  contactForm,
  accountForm,
  __error,
  setError,
  addEditContactCallList,
  addEditAccountCallList,
  isCreate
) => {
  if (_type === CALL_LIST_TYPE.CONTACT) {
    if (!contactForm.name || contactForm.name.length === 0) {
      setError({ ...__error, status: true });
      return;
    }
    addEditContactCallList(isCreate);
  } else {
    if (!accountForm.name || accountForm.name.length === 0) {
      setError({ ...__error, status: true });
      return;
    }
    addEditAccountCallList(isCreate);
  }
};
export default compose(
  withState('callListType', 'setCallListType', CALL_LIST_TYPE.CONTACT),
  connect(mapStateToProps, mapDispatchToProps),
  withState('__error', 'setError', { status: false, title: _l`Name is required` }),
  withHandlers({
    hideEditForm: ({ clearHighlight, setCallListType, callListAccountId,
                     clearCreateEntityContact,clearCreateEntityAccount,userId }) => () => {
      if (callListAccountId) {
        clearHighlight(overviewType, callListAccountId);
      } else {
        clearHighlight(overviewType);
      }
      setCallListType(CALL_LIST_TYPE.CONTACT);
      clearCreateEntityContact(userId)
      clearCreateEntityAccount(userId)
    },
    onSave: ({
      callListType,
      addEditAccountCallList,
      addEditContactCallList,
      setError,
      __error,
      contactForm,
      accountForm,
      isCreate,
      editType,
      setCallListType,
    }) => () => {
      setError({ ...__error, status: false });
      let _type = isCreate ? callListType : editType;
      save(
        _type,
        contactForm,
        accountForm,
        __error,
        setError,
        addEditContactCallList,
        addEditAccountCallList,
        isCreate
      );
      setCallListType(CALL_LIST_TYPE.CONTACT);
    },
  })
)(CreateContactModal);
