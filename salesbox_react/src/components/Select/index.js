/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react';
import { Icon } from 'semantic-ui-react';
import { connect } from 'react-redux';
import _l from 'lib/i18n';
import PropTypes from 'prop-types';
import addNone from 'lib/addNone';
import { createError } from '../Task/task.actions';
import './styles.less';
import * as OverviewActions from '../Overview/overview.actions';
import { OverviewTypes } from '../../Constants';
import * as AppointmentActions from '../../components/Appointment/appointment.actions';
import {updateCreateEntityUnqualified} from "../PipeLineUnqualifiedDeals/unqualifiedDeal.actions";
import {updateCreateEntityQualified} from "../PipeLineQualifiedDeals/qualifiedDeal.actions";

addTranslations({
  'en-US': {
  },
});

export class Select extends Component {
  // eslint-disable-next-line react/sort-comp
  static idNumer = 0;

  constructor(props) {
    super(props);
    this.state = {
      showDropdown: false,
      parentSelected: null,
      selected: '',
      cursor: 0,
    };
  }

  _renderSelectOpt = (opt) => {
    const options = opt.map((item) => {
      return {
        key: item.leadId,
        value: item.leadId,
        text: item.productGroupName ? `${item.contactName} - ${item.productGroupName}` : item.contactName,
      };
    });
    return options.length > 0 ? addNone(options) : options;
  };

  componentDidMount() {
    document.addEventListener('click', this._onDocumentClick);
  }

  componentDidUpdate(prevProps) {
    if (
      (prevProps.leads !== this.props.leads && this.props.isFetching && prevProps.contactId !== this.props.contactId) ||
      (this.props.prospects !== prevProps.prospects &&
        this.props.isFetching &&
        prevProps.contactId !== this.props.contactId)
      || (this.props.unqualifiedId ==null && this.props.prospectId ==null && prevProps.contactId !== this.props.contactId)

    ) {
      this.setState({ selected: null });
    }
    // if (prevProps.selected !== this.props.selected) {
    //   this.setState({ selected: this.props.selected });
    // }
  }

  componentWillUnmount() {
    document.removeEventListener('click', this._onDocumentClick);
  }

  _onDocumentClick = (event) => {
    if (this.state.showDropdown && !this._inputRef.contains(event.target)) {
      this.setState({ showDropdown: false });
    }
  };

  _renderDropdownLef = () => {
    const leadsOpt = this._renderSelectOpt(this.props.leads);
    this.resultado = leadsOpt.length;
    const { showDropdown, cursor } = this.state;
    const keySelected = this._renderValue() && this._renderValue().key;
    return (
      <div className="dropdown-left" id="dropdownLeftLeads">
        <ul>
          {leadsOpt.map((item, i) => {
            return (
              <li key={item.key} className={cursor === i ? 'selected' : ''}>
                <a
                  href="#"
                  // className={
                  //   keySelected === item.key || (!keySelected && leadsOpt[0].key === item.key) ? 'selected' : ''
                  // }
                  onClick={(event) => {
                    event.preventDefault();
                    this.setState(
                      {
                        selected: item.key !== null ? { text: item.text, key: item.key, type: 'lead' } : null,
                        showDropdown: !showDropdown,
                        cursor: i,
                      },
                      () => {
                        this.props.onChange({ text: item.text, key: item.key, type: 'lead' });
                      }
                    );
                  }}
                >
                  {item.text}
                </a>
              </li>
            );
          })}
        </ul>
        <div className="bottom-wrapper" onClick={this._handleClickAddUnqualfiedDeal}>
          <a className="addUnqualifi">+ {_l`Add prospect`}</a>
        </div>
      </div>
    );
  };

  _renderDropdownRight = () => {
    const { showDropdown, selected } = this.state;
    const keySelected = this._renderValue() && this._renderValue().key;
    return (
      <div className="dropdown-right">
        <ul>
          {this.props.prospects.map((item) => {
            return (
              <li key={item.key} className={keySelected === item.key ? 'selected' : ''}>
                <a
                  href="#"
                  onClick={(event) => {
                    event.preventDefault();
                    this.setState(
                      {
                        selected: item.key !== null ? { text: item.text, key: item.key, type: 'prospec' } : null,
                        showDropdown: !showDropdown,
                      },
                      () => {
                        this.props.onChange({ text: item.text, key: item.key, type: 'prospec' });
                      }
                    );
                  }}
                >
                  {item.text}
                </a>
              </li>
            );
          })}
        </ul>
        <div className="bottom-wrapper" onClick={this._handleClickAddQualfiedDeal}>
          <a className="addUnqualifi">+ {_l`Add deal`}</a>
        </div>
      </div>
    );
  };

  _renderDropDown = () => {
    const { unqualifiedId, prospectId } = this.props;
    if (!unqualifiedId && !prospectId) {
      return (
        <>
          {this._renderDropdownLef()}
          {this._renderDropdownRight()}
        </>
      );
    } else if (prospectId) {
      return <>{this._renderDropdownRight()}</>;
    } else if (unqualifiedId) {
      return <>{this._renderDropdownLef()}</>;
    }
  };

