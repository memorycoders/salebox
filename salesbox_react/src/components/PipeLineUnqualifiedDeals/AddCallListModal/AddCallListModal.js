/* eslint-disable react/prop-types */
import React from 'react';
import _l from 'lib/i18n';
import { connect } from 'react-redux';
import api from 'lib/apiClient';
import { clearHighlight } from 'components/Overview/overview.actions';
import { isHighlightAction } from 'components/Overview/overview.selectors';
import { OverviewTypes } from 'Constants';
import AddCallList from './AddCallList';
import { Form } from 'semantic-ui-react';
import ModalCommon from '../../ModalCommon/ModalCommon';
import { changeOnMultiMenu } from '../unqualifiedDeal.actions';
import * as QualifiedActions from '../../PipeLineQualifiedDeals/qualifiedDeal.actions';
import * as OrganisationActions from '../../Organisation/organisation.actions';
import * as ContactActions from '../../Contact/contact.actions';
import css from 'Common.css';
import cssForm from '../../Task/TaskForm/TaskForm.css';
import cx from 'classnames';
import localCss from './AddCallList.css';
import { select } from 'redux-saga/effects';
import { makeGetOrganisation } from '../../Organisation/organisation.selector';
import { getHighlighted } from '../../Overview/overview.selectors';
import { makeGetContact } from '../../Contact/contact.selector';
import { updateCallListDropdown } from '../../CallList/callList.actions';
import * as OverviewActions from 'components/Overview/overview.actions';
import * as CallListContactAction from "../../CallListContact/callListContact.actions";
import * as CallListAccountAction from "../../CallListAccount/callListAccount.actions";
import {changeOnMultiMenu as changeOnMultiMenuRecruitment} from '../../Recruitment/recruitment.actions';

addTranslations({
  'en-US': {
    List: 'List',
    Cancel: 'Cancel',
    Save: 'Save',
    'Add call list': 'Add call list',
    'List is required': 'List is required',
  },
});

