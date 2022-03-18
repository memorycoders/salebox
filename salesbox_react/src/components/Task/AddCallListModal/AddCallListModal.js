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
import { changeOnMutilTaskMenu } from '../task.actions';
import * as AppointmentActions from '../../Appointment/appointment.actions';
import css from 'Common.css';
import cssForm from '../TaskForm/TaskForm.css';
import cx from 'classnames';
import localCss from './AddCallList.css';
import { updateCallListDropdown } from '../../CallList/callList.actions';

import * as OverviewActions from 'components/Overview/overview.actions';
import * as CallListContactAction from '../../CallListContact/callListContact.actions';
import * as CallListAccountAction from '../../CallListAccount/callListAccount.actions';

addTranslations({
  'en-US': {
    List: 'List',
    Cancel: 'Cancel',
    Save: 'Save',
    'Add call list': 'Add call list',
    'List is required': 'List is required',
  },
});

// const overviewType = OverviewTypes.Activity.Task;

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
    // this.fetchAccount();
    // this.fetchContact();
  }

  componentWillReceiveProps(nextProps) {
    const { visible } = this.props;

    if ((visible !== nextProps.visible
    || (this.state.isAddAccountContact && nextProps.visibleAddAccountContact != true)
    ) && nextProps.visible) {

      this.setState({ isAddAccountContact: false, selected: null, error: null });
      this.fetchAccount();
      this.fetchContact();
    }
    //focus after add

    if (nextProps.visible && nextProps.selectedNew.value != null && this.props.selectedNew.value != nextProps.selectedNew.value) {
      this.setState({selected: nextProps.selectedNew});
      this.props.clearStoreNewValueContact();
      this.props.clearStoreNewValueAccount();
    }
  }

  fetchAccount = async (searchText = null) => {

    const { updateCallListDropdown, callListAccount } = this.props;
/*
    if (callListAccount && callListAccount.pageIndex >= 0) {
      return this.setState({ accounts: callListAccount.list });
    }
*/

    try {
      const data = await api.post({
        resource: `call-lists-v3.0/callListAccount/list`,
        data: {
          orderBeans: [{ order: 'desc' }, { orderBy: 'name', order: 'desc' }],
          showHistory: false,
          unitIds: [],
          pageIndex: 0,
          pageSize: 10000,
          userIds: [this.props.userId],
          searchText: searchText,
        },
      });
      updateCallListDropdown('ACCOUNT', data.beans, 0)
      this.setState({ accounts: data.beans });
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
    this.setState({
      selected: null,
      error: null,
    });
    const { overviewType } = this.props;
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
    const { selected } = this.state;
    const { overviewType } = this.props;
    if (selected) {
      const { value, type } = selected;
      const field = { callListType: type };
      if (type === 'contact') field.callListContactId = value;
      if (type === 'account') field.callListAccountId = value;
      if (overviewType === OverviewTypes.Activity.Task) {
        this.props.changeOnMutilTaskMenu('add_to_call_list', field, overviewType);
      } else if (overviewType === OverviewTypes.Activity.Appointment) {
                                                                        this.props.changeOnMultiAppointmentMenu(
                                                                             'add_to_call_list',
                                                                             field,
                                                                             overviewType
                                                                           );
                                                                      }
    } else {
      this.setState({ error: _l`List is required` });
    }
  };
  _addCompanyCallList = (e) => {

    this.props.setActionForHighlight(OverviewTypes.CallList.Account, 'create');
    setTimeout((self)=>{
      this.setState({isAddAccountContact:true});
    },100)
    // e.stopPropagation()
  };
  _addContactCallList = (e) => {

    this.props.setActionForHighlight(OverviewTypes.CallList.Contact, 'create');
    setTimeout((self)=>{
      this.setState({isAddAccountContact:true});
    },100)

    // e.stopPropagation()
  };

  render() {
    const { visible } = this.props;
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
                accounts={accounts}
                contacts={contacts}
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
const mapStateToProps = (state, { overviewType }) => {
  const visible = isHighlightAction(state, overviewType, 'add_to_call_list');
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
    callListAccount,
    callListContact,
    visibleAddAccountContact,
    selectedNew
  };
};

export default connect(mapStateToProps, {
  clearHighlight,
  changeOnMutilTaskMenu,
  changeOnMultiAppointmentMenu: AppointmentActions.changeOnMultiMenu,
  updateCallListDropdown,
  setActionForHighlight: OverviewActions.setActionForHighlight,
  clearStoreNewValueContact: CallListContactAction.clearStoreNewValue,
  clearStoreNewValueAccount: CallListAccountAction.clearStoreNewValue

})(AddToCallListModal);
