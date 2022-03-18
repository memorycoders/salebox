/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/prop-types */
//@flow
import React, { Component } from 'react';
import { Form, Input, TextArea } from 'semantic-ui-react';
import _l from 'lib/i18n';
import UnitDropdown from '../Unit/UnitDropdown';
import UserDropdown from 'components/User/UserDropdown';
import cssForm from '../Task/TaskForm/TaskForm.css';
import api from '../../lib/apiClient';
import ProductGroupDropdown from '../ProductGroup/dropDown';
import ProductDropdown from '../Product/ProductDropdown';
import '../Appointment/AppointmentForm/appointmentForm.less';
import { calculatingPositionMenuDropdown } from '../../Constants';
import DatePickerInput from 'components/DatePicker/DatePickerInput';
import { Collapsible } from 'components';
import CampaignDropdown from './CampaignDropdown';
import './campaign.less';
import AddDropdown from '../AddDropdown/AddDropdown';
const StepPane = ({ step, campaigns }) => {
  return (
    <Collapsible right={<div>{`${_l`Link`}`}</div>} title={`${_l`Stage`} ${step}`} width={308} open padded>
      <div>Tap the following mailchimp campaigns for unqualified deals:</div>
      <CampaignDropdown campaigns={campaigns} />
    </Collapsible>
  );
};

addTranslations({
  'en-US': {
    '{0}': '{0}',
    'Campaign name': 'Campaign name',
    Units: 'Units',
    Users: 'Users',
    Start: 'Start',
    End: 'End',
    'Sales target': 'Sales target',
    'Product group': 'Product group',
    Products: 'Products',
  },
});

