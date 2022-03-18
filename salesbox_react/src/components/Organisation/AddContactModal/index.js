/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/prop-types */
import React from 'react';
import _l from 'lib/i18n';
import { connect } from 'react-redux';
import ModalCommon from '../../ModalCommon/ModalCommon';
import { clearHighlight } from '../../Overview/overview.actions';
import { update, createContactRequest } from '../organisation.actions';
import { isHighlightAction, getHighlighted } from '../../Overview/overview.selectors';
import css from '../CreateAccountModal/CreateAccountModal.css';
import ContactDropdown from './ContactDropDown';
import { Form } from 'semantic-ui-react';
import { calculatingPositionMenuDropdown } from '../../../Constants';
import { getCustomFieldsObject } from '../../CustomField/custom-field.selectors';

addTranslations({
  'en-US': {
    'Contact is required': 'Contact is required',
  },
});
class CreateContactModal extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      error: false,
    };
  }

  hideEditForm = () => {
    this.props.update('__CREATE_CONTACT', { contactDTOList: [], uuid: this.props.qualifiedDeal.uuid });
    this.props.clearHighlight(this.props.overviewType);
  };

  createUpdateHandler = (key, value) => {
    this.props.update('__CREATE_CONTACT', { [key]: value, uuid: this.props.qualifiedDeal.uuid });
  };

  _handleContactChange = (e, { value }) => {
    this.createUpdateHandler('contactDTOList', value);
    this.setState({ error: false });
  };

  componentDidMount() {
    this.props.update('__CREATE_CONTACT', { uuid: this.props.qualifiedDeal.uuid });
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.qualifiedDeal.uuid !== this.props.qualifiedDeal.uuid) {
      this.props.update('__CREATE_CONTACT', { uuid: nextProps.qualifiedDeal.uuid });
    }
  }
  onSave = () => {
    if (!this.props.form.contactDTOList || this.props.form.contactDTOList.length <= 0) {
      this.setState({ error: true });
      return;
    }
    this.props.createContactRequest(this.props.overviewType);
  };

  render() {
    const { visible, form, customField } = this.props;
    return (
      <React.Fragment>
        <ModalCommon
          title={_l`Add contact`}
          visible={visible}
          onDone={this.onSave}
          onClose={this.hideEditForm}
          okLabel={_l`save`}
          scrolling={false}
          className={customField.length > 0 ? css.modalCustomField :css.modal}
        >
          <div className="unqualified-add-form">
            <Form className="position-unset">
              <Form.Group className="unqualified-fields">
                <div className="unqualified-label">
                  {_l`Contact`}
                  <span className="required">*</span>
                </div>
                <div className="dropdown-wrapper">
                  <ContactDropdown
                    upward={false}
                    _className="position-clear"
                    id="CreateContactSublistContactDropdơwn"
                    onClick={() => calculatingPositionMenuDropdown('CreateContactSublistContactDropdơwn')}
                    colId="unqualified-form-contact"
                    width={8}
                    upward={false}
                    organisationId={form.organisationId}
                    value={form.contactDTOList}
                    onChange={this._handleContactChange}
                  />
                  {this.state.error && <span className="form-errors">{_l`Contact is required`}</span>}
                </div>
              </Form.Group>
            </Form>
          </div>
        </ModalCommon>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state, { overviewType }) => {
  const visible = isHighlightAction(state, overviewType, 'create');
  const highlightedId = getHighlighted(state, overviewType);
  const customField = getCustomFieldsObject(state);
  return {
    visible,
    customField,
    form: state.entities.organisation.__CREATE_CONTACT || {},
    qualifiedDeal: { uuid: highlightedId },
  };
};
export default connect(mapStateToProps, { isHighlightAction, clearHighlight, update, createContactRequest })(
  CreateContactModal
);
