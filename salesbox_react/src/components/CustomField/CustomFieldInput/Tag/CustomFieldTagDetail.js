//@flow
import React from 'react';
import { Search, Label, Icon, Input } from 'semantic-ui-react';
import * as customFieldAction from '../../custom-field.actions';
import { compose, withHandlers, lifecycle, withState } from 'recompose';
import { connect } from 'react-redux';
import _l from 'lib/i18n';
import css from '../../CustomField.css'
import commonCss from '../../CustomField.css'

addTranslations({
  'en-US': {
    'is required': 'is required',
  },
});
class CustomFieldTagDetail extends React.PureComponent {
  resultRenderer = ({ value, title }) => <Label style={{ fontSize: 11,}} key={value} content={`#${title}`} />;
  render() {
    const { isFetching,
      listProductTag,
      onChange,
      handlerSearchChange,
      handlerResultSelect,
      isShowSearch,
      handlerRemoveTag,
      valueSearch,
      customField,
      error
    } = this.props;

    const { customFieldValueDTOList } = customField;
    const listShow = listProductTag ? listProductTag.filter(tag =>{
      const findIndex = customFieldValueDTOList.findIndex(value => value.productId === tag.productId);
      return findIndex === -1;
    }) : [];
    return (
      <div className={` ${css.searchDrailContainer}`}>
        <div className={css.searchContainer}>
          <span className={css._tagDetail}>#</span>
          <Search
            className={`${css.borderRadius} ${css.detailSearch}`}
            style={{ display: isShowSearch ? 'block' : 'none' }}
            loading={isFetching}
            lazyLoad
            // onChange={onChange}
            onResultSelect={handlerResultSelect}
            onSearchChange={handlerSearchChange}
            resultRenderer={this.resultRenderer}
            fluid
            icon="null"
            results={listShow}
            value={valueSearch}
            style={{ minHeight: 28, fontSize: 11 }}
            selection
            placeholder={_l`Select`}
          />
        </div>
        <div className={css.detailTagLabelContainer}>
          {customFieldValueDTOList.map(data => {
            return <div><Label className={css.detailTagLabel}>
            {`#${data.value}`}
            <Icon name='delete' onClick={() => handlerRemoveTag(data)} />
          </Label></div>
          })}
      </div>
        {error && <div className={commonCss.error}>{error}</div>}
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
      updateProductTag: customFieldAction.updateProductTag,
      setListProductTag: customFieldAction.setListProductTag,
      updateProductTagMutilObject: customFieldAction.updateProductTagMutilObject
    }),
  withState('isShowSearch', 'setShowSearch', true),
  withState('valueSearch', 'setValueSearch', ''),
  withState('error', 'setError', ''),
  withHandlers({
    handlerSearchChange: ({ fetchTagCustomField, setListProductTag, customField, setValueSearch }) => (e, data) => {
      setValueSearch(data.value)
      let checkTag = data.value ? data.value.slice(0, 1) : null
      if(data.value === ''){
        return setListProductTag([])
      }
      fetchTagCustomField(customField.uuid, data.value)
    },
    handlerResultSelect: ({ isUpdateAll, setError, isCustomFieldModel, updateProductTagMutilObject, setListProductTag, setShowSearch, setValueSearch, updateProductTag, customField, object }) => (e, data) => {
      setValueSearch('');
      setListProductTag([])
      setShowSearch(false)
      if (isCustomFieldModel){
        return updateProductTagMutilObject(customField.uuid, {
          value: data.result.title,
          productId: data.result.productId
        }, 'ADD')
      }
      setError(``);
      updateProductTag(customField.uuid, object.uuid, {
        value: data.result.title,
        productId: data.result.productId,
        objectId: object.uuid
      }, 'ADD', isUpdateAll)
    },
    handlerRemoveTag: ({ isUpdateAll, setError, updateProductTagMutilObject, isCustomFieldModel, updateProductTag, setShowSearch, customField, object }) => (data) => {
      setShowSearch(true)
      if (isCustomFieldModel) {
        return updateProductTagMutilObject(customField.uuid, data, 'REMOVE')
      }

      // if (customField.required) {
      //   const { customFieldValueDTOList } = customField;
      //   if (customFieldValueDTOList.length <= 1){
      //     setError(`${customField.title} ${_l`is required`}`);
      //     return
      //   }
      // }
      updateProductTag(customField.uuid, object.uuid, data, 'REMOVE', isUpdateAll)
    }
  })
)(CustomFieldTagDetail)
