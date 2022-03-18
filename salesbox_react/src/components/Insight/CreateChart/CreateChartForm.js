import React, { Component } from 'react';
import { lifecycle, compose, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import _l from 'lib/i18n';
import { getUsersForDropdown } from 'components/User/user.selector';
import FocusActivityDropdown from 'components/Focus/FocusActivityDropdown';
import InsightPeriod from '../Period/period';
import { Button, Dropdown, Input, Icon, Popup } from 'semantic-ui-react';
import { Types, calculatingPositionMenuDropdown } from 'Constants';
import api from '../../../lib/apiClient';
import add from '../../../../public/Add.svg';
import { IconButton } from '../../../components/Common/IconButton';
import css from './CreateChart.css';
import AccountTypeDropdown from '../../Organisation/CreateAccountForm/TypeDropdown/index';
import IndustryDropdown from '../../Organisation/CreateAccountForm/IndustryDropdown/index';

// let nameData = [_l`Name`, _l`Display data`, _l`Time period`, _l`Unit type`, _l`Unit`];

const DisplayDataDropdown = ({ onChange, ...props }) => {
  let options = [
    {
      value: 'DIALS',
      key: 'DIALS',
      text: _l`Dials`,
    },
    {
      value: 'CALLS',
      key: 'CALLS',
      text: _l`Calls`,
    },
    {
      value: 'RECEIVED_EMAILS',
      key: 'RECEIVED_EMAILS',
      text: _l`Received emails`,
    },
    {
      value: 'SENT_EMAILS',
      key: 'SENT_EMAILS',
      text: _l`Sent emails`,
    },
    {
      value: 'DEAL_SIZE',
      key: 'DEAL_SIZE',
      text: _l`Deal size`,
    },
    { text: _l`Deal time`, value: 'DEAL_TIME', objectType: 'ACCOUNT_CONTACT' },
    { text: _l`Closed sales`, value: 'CLOSED_SALES', objectType: 'ACCOUNT_CONTACT' },
    // {title : "Sales forecast", type: "SALES_FORECAST", objectType : "ACCOUNT_CONTACT"},
    { text: _l`Closed profit`, value: 'CLOSED_PROFIT', objectType: 'ACCOUNT_CONTACT' },
    // {title : "Profit forecast", type: "PROFIT_FORECAST", objectType : "ACCOUNT_CONTACT"},
    // {title : "Closed revenue", type: "CLOSED_REVENUE", objectType : "ACCOUNT_CONTACT"},
    // {title : "Revenue forecast", type: "REVENUE_FORECAST", objectType : "ACCOUNT_CONTACT"},

    // {title : "Delegated tasks", type: "DELEGATED_TASK", objectType : "TASK"},
    // {title : "Accepted tasks", type: "ACCEPTED_TASK", objectType : "TASK"},

    { text: _l`Active prospects`, value: 'ACTIVE_LEAD', objectType: 'LEAD' },
    { text: _l`Done prospects`, value: 'DONE_LEAD', objectType: 'LEAD' },
    { text: _l`New prospects`, value: 'NEW_LEAD', objectType: 'LEAD' },

    { text: _l`Active reminders`, value: 'ACTIVE_TASK', objectType: 'TASK' },
    { text: _l`New reminders`, value: 'NEW_TASK', objectType: 'TASK' },
    { text: _l`Done reminders`, value: 'DONE_TASK', objectType: 'TASK' },

    { text: _l`New deals`, value: 'NEW_PROSPECT', objectType: 'OPPORTUNITY' },
    { text: _l`Active deals`, value: 'ACTIVE_PROSPECT', objectType: 'OPPORTUNITY' },
    { text: _l`Orders won`, value: 'WON_PROSPECT', objectType: 'OPPORTUNITY' },
    { text: _l`Orders lost`, value: 'LOST_PROSPECT', objectType: 'OPPORTUNITY' },

    { text: _l`Meetings booked`, value: 'BOOK_APPOINTMENT', objectType: 'APPOINTMENT' },
    { text: _l`Meetings done`, value: 'DONE_APPOINTMENT', objectType: 'APPOINTMENT' },
  ];

  return (
    <Dropdown
      fluid
      search
      {...props}
      selection
      size="small"
      placeholder={_l`Required`}
      onChange={(event, { value }) => {
        onChange(value);
      }}
      // placeholder={_l`Select contact`}
      options={options}
    />
  );
};

const UnitTypeDropdown = ({ onChange, ...props }) => {
  let options = [
    {
      value: 'USER',
      key: 'USER',
      text: _l`User`,
    },
    {
      value: 'UNIT',
      key: 'UNIT',
      text: _l`Unit`,
    },
    {
      value: 'COMPANY',
      key: 'COMPANY',
      text: _l`Company`,
    },
  ];

  return (
    <Dropdown
      fluid
      search
      selection
      {...props}
      size="small"
      onChange={(event, { value }) => {
        onChange(value);
      }}
      placeholder={_l`Required`}
      // placeholder={_l`Select contact`}
      options={options}
    />
  );
};

const TimePeriodDropdown = ({ onChange, ...props }) => {
  let options = Array.from(Array(Number(12)).keys()).map((value) => {
    return {
      value: -value,
      key: -value,
      text: value === 0 ? _l`Current` : -value,
    };
  });

  return (
    <Dropdown
      fluid
      search
      selection
      {...props}
      size="small"
      onChange={(event, { value }) => {
        onChange(value);
      }}
      placeholder={_l`Required`}
      // placeholder={_l`Select contact`}
      options={options}
    />
  );
};

class CreateChartForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      indexOffset: 0,
      dashBoardDataSetDTOList: props.data ? props.data : [],
      units: [],
    };
    // this.props.setData(this.state.dashBoardDataSetDTOList)
  }

  async componentDidMount() {
    const unitsResult = await api.get({
      resource: 'enterprise-v3.0/unit/list',
    });
    if (unitsResult) {
      const { unitDTOList } = unitsResult;
      const units = unitDTOList.map((unit) => {
        return {
          value: unit.uuid,
          key: unit.uuid,
          text: unit.name,
        };
      });
      this.setState({ units });
    }
    //this.props.setData(this.state.dashBoardDataSetDTOList)
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.dashBoardDataSetDTOList !== this.state.dashBoardDataSetDTOList) {
      this.props.setData(this.state.dashBoardDataSetDTOList);
    }
  }

  componentWillReceiveProps(nextProps) {
    console.log('dashBoardDataSetDTOList:vao1 ', nextProps.data);
    if (nextProps.data !== this.props.data) {
      this.setState({
        dashBoardDataSetDTOList: nextProps.data,
      });
    }
    if (nextProps.filters !== this.props.filters) {
      const { dashBoardDataSetDTOList } = this.state;
      this.setState({
        dashBoardDataSetDTOList: dashBoardDataSetDTOList.map((value) => {
          let searchFieldList =
            nextProps.filters &&
            nextProps.filters.map((filter, index) => {
              const aviable = value.searchFieldList[index];
              if (aviable) {
                return aviable;
              }

              return {
                ...filter,
                valueDate: filter.valueDate ? filter.valueDate : null,
                valueId: filter.valueDate ? filter.valueDate : null,
                valueText: filter.valueText ? filter.valueText : filter.name,
              };
            });

          return {
            ...value,
            searchFieldList,
          };
        }),
      });
    }
  }

  getMessageError = (type) => {
    if (type === 'diffPeriod') {
      return _l`Time period is required`;
    }
    if (type === 'displayDataType') {
      return _l`Display data is required`;
    }
    if (type === 'name') {
      return _l`Name is required`;
    }
    if (type === 'filterType') {
      return _l`Unit type is required`;
    }
    if (type === 'filterId') {
      return _l`Unit is required`;
    }
  };

  changeDataSet = async (type, value, index) => {
    if (value !== '' && value !== null && value !== undefined) {
      this.props.setError(index, type, false, this.getMessageError(type));
    } else {
      this.props.setError(index, type, true, this.getMessageError(type));
    }
    const { dashBoardDataSetDTOList } = this.state;
    let newObject = { ...dashBoardDataSetDTOList[index] };
    let units = newObject.units;
    let isShowUnit = newObject.isShowUnit;
    let filterId = newObject.filterId;
    if (type === 'filterType') {
      if (value === 'UNIT') {
        isShowUnit = true;
        const dataSetByIndex = dashBoardDataSetDTOList[index];
        if (dataSetByIndex.filterType !== value) {
          units = this.units;
        }
      } else if (value === 'COMPANY') {
        isShowUnit = false;
      } else {
        isShowUnit = true;
        units = this.props.users;
      }

      if (newObject.filterType !== value) {
        filterId = null;
      }
    }
    newObject.filterId = filterId;
    newObject.units = units;
    newObject.isShowUnit = isShowUnit;
    newObject[type] = value;
    const newState = [...dashBoardDataSetDTOList];
    newState[index] = newObject;
    this.setState({ dashBoardDataSetDTOList: newState });
  };

  removeDataSet = (index) => {
    const { dashBoardDataSetDTOList } = this.state;

    if (dashBoardDataSetDTOList.length === 1) {
      return;
    }
    let newState = [...dashBoardDataSetDTOList];
    newState = newState.filter((v, idx) => v.index !== index);
    this.setState(
      {
        dashBoardDataSetDTOList: newState,
      },
      () => {
        this.setState({
          indexOffset:
            this.state.dashBoardDataSetDTOList.length > 4 ? this.state.dashBoardDataSetDTOList.length - 4 : 0,
        });
      }
    );
  };

  createNewDataSet = () => {
    const { dashBoardDataSetDTOList } = this.state;
    const newState = [...dashBoardDataSetDTOList].concat({
      ...dashBoardDataSetDTOList[dashBoardDataSetDTOList.length - 1],
      index: dashBoardDataSetDTOList.length,
      searchFieldList: this.props.filters.map((value) => {
        return {
          ...value,
          productId: null,
        };
      }),
      // units: [],
      // isShowUnit: true
    });
    this.setState(
      {
        dashBoardDataSetDTOList: newState,
      },
      () => {
        this.setState({
          indexOffset:
            this.state.dashBoardDataSetDTOList.length > 4 ? this.state.dashBoardDataSetDTOList.length - 4 : 0,
        });
      }
    );
  };

  changeOffsetIndex = (type) => {
    const { indexOffset, dashBoardDataSetDTOList } = this.state;
    if (type === 'PRE' && indexOffset > 0) {
      this.setState({ indexOffset: indexOffset - 1 });
    } else if (type !== 'PRE' && indexOffset < dashBoardDataSetDTOList.length - 4) {
      this.setState({ indexOffset: indexOffset + 1 });
    }
  };

  removeFilter = (index) => {
    const { filters, setFilters } = this.props;
    let newFilter = [...filters.slice(0, index), ...filters.slice(index + 1, filters.lenght)];
    setFilters(newFilter);
  };
  render() {
    const { indexOffset, dashBoardDataSetDTOList, units } = this.state;
    const { filters, errors, dashBoardType } = this.props;
    const maxShow = 4;

    let nameData = [_l`Name`, _l`Display data`, _l`Time period`, _l`Unit type`, _l`Unit`];

    return (
      <div>
        <div className={css.header}>
          <InsightPeriod objectType={'INSIGHT_CHART_CREATE'} />
          <div className={css.right}>
            <Button
              onClick={() => {
                this.props.setDashBoardType('DIAGRAM');
              }}
              className={`${css.button} ${dashBoardType !== 'PIE_CHART' && css.buttonActive}`}
            >{_l`Diagram`}</Button>
            <Button
              onClick={() => {
                this.props.setDashBoardType('PIE_CHART');
              }}
              className={`${css.button} ${dashBoardType === 'PIE_CHART' && css.buttonActive}`}
            >{_l`Piechart`}</Button>
          </div>
        </div>
        <div className={css.body}>
          <div className={`${css.column} ${css.labelColumn}`}>
            {nameData.concat([].map((value) => value.valueText || value.name)).map((value, idx) => {
              return (
                <div key={idx} className={`${css.item} ${css.label} ${css.labelItem}`}>
                  {value} <span className={css.required}>*</span>
                </div>
              );
            })}
            {filters &&
              filters
                .map((value) => value.valueText || value.name)
                .map((value, idx) => {
                  return (
                    <div key={idx} className={`${css.item} ${css.label} ${css.labelItem} ${css.labelRemove}`}>
                      {value} <span className={css.required}>*</span>
                      <Button
                        icon="close"
                        size="mini"
                        className={css.deleteButton}
                        onClick={() => {
                          this.removeFilter(idx);
                        }}
                        circular
                        compact
                      />
                    </div>
                  );
                })}
            <div
              style={{ alignItems: 'center', paddingTop: 0 }}
              className={`${css.item} ${css.label} ${css.labelItem}`}
            >
              {_l`Filter`}{' '}
              <IconButton
                reverseClass
                btnClass={css.btnClass}
                imageClass={css.smallCircle}
                onClick={() => {
                  this.props.setVisiableAddFilterModal(true);
                }}
                name="profile"
                size={24}
                src={add}
              />
            </div>
          </div>
          {dashBoardDataSetDTOList.length > 4 && indexOffset > 0 && (
            <div className={css.nextandPre}>
              <div
                onClick={() => this.changeOffsetIndex('PRE')}
                className={css.circleNexPre}
                style={{ marginRight: 10 }}
              >
                <Icon style={{ fontSize: 18 }} name="angle left" />
              </div>
            </div>
          )}
          <div className={css.dataSetClass}>
            {dashBoardDataSetDTOList
              .filter(
                (v, index) =>
                  dashBoardDataSetDTOList.length < 5 || (index < maxShow + indexOffset && index >= indexOffset)
              )
              .map((dataSet, idx) => {
                return (
                  <div className={css.column}>
                    <div className={`${css.item} `}>
                      <Input
                        icon={<Icon link name="close" onClick={() => this.removeDataSet(dataSet.index)} />}
                        value={dataSet.name}
                        style={{ width: '100%', height: 28 }}
                        placeholder={_l`Required`}
                        onChange={(event) => this.changeDataSet('name', event.target.value, dataSet.index)}
                      />
                      <span className={css.error}>{errors[dataSet.index] && errors[dataSet.index].name}</span>
                    </div>
                    <div className={`${css.item} dropdown-wrapper`}>
                      <DisplayDataDropdown
                        value={dataSet.displayDataType}
                        onChange={(value) => this.changeDataSet('displayDataType', value, dataSet.index)}
                        id={`chartFormDisplayData${idx}`}
                        onClick={() => calculatingPositionMenuDropdown(`chartFormDisplayData${idx}`)}
                        className="position-clear"
                      />
                      <span className={css.error}>
                        {errors[dataSet.index] && errors[dataSet.index].displayDataType}
                      </span>
                    </div>
                    <div className={`${css.item}`}>
                      <TimePeriodDropdown
                        value={dataSet.diffPeriod}
                        onChange={(value) => this.changeDataSet('diffPeriod', value, dataSet.index)}
                        id={`chartFormTimePeriod${idx}`}
                        onClick={() => calculatingPositionMenuDropdown(`chartFormTimePeriod${idx}`)}
                        className="position-clear"
                      />
                      <span className={css.error}>{errors[dataSet.index] && errors[dataSet.index].diffPeriod}</span>
                    </div>
                    <div className={`${css.item} `}>
                      <UnitTypeDropdown
                        value={dataSet.filterType}
                        onChange={(value) => this.changeDataSet('filterType', value, dataSet.index)}
                        id={`chartFormUnitType${idx}`}
                        onClick={() => calculatingPositionMenuDropdown(`chartFormUnitType${idx}`)}
                        className="position-clear"
                      />
                      <span className={css.error}>{errors[dataSet.index] && errors[dataSet.index].filterType}</span>
                    </div>
                    {dataSet.isShowUnit ? (
                      <div className={`${css.item}`}>
                        <Dropdown
                          fluid
                          search
                          value={dataSet.filterId}
                          className="position-clear"
                          selection
                          size="small"
                          placeholder={_l`Required`}
                          onChange={(e, { value }) => this.changeDataSet('filterId', value, dataSet.index)}
                          id={`chartFormUnits${idx}`}
                          onClick={() => calculatingPositionMenuDropdown(`chartFormUnits${idx}`)}
                          options={dataSet.filterType === 'UNIT' ? units : this.props.users}
                        />
                        <span className={css.error}>{errors[dataSet.index] && errors[dataSet.index].filterId}</span>
                      </div>
                    ) : (
                      <div className={`${css.item}`} />
                    )}
                    {(dataSet.searchFieldList || []).map((filter, filterIndex) => {
                      const ComponentF = FilterDropdown(filter.field);
                      return (
                        <div className={`${css.item}`}>
                          <ComponentF
                            changeCloseOnDimmerClickParent={this.props.changeCloseOnDimmerClickParent}
                            value={filter.valueId}
                            className="position-clear"
                            onChange={(e, { value }) => {
                              let newFilter = { ...filter };
                              newFilter.valueId = value;
                              let newSearchFieldList = [...dataSet.searchFieldList];
                              newSearchFieldList[filterIndex] = newFilter;
                              this.changeDataSet('searchFieldList', newSearchFieldList, dataSet.index);
                            }}
                            id={`filterDropdown${filterIndex}${idx}`}
                            onClick={() => calculatingPositionMenuDropdown(`filterDropdown${filterIndex}${idx}`)}
                          />
                        </div>
                      );
                    })}
                  </div>
                );
              })}
          </div>
          {dashBoardDataSetDTOList.length > 4 && indexOffset < dashBoardDataSetDTOList.length - 4 && (
            <div className={css.nextandPre}>
              <div className={css.circleNexPre} onClick={() => this.changeOffsetIndex('NEXT')}>
                <Icon style={{ fontSize: 18 }} name="angle right" />
              </div>
            </div>
          )}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Popup
              style={{ fontSize: 11 }}
              trigger={
                <IconButton
                  onClick={() => {
                    this.createNewDataSet();
                  }}
                  name="profile"
                  size={36}
                  src={add}
                />
              }
              content={_l`Add data set`}
            ></Popup>
          </div>
        </div>
      </div>
    );
  }
}

export default compose(
  connect((state, props) => ({
    users: getUsersForDropdown(state),
  }))
)(CreateChartForm);

const FilterDropdown = (key) => {
  switch (key) {
    case 'ACCOUNT_TYPE':
    case 'CONTACT_TYPE':
      return AccountTypeDropdown;
    case 'CONTACT_INDUSTRY':
    case 'ACCOUNT_INDUSTRY':
      return IndustryDropdown;
    case 'FOCUS_ACTIVITY':
      return FocusActivityDropdown;
    default:
      return IndustryDropdown;
  }
};
