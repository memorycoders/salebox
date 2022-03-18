//@flow
import React from 'react';
import { Search, Label, Icon } from 'semantic-ui-react';
import * as customFieldAction from '../../custom-field.actions';
import { compose, withHandlers, lifecycle, withState } from 'recompose';
import { connect } from 'react-redux';
import _l from 'lib/i18n';
import css from '../../CustomField.css'
class CustomFieldTag extends React.PureComponent {
  resultRenderer = ({ value, title }) => <Label key={value} content={`#${title}`} />;
  render() {
    const { isFetching, listProductTag, onChange, handlerSearchChange, handlerResultSelect, currentTag, isShowSearch, handlerRemoveTag, valueSearch, _class, colId, calculatingPositionMenuDropdown } = this.props;
    return (
      <div>
        <div id={colId} style={{ display: isShowSearch ? 'block' : 'none' }} onClick={() => {calculatingPositionMenuDropdown(colId, 'results')}}>
        <span className={css._tag}>#</span>
        <Search
          className={`${css.borderRadius} ${css._positionDefault}`}
          loading={isFetching}
          lazyLoad
          onResultSelect={handlerResultSelect}
          onSearchChange={handlerSearchChange}
          resultRenderer={this.resultRenderer}
          fluid
          icon="null"
          results={listProductTag}
          value={valueSearch}
          style={{ height: 28, fontSize: 11 }}
          selection
        />
      </div>
      <div className={css._relative} style={{ display: isShowSearch ? 'none' : 'inline-block' }}>
        <Label className={css._label} >
          {`#${currentTag.title}`}
          <Icon name='delete' onClick={handlerRemoveTag} />
        </Label>
      </div>
      </div>
    );
  }
}

export default compose(
  connect(
    (state) => ({
      isFetching: state.ui.customField.dropdownFetching,
      listProductTag: state.ui.customField.listProductTag
    }),
    {
      fetchTagCustomField: customFieldAction.fetchTagCustomField,
      setListProductTag: customFieldAction.setListProductTag
    }),
  withState('currentTag', 'setCurrentTag', {}),
  withState('isShowSearch', 'setShowSearch', true),
  withState('valueSearch', 'setValueSearch', ''),
  withHandlers({
    handlerSearchChange: ({ fetchTagCustomField, customFieldId, setValueSearch }) => (e, data) => {
      setValueSearch(data.value)
      fetchTagCustomField(customFieldId, data.value.replace("#", ""))
    },
    handlerResultSelect: ({ setCurrentTag, setShowSearch, onChange }) => (e, data) => {
      setCurrentTag(data.result)
      setShowSearch(false)
      onChange(data.result)
    },
    handlerRemoveTag: ({ setCurrentTag, setShowSearch }) => () => {
      setShowSearch(true)
      setCurrentTag({})
    }
  })
)(CustomFieldTag)