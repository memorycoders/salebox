// @flow
import * as React from 'react';
import { compose, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import { Button } from 'semantic-ui-react';
import * as AdvancedSearchActions from './advanced-search.actions';
import css from './AdvancedSearch.css';

type PropsT = {
  history: boolean,
  onClick: () => void,
  color: string,
};

const AdvancedSearchToggle = ({ history, onClick, color }: PropsT) => {
  return (
    <div className={css.advanced}>
      <Button icon={'history'} color={history ? color : undefined} onClick={onClick} />
    </div>
  );
};

export default compose(
  connect(
    null,
    {
      enable: AdvancedSearchActions.enableHistory,
      block: AdvancedSearchActions.blockHistory,
    }
  ),
  withHandlers({
    onClick: ({ enable, block, history, objectType }) => () => {
      if (history) {
        block(objectType);
      } else {
        enable(objectType);
      }
    },
  })
)(AdvancedSearchToggle);