class AddToCallListModal extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      accounts: [],
      contacts: [],
      selected: null,
      error: null,
      isAddAccountContact: false,

    };
  }

  componentDidMount() {

  }

  componentWillReceiveProps(nextProps){
    const { visible } = this.props;
    if((visible !== nextProps.visible
      || (this.state.isAddAccountContact && nextProps.visibleAddAccountContact != true)
    ) && nextProps.visible){
      this.setState({isAddAccountContact: false});

      this.fetchAccount();
      this.fetchContact();
    }
    //focus after add

    if (nextProps.visible && nextProps.selectedNew.value != null && this.props.selectedNew.value != nextProps.selectedNew.value) {
      this.setState({selected: nextProps.selectedNew});
      this.props.clearStoreNewValueContact();
      this.props.clearStoreNewValueAccount();
    }

    if(nextProps.visible != this.props.visible && nextProps.visible) {
      this.setState({
        selected: null,
        error: null,
      });
    }
  }

  fetchAccount = async (searchText = null) => {

    const { updateCallListDropdown, callListAccount } = this.props;

/*
    if (callListAccount && callListAccount.pageIndex >= 0){
      return this.setState({ accounts: callListAccount.list });
    }
*/

    try {
      const data = await api.post({
        resource: `call-lists-v3.0/callListAccount/list`,
        query: {
          pageSize: 20,
          pageIndex: 0,
        },
        data: {
          orderBeans: [{ order: 'desc' }, { orderBy: 'name', order: 'desc' }],
          showHistory: false,
          unitIds: [],
          userIds: [this.props.userId],
          searchText: searchText,
        },
      });
      this.setState({ accounts: data.beans });
      updateCallListDropdown('ACCOUNT', data.beans, 0)
    } catch (e) {
      console.log(e);
    }
  };

  fetchContact = async (searchText = null) => {

    const { updateCallListDropdown, callListContact } = this.props;

/*
    if (callListContact && callListContact.pageIndex >= 0) {
      return this.setState({ contacts: callListContact.list });
    }
*/
    try {
      const data = await api.post({
        resource: `call-lists-v3.0/callListContact/list`,
        query: {
          pageSize: 990,
          pageIndex: 0,
        },
        data: {
          orderBeans: [{ order: 'desc' }, { orderBy: 'name', order: 'desc' }],
          showHistory: false,
          roleFilterType: 'Person',
          roleFilterValue: this.props.userId,
          searchText: searchText,
        },
      });
      updateCallListDropdown('CONTACT', data.beans, 0)
      this.setState({ contacts: data.beans });
    } catch (e) {
      console.log(e);
    }
  };

  hide = () => {
    const { overviewType } = this.props;
    this.setState({
      selected: null,
      error: null,
    });
    this.props.clearHighlight(overviewType);
  };

  _onChange = (data) => {
    this.setState({ selected: data, error: null });
  };

  onSearchChange = (e) => {
    this.fetchAccount(e.target.value);
    this.fetchContact(e.target.value);
  };

  onSave = () => {
    const { overviewType, organisation, contact, objectId } = this.props;
    const { selected } = this.state;
    if (selected) {
      const { value, type } = selected;
      const field = { callListType: type };
      if (type === 'contact') field.callListContactId = value;
      if (type === 'account') field.callListAccountId = value;
      if (overviewType === OverviewTypes.Pipeline.Qualified || overviewType === OverviewTypes.Pipeline.Order) {
        this.props.changeOnMultiMenuQualified('add_to_call_list', field, overviewType);
      } else if (overviewType === OverviewTypes.Pipeline.Lead) {
        this.props.changeOnMultiMenuUnqualified('add_to_call_list', field, overviewType);
      } else if (overviewType === OverviewTypes.Account) {
        if (organisation.uuid) {
          this.props.addAccountToCalllist(overviewType, field.callListAccountId, [organisation.uuid]);
        } else {
          this.props.changeOnMultiMenuOrganisation('add_to_call_list', field, overviewType);
        }
      } else if (overviewType === OverviewTypes.CallList.SubAccount) {
        this.props.addAccountToCalllist(overviewType, field.callListAccountId, [objectId]);
      } else if (
        overviewType === OverviewTypes.Contact ||
        overviewType === OverviewTypes.CallList.SubContact ||
        overviewType === OverviewTypes.Account_Contact ||
        overviewType === OverviewTypes.Contact_Contact
      ) {
        if (contact.uuid) {
          this.props.addContactToCalllist(overviewType, field.callListContactId, [contact.uuid]);
        } else {
          this.props.changeOnMultiMenuContact('add_to_call_list', field, overviewType);
        }
      } else if(overviewType === OverviewTypes.RecruitmentClosed) {
        this.props.changeOnMultiMenuRecruitment('add_to_call_list', field, overviewType);
      }

      // this.setState({
      //   selected: null,
      //   error: null,
      // });
    } else {
      this.setState({ error: _l`List is required` });
    }
  };
  _addCompanyCallList = (e) => {
    console.log("_addCompanyCallList");
    this.props.setActionForHighlight(OverviewTypes.CallList.Account, 'create');
    setTimeout((self)=>{
      this.setState({isAddAccountContact:true});
    },100)

    // e.stopPropagation()
  };
  _addContactCallList = (e) => {
    console.log("_addContactCallList");
    this.props.setActionForHighlight(OverviewTypes.CallList.Contact, 'create');
    setTimeout((self)=>{
      this.setState({isAddAccountContact:true});
    },100)

    // e.stopPropagation()
  };

  render() {
    const { visible, overviewType } = this.props;
    const { onSave, hide } = this;
    const { accounts, contacts, selected, error } = this.state;
    return (
      <ModalCommon
        title={_l`Add call list`}
        visible={visible}
        cancelLabel={_l`Cancel`}
        okLabel={_l`Save`}
        onDone={onSave}
        onClose={hide}
        size="small"
        scrolling={false}
        description={false}
      >
        <Form className={cx(css.padded, localCss.Form)}>
          <Form.Group className={cx(cssForm.formField, localCss.field)}>
            <div className={cx(cssForm.label, localCss.label)} width={6}>
              {_l`List`}
              <span className={cssForm.required}>*</span>
            </div>
            <div className={cssForm.dropdownWrapper}>
              <AddCallList
                overviewType={overviewType}
                accounts={(overviewType === OverviewTypes.Contact_Contact || overviewType === OverviewTypes.CallList.SubContact || overviewType === OverviewTypes.RecruitmentClosed) ? null : accounts}
                contacts={
                  (overviewType === OverviewTypes.Account || overviewType === OverviewTypes.CallList.SubAccount)
                    ? null
                    : contacts
                }
                onChange={this._onChange}
                onSearchChange={this.onSearchChange}
                value={selected}
                error={error}
                addCompanyCallList={this._addCompanyCallList}
                addContactCallList={this._addContactCallList}
              />
              <span className="form-errors">{error && error}</span>
            </div>
          </Form.Group>
        </Form>
      </ModalCommon>
    );
  }
}
const makeMapStateToProps = () => {
  const getOrganisation = makeGetOrganisation();
  const getContact = makeGetContact();
  const mapStateToProps = (state, { overviewType }) => {
    const visible = isHighlightAction(state, overviewType, 'add_to_call_list');
    const highlightedId = getHighlighted(state, overviewType);
    const contact = getContact(state, highlightedId);
    const callList = state.entities.callList;
    const callListAccount = callList.__CALL_LIST_ACCOUNT_DROPDOWN;
    const callListContact = callList.__CALL_LIST_CONTACT_DROPDOWN;
    const visibleAddAccountContact = isHighlightAction(state, OverviewTypes.CallList.Account, 'create') ||  isHighlightAction(state, OverviewTypes.CallList.Contact, 'create');
    const callListAccountNew = state.entities.callListAccount.newValue;
    const callListContactNew = state.entities.callListContact.newValue;
    const selectedNew = (callListAccountNew || callListContactNew) || {};
    return {
      visible,
      userId: state.auth.userId,
      organisation: getOrganisation(state, highlightedId),
      contact: {...contact, uuid: highlightedId !== null && highlightedId !== "null" ? highlightedId : null},
      objectId: highlightedId,
      callListAccount,
      callListContact,
      visibleAddAccountContact,
      selectedNew
    };
  };
  return mapStateToProps;
};

export default connect(makeMapStateToProps, {
  addAccountToCalllist: OrganisationActions.addAccountToCalllist,
  addContactToCalllist: ContactActions.addContactToCalllist,
  clearHighlight,
  changeOnMultiMenuUnqualified: changeOnMultiMenu,
  changeOnMultiMenuQualified: QualifiedActions.changeOnMultiMenu,
  changeOnMultiMenuOrganisation: OrganisationActions.changeOnMultiMenu,
  changeOnMultiMenuContact: ContactActions.changeOnMultiMenu,
  updateCallListDropdown,
  setActionForHighlight: OverviewActions.setActionForHighlight,
  clearStoreNewValueContact: CallListContactAction.clearStoreNewValue,
  clearStoreNewValueAccount: CallListAccountAction.clearStoreNewValue,
  changeOnMultiMenuRecruitment

})(AddToCallListModal);
