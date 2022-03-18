// @flow
import * as React from 'react';
import { compose, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import { Button } from 'semantic-ui-react';
import * as AdvancedSearchActions from './advanced-search.actions';
import css from './AdvancedSearch.css';

type PropsT = {
  shown: boolean,
  onClick: () => void,
};

const AdvancedSearchToggle = ({ shown, onClick }: PropsT) => {
  return (
    <div className={css.advanced}>
      <Button icon={'filter'} onClick={onClick} />
    </div>
  );
};

export default compose(
  connect(
    null,
    {
      show: AdvancedSearchActions.show,
      hide: AdvancedSearchActions.hide,
    }
  ),
  withHandlers({
    onClick: ({ show, hide, shown, objectType }) => () => {
      if (shown) {
        hide(objectType);
      } else {
        show(objectType);
      }
    },
  })
)(AdvancedSearchToggle);
