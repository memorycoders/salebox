/* eslint-disable react/prop-types */
import React from 'react';
import { Form, Input } from 'semantic-ui-react';
import { connect } from 'react-redux';
import DatePickerInput from '../../DatePicker/DatePickerInput';
import _l from 'lib/i18n';
import '../../PipeLineUnqualifiedDeals/CreatePipelineForm/createPipelineForm.less';
import CustomFieldPane from '../../CustomField/CustomFieldsPane';
import { ObjectTypes } from '../../../Constants';
import moment from 'moment';

addTranslations({
  'en-US': {
    Description: 'Description',
    'Next action': 'Next action',
  },
});
let charLeft = 28;
const maxChar = 28;

class DataFieldsForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      description: '',
      contractDate: '',
    };
  }

  _handleDescriptionChange = (e, { value }) => {
    charLeft = maxChar - value.length;
    if (charLeft < 0) return false;
    this.setState({ description: value }, () => {
      let fields = {};
      if (value) {
        fields.description = value;
      }
      if (this.state.contractDate) {
        fields.contractDate = moment(this.state.contractDate).valueOf();
      }
      this.props.onChange(fields);
    });
  };

  _handleDateChange = (value) => {
    this.setState({ contractDate: value }, () => {
      let fields = {};
      if (value) {
        fields.contractDate = moment(value).valueOf();
      }
      if (this.state.description) {
        fields.description = this.state.description;
      }
      this.props.onChange(fields);
    });
  };

  render() {
    const { description, contractDate } = this.state;
    charLeft = maxChar - description.length;

    return (
      <div className="unqualified-add-form">
        <Form className="position-unset">
          <Form.Group className="unqualified-fields">
            <div className="unqualified-label">{_l`Description`}</div>
            <div style={{ position: 'relative' }} className="dropdown-wrapper">
              <Input
                maxLength={maxChar + 1}
                style={{ height: 28 }}
                onChange={this._handleDescriptionChange}
                className="unqualified-area"
                value={description}
              />
              <span className="span-charLeft">{charLeft}</span>
            </div>
          </Form.Group>
          <Form.Group className="unqualified-fields">
            <div className="unqualified-label">{_l`Next action`}</div>
            <div className="dropdown-wrapper">
              <div style={{ width: '100%', height: '28px' }}>
                <DatePickerInput value={contractDate} width={8} onChange={this._handleDateChange} isValidate />
              </div>
            </div>
          </Form.Group>

          <CustomFieldPane formID='update-data-field' objectType={ObjectTypes.Opportunity} />
        </Form>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userId: state.auth.userId,
  };
};

export default connect(mapStateToProps, {})(DataFieldsForm);