  _renderValue = () => {
    const { prospects, leads, prospectId, unqualifiedId } = this.props;
    const { selected } = this.state;
    let item = '';
    if (selected || selected === null) {
      item = selected;
    } else if (unqualifiedId) {
      const leadsOpt = this._renderSelectOpt(leads);
      item = leadsOpt.find((i) => i.key === unqualifiedId);
    } else if (prospectId) {
      item = prospects.find((i) => i.key === prospectId);
    }
    return item;
  };

  _handleKeyDown = (e) => {
    // if (e.keyCode === 9) {
    //   this.setState({ showDropdown: !this.state.showDropdown });
    // }
    const { cursor } = this.state;
    this.setState({ isHighlight: true });
    if (e.keyCode === 38 && cursor > 0) {
      this.setState((prevState) => ({
        cursor: prevState.cursor - 1,
      }));
    } else if (e.keyCode === 40 && cursor < this.props.leads.length) {
      this.setState((prevState) => ({
        cursor: prevState.cursor + 1,
      }));
    }
    this.setState({ isHighlight: false });
  };

  _handleClickAddUnqualfiedDeal = () => {
    this.props.updateCreateEntityUnqualified({ organisationId: this.props.organisationId,
      contactId: (Array.isArray(this.props.contactId) && this.props.contactId.length>0 ? this.props.contactId[0] : this.props.contactId) }, OverviewTypes.Pipeline.Lead);

    this.props.setActionForHighlight(OverviewTypes.Pipeline.Lead, 'create');
    this.props.addUnqualilfied();

  };
  _handleClickAddQualfiedDeal = () => {
    this.props.updateCreateEntityQualified(
      { organisation: { uuid: this.props.organisationId }, contacts: Array.isArray(this.props.contactId) ? this.props.contactId.map(c => ({uuid: c})) : [{ uuid: this.props.contactId }] },
      OverviewTypes.Pipeline.Qualified
    );

    this.props.setActionForHighlight(OverviewTypes.Pipeline.Qualified, 'create');
    this.props.addQualilfied();
  };
  render() {
    const { showDropdown } = this.state;
    const { contactId, isFetching, overviewType } = this.props;
    const itemSelected = (this._renderValue() && this._renderValue().text) || '';
    const wrapperClasses = ['jn-select dropdown', 'form-group'];
    if (showDropdown) wrapperClasses.push('open');
    return (
      <div
        // onBlur={() => this.setState({ showDropdown: false })}
        // onFocus={() => this.setState({ showDropdown: !showDropdown })}
        className={wrapperClasses.join(' ')}
        ref={(r) => {
          this._inputRef = r;
        }}
      >
        <div className="field-body">
          <div className="select-display-wrapper">
            <div className="select-display ui loading icon input">
              <input
                onFocus={() => this.setState({ showDropdown: !showDropdown })}
                type="text"
                className={`fakeinput select form-control`}
                value={itemSelected}
                onClick={(event) => {
                  event.preventDefault();
                  if (overviewType === OverviewTypes.Activity.Appointment) {
                    if (!contactId || (contactId && contactId.length <= 0)) return this.props.updateErrorAppointment('__ERRORS', { contact: _l`You must choose a contact first` });
                    this.setState({ showDropdown: !showDropdown });
                  } else {
                    if (!contactId) return this.props.createError({ contact: _l`You must choose a contact first` });
                    this.setState({ showDropdown: !showDropdown });
                  }
                }}
                onKeyDown={this._handleKeyDown}
              />
              {isFetching && <i aria-hidden="true" className="user icon" />}
              {!isFetching && (
                <a
                  tabIndex={-1}
                  href="#"
                  onClick={(event) => {
                    event.preventDefault();
                    // if (!contactId) return this.props.createError({ contact: _l`You must choose a contact first` });
                    // this.setState({ showDropdown: !showDropdown });
                    if (overviewType === OverviewTypes.Activity.Appointment) {
                      if (!contactId || (contactId && contactId.length <= 0)) return this.props.updateErrorAppointment('__ERRORS', { contact: _l`You must choose a contact first` });
                      this.setState({ showDropdown: !showDropdown });
                    } else {
                      if (!contactId) return this.props.createError({ contact: _l`You must choose a contact first` });
                      this.setState({ showDropdown: !showDropdown });
                    }
                  }}
                >
                  <Icon name="dropdown" />
                </a>
              )}
            </div>
            <div className="dropdown-menu">{this._renderDropDown()}</div>
          </div>
        </div>
      </div>
    );
  }
}

Select.propTypes = {
  placeholder: PropTypes.string,
  prospects: PropTypes.array,
  leads: PropTypes.array,
  isFetching: PropTypes.bool,
  contactId: PropTypes.string,
  onChange: PropTypes.func,
};

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, {
  createError,
  setActionForHighlight: OverviewActions.setActionForHighlight,
  updateErrorAppointment: AppointmentActions.update,
  updateCreateEntityUnqualified: updateCreateEntityUnqualified,
  updateCreateEntityQualified: updateCreateEntityQualified,

})(Select);