export class CampaignsForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      campaigns: [],
      budget: 0,
      name: '',
      chanel: [],
      endDate: '',
      startDate: '',
      facebookStepList: [],
      linkedInStepList: [],
      mailChimpStepList: [
        {
          date: new Date(),
          index: 0,
          linkedMailChimp: false,
          status: 'NOT_SHARED',
        },
      ],
      lineOfBusiness: null,
      numberStep: 1,
      ownerId: null,
      productList: [],
      unitList: [],
      userList: [],
      errors: {},
    };

    props.setParams(this.state);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors !== this.props.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }

  async componentDidMount() {
    try {
      const storageData = await api.get({
        resource: `enterprise-v3.0/storage/list`,
      });
      const { storageDTOList } = storageData;
      const mailChimp = (storageDTOList || []).find((value) => value.type === 'MAIL_CHIMP_WEB_TOKEN');
      if (mailChimp) {
        const campaignsData = await api.post({
          resource: `campaign-v3.0/getMailChimpCampaignList`,
          data: {
            apiKey: mailChimp.value,
          },
        });
        if (campaignsData) {
          const { campaigns } = campaignsData;
          this.setState({
            campaigns: campaigns.map((value) => {
              return {
                text: value.title,
                value: value.id,
                key: value.id,
              };
            }),
          });
        }
      }
    } catch (error) { }
  }

  onChange = (field, value, callBack) => {
    this.setState({ [field]: value }, () => {
      callBack && callBack();
    });
  };

  addMailChimp = (numberStep) => {
    // const { numberStep } = this.state;
    let mailChimpStepList = [];
    for (let step = 0; step < numberStep; step++) {
      mailChimpStepList.push({
        date: new Date(),
        index: step,
        linkedMailChimp: false,
        status: 'NOT_SHARED',
      });
    }
    this.setState({ mailChimpStepList, numberStep });
  };

  _handeUnitChange = (e, { value }) => {
    const { errors } = this.setState;
    this.setState({ unitList: value, errors: { ...errors, unitList: null } });
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevState !== this.state) {
      this.props.setParams(this.state);
    }
  }

  _handleChangeUser = (e, { value }) => {
    const { errors } = this.setState;
    this.setState({ userList: value, errors: { ...errors, userList: null } });
  };

  _handleClick = () => {
    const { unitList } = this.state;
    if (!unitList || unitList.length === 0) {
      this.setState({ errors: { unitList: _l`You must select unit first` } });
    } else {
      calculatingPositionMenuDropdown('CampaingnsFormUser');
    }
  };

  _handleProductGroup = (e, { value }) => {
    const { errors } = this.state;
    if (value) {
      this.setState({ lineOfBusiness: { uuid: value }, errors: { ...errors, lineOfBusiness: null } });
    } else {
      this.setState({
        lineOfBusiness: null,
      });
    }
  };

  _handleProduct = (e, { value }) => {
    const { errors } = this.state;
    if (value === null || value.length === 0) {
      this.setState({
        productList: [],
      });
    } else {
      let productIds = this.state.productList || [];
      if (value && value.length > 0) {
        value.forEach((v) => {
          productIds.push({ uuid: v });
        });
      }
      this.setState({ productList: productIds, errors: { ...errors, lineOfBusiness: null } });
    }
  };

  _handleCheckGroup = (e, data) => {
    let { lineOfBusiness } = this.state;
    if (!lineOfBusiness || lineOfBusiness.uuid === null) {
      this.setState({ errors: { lineOfBusiness: _l`You must select product group first` } });
    } else {
      calculatingPositionMenuDropdown('CampaingnsFroducts');
      // this.setState({ lineOfBusiness: null });
    }
  };

  onLinkMailChimp = (step) => {
    const { mailChimpStepList } = this.state;
    let newObject = mailChimpStepList[step];
    newObject.linkedMailChimp = !newObject.linkedMailChimp;
    const newStateMailChimp = [...mailChimpStepList];
    newStateMailChimp[step] = newObject;
    this.setState({ mailChimpStepList: newStateMailChimp });
  };

  changeCampaign = (campaigns, step) => {
    const { mailChimpStepList } = this.state;
    let newObject = mailChimpStepList[step];

    if (campaigns.length > 0) {
      newObject.mailChimpCampaignIds = campaigns;
    } else {
      delete newObject.mailChimpCampaignIds;
    }

    const newStateMailChimp = [...mailChimpStepList];
    newStateMailChimp[step] = newObject;
    this.setState({ mailChimpStepList: newStateMailChimp });
  };

  render() {
    const {
      errors,
      name,
      chanel,
      endDate,
      startDate,
      facebookStepList,
      linkedInStepList,
      mailChimpStepList,
      campaigns,
      lineOfBusiness,
      numberStep,
      ownerId,
      budget,
      productList,
      unitList,
      userList,
    } = this.state;


    return (
      <div className={`appointment-add-form ${cssForm.normalForm}`}>
        <Form className="position-unset">
          {/* <Form.Group className="unqualified-fields">
            <div className="unqualified-label">
              {_l`Campaign name`}
              <span className="required">*</span>
            </div>
            <div className="dropdown-wrapper" width={8}>
              <Input
                fluid
                value={name}
                onChange={(event) => this.onChange('name', event.target.value)}
                error={!!errors.name || false}
              />
              <span className="form-errors">{errors.name || null}</span>
            </div>
          </Form.Group> */}
          <Form.Group className="unqualified-fields">
            <div className="unqualified-label">{_l`Unit`}</div>
            <div className="dropdown-wrapper" width={8}>
              <UnitDropdown
                placeholder=""
                multiple
                className="position-clear"
                ref={ref => this.unitForm = ref}
                id="CampaingnsFormUnit"
                onClick={() => calculatingPositionMenuDropdown('CampaingnsFormUnit')}
                error={errors && errors.unitList ? true : false}
                onChange={this._handeUnitChange}
                value={unitList}
              />
            </div>
          </Form.Group>
          <Form.Group className="unqualified-fields">
            <div className="unqualified-label">{_l`User`}</div>
            <div className="dropdown-wrapper" width={8}>
              <UserDropdown
                unitId={unitList}
                multiple
                className="position-clear"
                id="CampaingnsFormUser"
                onClick={this._handleClick}
                onChange={this._handleChangeUser}
                value={userList}
                error={errors && errors.unitList ? true : false}
              />
              <span className="form-errors">{errors && errors.unitList}</span>
            </div>
          </Form.Group>

          <Form.Group className="unqualified-fields">
            <div className="unqualified-label">
              {_l`Begin`}
              <span className="required">*</span>
            </div>
            <div className="dropdown-wrapper">
              <DatePickerInput onChange={(date) => this.onChange('startDate', date)} value={startDate} />
              <span className="form-errors">{errors && errors.startDate}</span>
            </div>
          </Form.Group>
          <Form.Group className="unqualified-fields">
            <div className="unqualified-label">
              {_l`Ends`}
              <span className="required">*</span>
            </div>
            <div className="dropdown-wrapper">
              <DatePickerInput onChange={(date) => this.onChange('endDate', date)} value={endDate} />
              <span className="form-errors">{errors && errors.endDate}</span>
            </div>
          </Form.Group>

          {/* <Form.Group className="unqualified-fields">
            <div className="unqualified-label">{_l`Sales target`}</div>
            <div className="dropdown-wrapper" width={8}>
              <Input
                fluid
                value={budget}
                onChange={(event) => this.onChange('budget', event.target.value)}
                error={!!errors.budget || false}
              />
              <span className="form-errors">{errors.budget || null}</span>
            </div>
          </Form.Group> */}

          <Form.Group className="unqualified-fields">
            <div className="unqualified-label">{_l`Stages`}</div>
            <div className="dropdown-wrapper" width={8}>
              <Input
                fluid
                value={numberStep}
                onChange={(event) => this.addMailChimp(event.target.value)}
                error={!!errors.numberStep || false}
              />
              <span className="form-errors">{errors.numberStep || null}</span>
            </div>
          </Form.Group>

          <Form.Group className="unqualified-fields">
            <div className="unqualified-label">
              {_l`Product group`}
              <span className="required">*</span>
            </div>
            <div className="dropdown-wrapper">
              <ProductGroupDropdown
                className="user-dropdown position-clear"
                width={8}
                id="CampaingnsFroductGroup"
                onClick={() => calculatingPositionMenuDropdown('CampaingnsFroductGroup')}
                onChange={this._handleProductGroup}
                value={lineOfBusiness && lineOfBusiness.uuid}
                error={errors && errors.lineOfBusiness ? true : false}
              />
              <span className="form-errors">{errors && errors.lineOfBusiness ? errors.lineOfBusiness : null}</span>
            </div>
          </Form.Group>
          <Form.Group className="unqualified-fields">
            <div className="unqualified-label">{_l`Products`}</div>
            <div className="dropdown-wrapper">
              <ProductDropdown
                className="user-dropdown product-dropdown-wrapper position-clear"
                width={8}
                id="CampaingnsFroducts"
                lineOfBusinessId={lineOfBusiness && lineOfBusiness.uuid}
                onChange={this._handleProduct}
                value={productList.map((value) => value.uuid)}
                onClick={this._handleCheckGroup}
                error={errors && errors.productList ? true : false}
              />
              <span className="form-errors">{errors && errors.productList ? errors.productList : null}</span>
            </div>
          </Form.Group>

          {Array.from(Array(Number(numberStep)).keys()).map((step) => {
            const checkLink = mailChimpStepList[step].linkedMailChimp;
            return (
              <Form.Group className="unqualified-fields">
                <div className="unqualified-label">
                  {_l`Stage`} {step + 1}
                </div>
                <div className="dropdown-wrapper campaign-step-right">
                  <CampaignDropdown
                    onChange={(e, { value }) => {
                      this.changeCampaign(value, step);
                    }}
                    className="position-clear"
                    id={`CampaingnDropdown${step}`}
                    onClick={() => calculatingPositionMenuDropdown(`CampaingnDropdown${step}`)}
                    campaigns={campaigns}
                  />
                  <div onClick={() => this.onLinkMailChimp(step)} className={`campaign-link ${checkLink && 'unlink'}`}>
                    {checkLink ? _l`Unlink` : _l`Link`}
                  </div>
                </div>
              </Form.Group>
            );
          })}
        </Form>
      </div>
    );
  }
}
