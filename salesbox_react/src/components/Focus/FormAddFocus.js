import React from 'react';
import { compose, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import ModalCommon from 'components/ModalCommon/ModalCommon';
import _l from 'lib/i18n';
import { Form, TextArea } from 'semantic-ui-react';
import { isHighlightAction } from 'components/Overview/overview.selectors';
import * as OverviewActions from './../Overview/overview.actions';
import cssForm from './../Task/TaskForm/TaskForm.css';
import css from './FormAddFocus.css';
import commonCss from 'Common.css';
import DiscProfileDropdown from './../DiscProfile/DiscProfileDropdown';
import cx from 'classnames';
import { max } from 'moment';
import { getAuth } from '../Auth/auth.selector';
import * as FocusActions from './../Focus/focus.actions';
addTranslations({
  'en-US': {
    Cancel: 'Cancel',
    Done: 'Done',
    Name: 'Name',
    'Recommended behaviour': 'Recommended behaviour',
    Description: 'Description',
    Note: 'Note',
    'Name is required': 'Name is required',
  },
});

const maxChar = 140;
class FormAddFocus extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: false,
      description: '',
      charLeft: maxChar,
      nameFocus: '',
      discProfile: 'NONE',
      open: false,
    };
  }

  onSave = () => {
    const { auth, saveFocus, clearHighlight, overviewType } = this.props;
    let { nameFocus, discProfile, description } = this.state;

    if (!this.state.nameFocus || this.state.nameFocus.trim().length <= 0) {
      this.setState({ error: true });
      return;
    }
    saveFocus(nameFocus, discProfile, description);
    clearHighlight(overviewType);
    this.setState({
      error: false,
      description: '',
      charLeft: maxChar,
      nameFocus: '',
      discProfile: 'NONE',
      open: false,
    });
  };

  hideFormAddFocus = () => {
    const { clearHighlight, overviewType } = this.props;
    clearHighlight(overviewType);
    this.setState({
      error: false,
      description: '',
      charLeft: maxChar,
      nameFocus: '',
      discProfile: 'NONE',
      open: false,
    });
  };
  handleChangeName = (e) => {
    this.setState({
      nameFocus: e.target.value,
      error: false,
    });
  };
  handleChangeDescription = (e) => {
    if (e.target.value.length > 140) {
      return;
    }
    this.setState({
      description: e.target.value,
      charLeft: maxChar - e.target.value.length,
    });
  };
  _handleChangeDropdown = (event, { value }) => {
    this.setState({ open: this.state.open, discProfile: value === null ? '' : value });
  };
  render() {
    const { visible } = this.props;
    const { error, charLeft } = this.state;
    return (
      <ModalCommon
        title={_l`Add focus`}
        visible={visible}
        cancelLabel={_l`Cancel`}
        okLabel={_l`Done`}
        onDone={this.onSave}
        onClose={this.hideFormAddFocus}
        size="tiny"
        scrolling={false}
      >
        <Form>
          <Form.Group>
            <div className={cssForm.label} width={6}>
              {_l`Name`}
              <span className={cssForm.required}>*</span>
            </div>
            <div className={css.inputWraper}>
              <Form.Input error={error} onChange={this.handleChangeName} />
              <span className="form-errors">{error && _l`Name is required`}</span>
            </div>
          </Form.Group>

          <Form.Group>
            <div className={cssForm.label} width={6}>
              {_l`Recommended behaviour`}
            </div>
            <div className={css.inputWraper}>
              <DiscProfileDropdown onChange={this._handleChangeDropdown} />
              {/* <span className="form-errors">{error && errors.focusWorkData ? errors.focusWorkData : null}</span> */}
            </div>
          </Form.Group>

          <Form.Group>
            <div className={cssForm.label} width={6}>
              {_l`Description`}
            </div>
            <TextArea
              className={cx(commonCss.CustomTextArea, css.inputWraper)}
              size="small"
              value={this.state.description}
              onChange={this.handleChangeDescription}
              rows={5}
            />
            <span className={css.span}>{charLeft}</span>
          </Form.Group>
        </Form>
      </ModalCommon>
    );
  }
}

const mapStateToProps = (state, { overviewType }) => {
  const visible = isHighlightAction(state, overviewType, 'addFocus');
  return {
    visible,
    auth: getAuth(state),
  };
};

export default compose(
  connect(mapStateToProps, {
    clearHighlight: OverviewActions.clearHighlightAction,
    saveFocus: FocusActions.saveFocus,
  })
)(FormAddFocus);
