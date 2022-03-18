// @flow
import * as React from 'react';
import { compose, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import { Button } from 'semantic-ui-react';
import * as AdvancedSearchActions from './advanced-search.actions';
import css from './AdvancedSearch.css';
import * as OverviewActions from 'components/Overview/overview.actions';
import { OverviewTypes } from 'Constants';

type PropsT = {
  showAccountForm: () => void,
};

const AdvancedGeniusToggle = ({ showAccountForm }: PropsT) => {
  return (
    <div className={css.advanced}>
      <Button icon={'react'} onClick={showAccountForm} />
    </div>
  );
};

export default compose(
  connect(
    null,
    {
      setActionForHighlight: OverviewActions.setActionForHighlight,
    }
  ),
  withHandlers({
    showAccountForm: ({ setActionForHighlight }) => () => {
      setActionForHighlight(OverviewTypes.CallList.Account, 'createAutomatic');
    },
  })
)(AdvancedGeniusToggle);
