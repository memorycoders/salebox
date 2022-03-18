//@flow
import * as React from 'react';
import { Dropdown } from 'semantic-ui-react';
import { getRelationType } from '../multi-relation.selectors';
import { compose, mapProps } from 'recompose';
import { withGetData } from 'lib/hocHelpers';
import { fetchRelationType } from '../multi-relation.actions';
import { connect } from 'react-redux';
import _l from 'lib/i18n';

addTranslations({
  'en-US': {
    'Relation': 'Relation',
  },
});

const RelationTypeDropdown = (props) => {
  const options = props.options.map(value => {
    return {
      key: value.uuid,
      text: value.name,
      value: value.uuid,
    }
  })
  return <Dropdown
    fluid
    search
    selection {...props}
    onChange={(event, { value })=> {
      const find = props.options.find(item => item.uuid === value);
      props.setRelationForForm(find)
    }}
    options={options}
  />;
};


export default compose(
  connect(
    (state, { objectType }) => ({
      options: getRelationType(state, objectType),
    }),
    {
      fetchRelationType,
    }
  ),
  withGetData(({ fetchRelationType, objectType }) => () => fetchRelationType(objectType)),
)(RelationTypeDropdown);