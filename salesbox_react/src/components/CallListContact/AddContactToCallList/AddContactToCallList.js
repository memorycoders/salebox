import React, { Component } from 'react';
import { connect } from 'react-redux';
import { isHighlightAction, getHighlighted } from '../../Overview/overview.selectors';
import { Form } from 'semantic-ui-react';
import ContactDropDown from '../../Contact/ContactDropdown';
import ModalCommon from '../../ModalCommon/ModalCommon';
import _l from 'lib/i18n';
import { calculatingPositionMenuDropdown } from '../../../Constants';
import { clearHighlight } from '../../Overview/overview.actions';
import { addContactToCalllist } from '../../Contact/contact.actions';

addTranslations({
  'en-US': {
  },
});

export class AddContactToCallList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      contacts: [],
      error: false,
    };
  }
  handleChangeContacts = (event, { value }) => {
    this.setState({ contacts: value.filter((e) => e !== null), error: false });
  };

  onSave = () => {
    const { overviewType, contactCallListId, addContactToCalllist } = this.props;
    const { contacts } = this.state;

    if (contacts && contacts.length > 0) {
      addContactToCalllist(overviewType, contactCallListId, contacts);
      this.setState({ contacts: [], error: false });
    } else {
      this.setState({ error: true });
    }
  };
  onClose = () => {
    this.props.clearHighlight(this.props.overviewType);
    this.setState({ contacts: [], error: false });
  };

  changeCloseOnDimmerClick = (closeOnDimmerClick) => {
    this.setState({ closeOnDimmerClick });
  };
  render() {
    const { visible } = this.props;
    const { contacts, error } = this.state;

    return (
      <ModalCommon
        title={_l`Add contact to Call lists`}
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
              <div className="unqualified-label">{_l`Contact`}</div>
              <div className="dropdown-wrapper dropdown-multi">
                <ContactDropDown
                  className={'position-clear dropdown-multi-invitess'}
                  multiple={true}
                  search
                  addLabel='Add contact'
                  value={contacts || []}
                  onChange={this.handleChangeContacts}
                  changeCloseOnDimmerClickParent={this.changeCloseOnDimmerClick}
                  calculatingPositionMenuDropdown={calculatingPositionMenuDropdown}
                  colId="AddContactToCallListDropdown"
                  error={error}
                />
                {error && <span className="form-errors">{_l`Contacts is required`}</span>}
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
    const visible = isHighlightAction(state, overviewType, 'add_contact_to_calllist_contact');
    const contactCallListId = getHighlighted(state, overviewType);
    return {
      visible,
      contactCallListId,
    };
  };
  return mapStateToProps;
};

const mapDispatchToProps = {
  clearHighlight,
  addContactToCalllist,
};

export default connect(makeMapStateToProps, mapDispatchToProps)(AddContactToCallList);
