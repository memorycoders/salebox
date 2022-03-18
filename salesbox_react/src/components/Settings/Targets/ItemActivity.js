import React, { Fragment, memo, useCallback } from 'react';
import { Grid } from 'semantic-ui-react';
import classnames from 'classnames';

import css from './targets.css';
import ItemInputTarget from './ItemInputTarget';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { updateTargetsActivitySettings } from '../settings.actions';

const ItemActivity = ({ itemActivity, updateTargetsActivitySettings }: any) => {
  const updateField = useCallback(
    (query) => {
      updateTargetsActivitySettings(itemActivity.userId, { ...itemActivity, ...query });
    },
    [updateTargetsActivitySettings, itemActivity]
  );

  return (
    <Fragment>
      <Grid.Row columns={6} className={classnames(css.itemTarget)}>
        <Grid.Column verticalAlign="middle">
          <p className={css.nameItem}>
            {itemActivity.firstName} {itemActivity.lastName}
          </p>
        </Grid.Column>

        <ItemInputTarget type="meetingPerWeek" updateField={updateField} value={itemActivity.meetingPerWeek} />
        <ItemInputTarget type="callPerWeek" updateField={updateField} value={itemActivity.callPerWeek} />
        <ItemInputTarget type="dialPerWeek" updateField={updateField} value={itemActivity.dialPerWeek} />
        <ItemInputTarget type="sendQuotePerWeek" updateField={updateField} value={itemActivity.sendQuotePerWeek} />
        <ItemInputTarget
          type="sendContractPerWeek"
          updateField={updateField}
          value={itemActivity.sendContractPerWeek}
        />
      </Grid.Row>
    </Fragment>
  );
};

export default compose(memo, connect(null, { updateTargetsActivitySettings }))(ItemActivity);
