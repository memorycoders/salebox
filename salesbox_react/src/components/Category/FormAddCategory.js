import React from 'react';
import { compose, withHandlers, withState } from 'recompose';
import { connect } from 'react-redux';
import ModalCommon from 'components/ModalCommon/ModalCommon';
import _l from 'lib/i18n';
import css from './FormAddCategory.css';
import { FormPair } from 'components';
import { Form } from 'semantic-ui-react';
import { isHighlightAction } from 'components/Overview/overview.selectors';
import * as OverviewActions from './../Overview/overview.actions';
import * as CategoryActions from './category.actions';
import cssForm from './../Task/TaskForm/TaskForm.css';
import { getAuth } from '../Auth/auth.selector';
import cx from 'classnames';
addTranslations({
  'en-US': {
    Cancel: 'Cancel',
    Done: 'Done',
    'Name is required': 'Name is required',
    Name: 'Name',
    Required: 'Required',
  },
});

class FormAddCategory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: false,
      nameCategory: '',
    };
  }

  componentWillMount() {
    this.setState({ nameCategory: '' });
  }

  handleChangeNameCategory = (event) => {
    this.setState({ nameCategory: event.target.value, error: false });
  };
  hideFormAddCategory = () => {
    const { clearHighlight, overviewType } = this.props;
    clearHighlight(overviewType);
    this.setState({
      error: false,
      nameCategory: '',
    });
  };
  onSave = () => {
    const { auth, saveCategory, clearHighlight, overviewType } = this.props;
    if (!this.state.nameCategory || this.state.nameCategory.trim().length <= 0) {
      this.setState({ error: true });
      return;
    }
    saveCategory(auth.enterpriseID, auth.token, this.state.nameCategory.trim());

    clearHighlight(overviewType);
    this.setState({
      error: false,
      nameCategory: '',
    });
  };
  render() {
    const { visible } = this.props;
    let { error, nameCategory } = this.state;
    return (
      <ModalCommon
        title={_l`Add category`}
        visible={visible}
        cancelLabel={_l`Cancel`}
        okLabel={_l`Done`}
        onDone={this.onSave}
        onClose={this.hideFormAddCategory}
        size="tiny"
        scrolling={false}
      >
        <Form>
          <Form.Group>
            <div className={cx(cssForm.label, css.label)}>
              {_l`Name`}
              <span className={cssForm.required}>*</span>
            </div>
            <div className={css.inputWraper}>
              <Form.Input required error={error} value={nameCategory} onChange={this.handleChangeNameCategory} />
              <span className="form-errors">{error && _l`Name is required`}</span>
            </div>
          </Form.Group>
        </Form>
      </ModalCommon>
    );
  }
}

const mapStateToProps = (state, { overviewType }) => {
  const visible = isHighlightAction(state, overviewType, 'addCategory');
  return {
    visible,
    auth: getAuth(state),
  };
};
export default compose(
  connect(mapStateToProps, {
    clearHighlight: OverviewActions.clearHighlightAction,
    saveCategory: CategoryActions.saveCategory,
  })
)(FormAddCategory);
