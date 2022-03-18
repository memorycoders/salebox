/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import _l from 'lib/i18n';
import { Form, TextArea } from 'semantic-ui-react';
import CategoryDropdown from 'components/Category/CategoryDropdown';
import FocusDropdown from 'components/Focus/FocusDropdown';
import DatePickerInput from 'components/DatePicker/DatePickerInput';
import TagDropdown from 'components/Tag/TagDropdown';
import css from 'Common.css';
import cssForm from './../TaskForm/TaskForm.css';
import CustomFieldPane from '../../CustomField/CustomFieldsPane';
import { ObjectTypes } from '../../../Constants';

addTranslations({
  'en-US': {
    '{0}': '{0}',
    'Profile behavior': 'Profile behavior',
    Industry: 'Industry',
    Relationship: 'Relationship',
    Type: 'Type',
    Relation: 'Relation',
    Address: 'Address',
    Personal: 'Personal',
    General: 'General',
    Responsible: 'Responsible',
    Title: 'Title',
    'Last name': 'Last name',
    'Date and time': 'Date and time',
    Category: 'Category',
    Deal: 'Deal',
    'Add new contact': 'Add new contact',
    'Add new category': 'Add new category',
    'Add new focus': 'Add new focus',
    Unqualified: 'Unqualified',
    Qualified: 'Qualified',
  },
});

// let charLeft = 2000;
// const maxChar = 2000;

export default class DataFieldsForm extends Component {
  constructor(props) {
    super(props);
    this.charLeft = 2000;
    this.maxChar = 2000;
    this.state = {
      categoryId: null,
      dateAndTime: '',
      focusWorkDataId: null,
      note: null,
      tagId: null,
      charLeft: 2000,
      maxChar: 2000,
    };
  }

  _handleChange = (key) => (event, { value }) => {
    if (key === 'note') {
      this.charLeft = this.maxChar - value.length;
      if (this.charLeft < 0) return false;
    }
    this.setState({ [key]: value }, () => {
      this.props.onChange({
        categoryId: this.state.categoryId,
        dateAndTime: this.state.dateAndTime,
        focusWorkDataId: this.state.focusWorkDataId,
        note: this.state.note,
        tagId: this.state.tagId,
      });
    });
  };

  _handleChageDate = (value) => {
    this.setState({ dateAndTime: value }, () => {
      this.props.onChange({
        categoryId: this.state.categoryId,
        dateAndTime: this.state.dateAndTime,
        focusWorkDataId: this.state.focusWorkDataId,
        note: this.state.note,
        tagId: this.state.tagId,
      });
    });
  };

  render() {
    const { categoryId, dateAndTime, focusWorkDataId, note, tagId } = this.state;
    return (
      <Form style={{ position: 'unset' }} className={css.padded}>
        <Form.Group className={cssForm.formField}>
          <div className={cssForm.label} width={6}>{_l`Category`}</div>
          <CategoryDropdown
            colId="data-field-category"
            className={cssForm.dropdownForm}
            addLabel={_l`Add category`}
            onChange={this._handleChange('categoryId')}
            value={categoryId}
          />
        </Form.Group>
        <Form.Group className={cssForm.formField}>
          <div className={cssForm.label} width={6}>
            {_l`Focus`}
          </div>
          <FocusDropdown
            colId="data-field-focus"
            className={cssForm.dropdownForm}
            focusType="PROSPECT"
            size="small"
            addLabel={_l`Add focus`}
            onChange={this._handleChange('focusWorkDataId')}
            value={focusWorkDataId}
          />
        </Form.Group>
        <Form.Group className={cssForm.formField}>
          <div className={cssForm.label} width={6}>{_l`Date and time`}</div>
          <div style={{ width: '100%', height: '28px' }}>
            <DatePickerInput timePicker width={8} value={dateAndTime} onChange={this._handleChageDate} isValidate />
          </div>
        </Form.Group>
        <Form.Group className={cssForm.formField}>
          <div className={cssForm.label} width={6}>{_l`Tag`}</div>
          <TagDropdown
            colId="data-field-tag"
            className={cssForm.dropdownForm}
            onChange={this._handleChange('tagId')}
            value={tagId}
          />
        </Form.Group>
        <Form.Group style={{ position: 'relative' }} className={cssForm.formField}>
          <div className={cssForm.label} width={6}>{_l`Note`}</div>
          <TextArea
            className={cssForm.dropdownForm}
            size="small"
            rows={5}
            maxLength={this.maxChar}
            onChange={this._handleChange('note')}
            value={note}
          />
          <span className={cssForm.span}>{this.charLeft}</span>
        </Form.Group>
        <CustomFieldPane objectType={ObjectTypes.Task} />
      </Form>
    );
  }
}
