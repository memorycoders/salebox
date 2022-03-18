/* eslint-disable react/prop-types */
import React from 'react';
import _l from 'lib/i18n';
import { connect } from 'react-redux';
import api from 'lib/apiClient';
import { Form, TextArea } from 'semantic-ui-react';
import UnitDropdown from 'components/Unit/UnitDropdown';
import UserDropdown from 'components/User/UserDropdown';
import { clearHighlight } from '../../Overview/overview.actions';
import { isHighlightAction, getHighlighted } from '../../Overview/overview.selectors';
import { assignLead } from '../lead.actions';
import ModalCommon from '../../ModalCommon/ModalCommon';
import { makeGetLead } from '../../Lead/lead.selector';
import css from '../../Task/EditTaskModal/EditTaskModal.css';
import './assign.less';
import { changeOnMultiMenu } from '../../PipeLineUnqualifiedDeals/unqualifiedDeal.actions';

addTranslations({
  'en-US': {
    Save: 'Save',
    Assign: 'Assign',
    Unit: 'Unit',
    User: 'User',
    'Unit is required': 'Unit is required',
    'User is required': 'User is required',
  },
});

let charLeft = 200;
const maxChar = 200;

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: '',
      unit: undefined,
      userId: '',
      note: '',
    };
  }

  hideEditForm = () => {
    const { overviewType } = this.props;
    this.props.clearHighlight(overviewType);
  };

  _handleClick = () => {
    const { unit } = this.state;
    if (!unit || unit === null) {
      this.setState({ message: { unit: _l`You must select unit first` } });
    } else {
      this.setState({ open: true });
    }
  };

  _handeUnitChange = (e, { value }) => {
    const { message } = this.setState;
    this.setState({ unit: value, message: { ...message, unit: null } });
  };

  _handleChangeUser = (e, { value }) => {
    const { message } = this.setState;
    this.setState({ userId: value, message: { ...message, userId: null } });
  };

  _handleNoteChange = (e, { value }) => {
    charLeft = maxChar - value.length;
    if (charLeft < 0) return false;
    this.setState({ note: value });
  };

  componentWillReceiveProps(nextProps) {
    setTimeout(() => {
      if (nextProps.visible) {
        this.setState({
          message: '',
          unit: undefined,
          userId: '',
          note: '',
        });
      }
    }, 100);
  }
  onSave = async () => {
    const { unit, message, userId, note } = this.state;
    const { overviewType, lead } = this.props;
    let mes = { ...message };
    if (!unit) mes = { ...mes, unit: _l`Unit is required` };
    if (!userId) mes = { ...mes, userId: _l`User is required` };
    this.setState({ message: mes });
    if (lead.uuid) {
      if (unit && userId) {
        this.props.assignLead(overviewType, { userId, note }, lead.uuid);
      }
    } else {
      let optionValue = {
        note: note,
      };
      if (unit && userId) {
        this.props.changeOnMultiMenu('assign_multi_unqualified', optionValue, overviewType);
      }
    }
  };

  render() {
    const { visible } = this.props;
    const { message, unit, note } = this.state;
    return (
      <React.Fragment>
        <ModalCommon
          title={_l`Assign`}
          visible={visible}
          onDone={this.onSave}
          onClose={this.hideEditForm}
          className={css.editTaskModal}
          okLabel={_l`Save`}
          scrolling={false}
        >
          <div className="delegation-lead-assign">
            <Form>
              <Form.Group className="unqualified-fields">
                <div className="unqualified-label">
                  {_l`Unit`}
                  <span className="required">*</span>
                </div>
                <div className="dropdown-wrapper" width={8}>
                  <UnitDropdown
                    placeholder=""
                    error={message && message.unit ? true : false}
                    onChange={this._handeUnitChange}
                    value={unit}
                  />
                  <span className="form-errors">{message && message.unit}</span>
                </div>
              </Form.Group>
              <Form.Group className="unqualified-fields">
                <div className="unqualified-label">
                  {_l`User`}
                  <span className="required">*</span>
                </div>
                <div className="dropdown-wrapper" width={8}>
                  <UserDropdown
                    unitId={unit}
                    onClick={this._handleClick}
                    onChange={this._handleChangeUser}
                    error={message && message.userId ? true : false}
                  />
                  <span className="form-errors">{message && message.userId}</span>
                </div>
              </Form.Group>
              <Form.Group className="unqualified-fields">
                <div className="unqualified-label">{_l`Note`}</div>
                <div className="dropdown-wrapper">
                  <TextArea
                    size="small"
                    rows={5}
                    maxLength={maxChar + 1}
                    className="unqualified-area"
                    onChange={this._handleNoteChange}
                    value={note}
                  />
                  <span className="span-charLeft">{charLeft}</span>
                </div>
              </Form.Group>
            </Form>
          </div>
        </ModalCommon>
      </React.Fragment>
    );
  }
}

const makeMapStateToProps = () => {
  const gerLead = makeGetLead();
  const mapStateToProps = (state, { overviewType }) => {
    const visible = isHighlightAction(state, overviewType, 'assign');
    const highlightedId = getHighlighted(state, overviewType);
    const unqualified = gerLead(state, highlightedId);

    return {
      visible,
      lead: { ...unqualified, uuid: highlightedId },
    };
  };
  return mapStateToProps;
};

export default connect(makeMapStateToProps, {
  clearHighlight,
  assignLead,
  changeOnMultiMenu: changeOnMultiMenu,
})(Index);
