/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/prop-types */
import React from 'react';
import { Form, TextArea, Input, Menu, Icon } from 'semantic-ui-react';
import { connect } from 'react-redux';
import UserDropdown from '../CreateQualifiedForm/UserDropdown';
import DatePickerInput from '../../DatePicker/DatePickerInput';
import { createEntity, createErros } from '../qualifiedDeal.actions';
import { remove } from '../../OrderRow/order-row.actions';
import { setActionForHighlight } from '../../Overview/overview.actions';
import _l from 'lib/i18n';
import '../CreateQualifiedForm/styles.less';
import { getListOrderRows } from '../../OrderRow/order-row.selectors';

addTranslations({
  'en-US': {
    Responsible: 'Responsible',
    addNewContact: 'Add new contact',
    'Sales process': 'Sales process',
    Products: 'Products',
    Edit: 'Edit',
    Delete: 'Delete',
  },
});

let charLeft = 100;
const maxChar = 100;
class EditOrderForm extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      qualified: {
        ...props.form,
        participantList:
          props.form.participantList && props.form.participantList.length > 0
            ? props.form.participantList
            : [{ uuid: props.userId, sharedPercent: 100 }],
      },
      visible: false,
    };
  }

  componentDidMount() {
    const { qualified } = this.state;
    const { participantList } = qualified;
    const newObj = { ...qualified, participantList };
    if (this.props.highlightAction === 'create' || this.props.highlightAction === 'edit') {
      setTimeout(() => {
        this.props.createEntity(this.props.formKey, newObj);
      }, 1);
    } else {
      this.props.createEntity(this.props.formKey, newObj);
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.form !== this.props.form) {
      this.setState({ qualified: this.props.form });
    }
  }

  _initParticipantList = () => {
    const { qualified } = this.state;
    const { participantList = [] } = qualified;
    if (participantList && participantList.length > 0) {
      return participantList.map((p) => {
        return { uuid: p.uuid, sharedPercent: p.sharedPercent };
      });
    }
    return [];
  };

  _initUsersValue = () => {
    const { qualified } = this.state;
    const { participantList } = qualified;
    if (participantList && participantList.length > 0) {
      return participantList.map((p) => {
        return p.uuid;
      });
    }
    return [];
  };

  sumPercent = (arr) => {
    let sum = 0;
    for (let i = 0; i < arr.length; i++) {
      sum += parseInt(arr[i].sharedPercent);
    }
    return sum;
  };

  _handleUserChange = (e, { value }) => {
    let newObj;
    const { qualified } = this.state;
    const { participantList = [] } = qualified;
    const ids = [];
    value.map((id) => {
      const right = participantList.find((x) => x.uuid === id);
      if (right) {
        ids.push(right);
      } else {
        ids.push({ uuid: id, sharedPercent: 0 });
      }
    });
    const sum = this.sumPercent(ids);
    if (sum !== 100) {
      for (let i = 0; i < ids.length; i++) {
        // ids[i].sharedPercent = i === 0 ? 100 - sum : 0;
        ids[i].sharedPercent = i === 0 ? Number(100 - sum) + Number(ids[i].sharedPercent) : ids[i].sharedPercent;
      }
    }
    newObj = { ...qualified, participantList: ids };
    this.props.createEntity(this.props.formKey, newObj);
    this.props.createErros({ participantList: null });
  };

  _handleLabelClick = (e, data) => {
    this.props.onOpen(this.state.qualified.participantList);
  };

  onClosePercentage = () => {
    this.props.onClosePercentage();
  };

  _handleDateChange = (value) => {
    const { qualified } = this.state;
    const newObj = { ...qualified, wonLostDate: new Date(value).getTime() };
    this.props.createEntity(this.props.formKey, newObj);
  };

  render() {
    const { errors, rows, products, types } = this.props;
    const {
      manualProgress,
      organisation,
      sponsorList,
      salesMethod,
      orderRowCustomFieldDTOList = [],
      description,
    } = this.state.qualified;
    const users = this._initUsersValue();
    const participantOpts = this._initParticipantList();
    const wonLostDate = this.state.qualified.wonLostDate ? new Date(this.state.qualified.wonLostDate) : new Date();
    return (
      <div className="qualified-add-form">
        <Form>
          <Form.Group className="unqualified-fields">
            <div className="unqualified-label">
              {_l`Responsible`}
              <span className="required">*</span>
            </div>
            <div className="dropdown-wrapper">
              <UserDropdown
                className="user-dropdown product-dropdown-wrapper"
                onChange={this._handleUserChange}
                value={users}
                participantOpts={participantOpts}
                error={errors && errors.participantList && participantOpts.length <= 0 ? true : false}
                onLabelClick={this._handleLabelClick}
              />
              <span className="form-errors">
                {errors && errors.participantList && participantOpts.length <= 0 ? errors.participantList : null}
              </span>
            </div>
          </Form.Group>
          <Form.Group className="unqualified-fields">
            <div className="unqualified-label">{_l`Next action`}</div>
            <div className="dropdown-wrapper">
              <div style={{ width: '100%', height: '28px' }}>
                <DatePickerInput value={wonLostDate} width={8} onChange={this._handleDateChange} />
              </div>
            </div>
          </Form.Group>
        </Form>
      </div>
    );
  }
}
const mapStateToProps = (state, { formKey }) => {
  return {
    form: state.entities.qualifiedDeal[formKey] || {},
    userId: state.auth.userId,
    errors: state.entities.qualifiedDeal.__ERRORS,
    rows: getListOrderRows(state),
    products: state.entities.product,
    types: state.entities.salesMethod,
  };
};

export default connect(mapStateToProps, { createEntity, createErros, setActionForHighlight, remove })(EditOrderForm);
