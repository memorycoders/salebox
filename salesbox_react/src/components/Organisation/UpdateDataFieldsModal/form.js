/* eslint-disable react/prop-types */
import React from 'react';
import { Form, Input } from 'semantic-ui-react';
import { connect } from 'react-redux';
import _l from 'lib/i18n';
import '../../PipeLineUnqualifiedDeals/CreatePipelineForm/createPipelineForm.less';
import CustomFieldPane from '../../CustomField/CustomFieldsPane';
import { ObjectTypes } from '../../../Constants';
import moment from 'moment';
import RelationDropdown from '../../Type/TypeDropdown';
import EmailPane from 'components/Organisation/EmailPane/EmailPane';
import PhonePane from 'components/Organisation/PhonePane/PhonePane';
import CountryDropdown from '../CreateAccountForm/CountryDropdown';
import TypeDropdown from '../CreateAccountForm/TypeDropdown';
import IndustryDropdown from '../CreateAccountForm/IndustryDropdown';
import SizeDropdown from '../CreateAccountForm/SizeDropdown';
import RelationshipDropdown from 'components/Relationship/RelationshipDropdown';

addTranslations({
  'en-US': {
    Street: 'Street',
    'Zip code': 'Zip code',
    City: 'City',
    Country: 'Country',
    Title: 'Title',
    Type: 'Type',
    Industry: 'Industry',
    Relation: 'Relation',
    Relationship: 'Relationship',
    Size: 'Size',
    Web: 'Web',
  },
});
let charLeft = 28;
const maxChar = 28;

class DataFieldsForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // street: '',
      // zipCode: '',
      // city: '',
      // region: '',
      // country: '',
      // title: '',
      // typeId: null,
      // industryId: null,
      // relationId: null,
      // relationship: ''
    };
  }

  onChange = (feid, value) => {
    this.setState({ [feid]: value }, () => {
      this.props.onChange(this.state);
    });
  };

  handleIndustryChange = (event, { value }) => {
    this.setState({ industryId: value }, () => {
      this.props.onChange(this.state);
    });
  };

  handleCountryChange = (event, { value }) => {
    this.setState({ country: value }, () => {
      this.props.onChange(this.state);
    });
  };

  handleTypeChange = (event, { value }) => {
    this.setState({ typeId: value }, () => {
      this.props.onChange(this.state);
    });
  };

  handleSizeChange = (event, { value }) => {
    this.setState({ sizeId: value }, () => {
      this.props.onChange(this.state);
    });
  };

  render() {
    const { street, zipCode, city, state, country, typeId, industryId, sizeId, web } = this.state;

    return (
      <div className="unqualified-add-form">
        <Form>
          <Form.Group className="unqualified-fields">
            <div className="unqualified-label">{_l`Street`}</div>
            <div style={{ position: 'relative' }} className="dropdown-wrapper">
              <Input
                style={{ height: 28 }}
                onChange={(evt) => this.onChange('street', evt.target.value)}
                className="unqualified-area"
                value={street}
              />
            </div>
          </Form.Group>
          <Form.Group className="unqualified-fields">
            <div className="unqualified-label">{_l`Zip code`}</div>
            <div style={{ position: 'relative' }} className="dropdown-wrapper">
              <Input
                style={{ height: 28 }}
                onChange={this.onChange}
                className="unqualified-area"
                onChange={(evt) => this.onChange('zipCode', evt.target.value)}
                value={zipCode}
              />
            </div>
          </Form.Group>
          <Form.Group className="unqualified-fields">
            <div className="unqualified-label">{_l`City`}</div>
            <div style={{ position: 'relative' }} className="dropdown-wrapper">
              <Input
                style={{ height: 28 }}
                className="unqualified-area"
                value={city}
                onChange={(evt) => this.onChange('city', evt.target.value)}
              />
            </div>
          </Form.Group>
          <Form.Group className="unqualified-fields">
            <div className="unqualified-label">{_l`Region`}</div>
            <div style={{ position: 'relative' }} className="dropdown-wrapper">
              <Input
                style={{ height: 28 }}
                className="unqualified-area"
                value={state}
                onChange={(evt) => this.onChange('state', evt.target.value)}
              />
            </div>
          </Form.Group>
          <Form.Group className="unqualified-fields">
            <div className="unqualified-label">{_l`Country`}</div>
            <div style={{ position: 'relative' }} className="dropdown-wrapper">
              <CountryDropdown fluid value={country} onChange={this.handleCountryChange} />
            </div>
          </Form.Group>

          {/* <Form.Group className="unqualified-fields">
            <div className="unqualified-label">{_l`Title`}</div>
            <div style={{ position: 'relative' }} className="dropdown-wrapper">
              <Input
                style={{ height: 28 }}
                className="unqualified-area"
                value={title}
                onChange={(evt) => this.onChange('title', evt.target.value)}
              />
            </div>
          </Form.Group> */}

          <Form.Group className="unqualified-fields">
            <div className="unqualified-label">{_l`Type`}</div>
            <div style={{ position: 'relative' }} className="dropdown-wrapper">
              <TypeDropdown fluid value={typeId} onChange={this.handleTypeChange} />
            </div>
          </Form.Group>

          <Form.Group className="unqualified-fields">
            <div className="unqualified-label">{_l`Industry`}</div>
            <div style={{ position: 'relative' }} className="dropdown-wrapper">
              <IndustryDropdown fluid value={industryId} onChange={this.handleIndustryChange} />
            </div>
          </Form.Group>

          <Form.Group className="unqualified-fields">
            <div className="unqualified-label">{_l`Size`}</div>
            <div style={{ position: 'relative' }} className="dropdown-wrapper">
              <SizeDropdown fluid value={sizeId} onChange={this.handleSizeChange} />
            </div>
          </Form.Group>

          <Form.Group className="unqualified-fields">
            <div className="unqualified-label">{_l`Web`}</div>
            <div style={{ position: 'relative' }} className="dropdown-wrapper">
              <Input
                style={{ height: 28 }}
                className="unqualified-area"
                value={web}
                onChange={(evt) => this.onChange('web', evt.target.value)}
              />
            </div>
          </Form.Group>

          <CustomFieldPane objectType={ObjectTypes.Account} />
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
