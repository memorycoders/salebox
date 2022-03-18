import React, { Component } from 'react';
import { connect } from 'react-redux';
import { isHighlightAction, getHighlighted } from '../../Overview/overview.selectors';
import { Form } from 'semantic-ui-react';
import OrganisationDropdown from '../../Organisation/OrganisationDropdown';
import ModalCommon from '../../ModalCommon/ModalCommon';
import _l from 'lib/i18n';
import { calculatingPositionMenuDropdown } from '../../../Constants';
import { clearHighlight } from '../../Overview/overview.actions';
import { addAccountToCalllist } from '../../Organisation/organisation.actions';

addTranslations({
  'en-US': {
  },
});

export class AddAccountToCallListModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      accounts: [],
      error: false,
    };
  }
  handleChangeAccounts = (event, { value }) => {
    this.setState({ accounts: value.filter((e) => e !== null), error: false });
  };

  onSave = () => {
    const { overviewType, accountCallListId, addAccountToCalllist } = this.props;
    const { accounts } = this.state;

    if (accounts && accounts.length > 0) {
      addAccountToCalllist(overviewType, accountCallListId, accounts);
      this.setState({ accounts: [], error: false });
    } else {
      this.setState({ error: true });
    }
  };
  onClose = () => {
    this.props.clearHighlight(this.props.overviewType);
    this.setState({ accounts: [], error: false });
  };

  changeCloseOnDimmerClick = (closeOnDimmerClick) => {
    this.setState({ closeOnDimmerClick });
  };
  render() {
    const { visible } = this.props;
    const { accounts, error } = this.state;

    return (
      <ModalCommon
        title={_l`Add company call list`}
        visible={visible}
        onDone={this.onSave}
        onClose={this.onClose}
        size="small"
        paddingAsHeader={true}
        scrolling={false}
        description={false}
      >
        <div className="appointment-add-form">
          <Form className="position-unset">
            <Form.Group className="unqualified-fields">
              <div className="unqualified-label">{_l`Company`}</div>
              <div className="dropdown-wrapper dropdown-multi">
                <OrganisationDropdown
                  className={'position-clear dropdown-multi-invitess'}
                  multiple={true}
                  search
                  addLabel='Add company'
                  value={accounts || []}
                  onChange={this.handleChangeAccounts}
                  changeCloseOnDimmerClickParent={this.changeCloseOnDimmerClick}
                  calculatingPositionMenuDropdown={calculatingPositionMenuDropdown}
                  colId="AddAccountToCallListDropdown"
                  error={error}
                />
                {error && <span className="form-errors">{_l`Company is required`}</span>}
              </div>
            </Form.Group>
          </Form>
        </div>
      </ModalCommon>
    );
  }
}

const makeMapStateToProps = () => {
  const mapStateToProps = (state, { overviewType }) => {
    const visible = isHighlightAction(state, overviewType, 'add_account_to_calllist_account');
    const accountCallListId = getHighlighted(state, overviewType);
    return {
      visible,
      accountCallListId,
    };
  };
  return mapStateToProps;
};

const mapDispatchToProps = {
  clearHighlight,
  addAccountToCalllist,
};

export default connect(makeMapStateToProps, mapDispatchToProps)(AddAccountToCallListModal);
