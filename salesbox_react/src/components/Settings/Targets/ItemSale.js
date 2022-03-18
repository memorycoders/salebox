import React, { Fragment, useCallback, memo } from 'react';
import { Grid } from 'semantic-ui-react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { compose } from 'recompose';

import css from './targets.css';
import ItemInputTarget from './ItemInputTarget';
import { updateTargetsListByYearSettings } from '../settings.actions';

const ItemSale = ({ itemSale, updateTargetsListByYearSettings }: any) => {
  const updateField = useCallback(
    (query) => {
      updateTargetsListByYearSettings(itemSale.userId, { ...itemSale, ...query });
    },
    [updateTargetsListByYearSettings, itemSale]
  );

  return (
    <Fragment>
      <Grid.Row columns={6} className={classnames(css.itemTarget)}>
        <Grid.Column verticalAlign="middle">
          <p className={css.nameItem}>
            {itemSale.firstName} {itemSale.lastName}
          </p>
        </Grid.Column>

        <ItemInputTarget type="q1" updateField={updateField} value={itemSale.q1} />
        <ItemInputTarget type="q2" updateField={updateField} value={itemSale.q2} />
        <ItemInputTarget type="q3" updateField={updateField} value={itemSale.q3} />
        <ItemInputTarget type="q4" updateField={updateField} value={itemSale.q4} />

        <Grid.Column verticalAlign="middle" className={css.viewAllcompany} textAlign="center">
          <p className={css.nameItem}>
            {String(
              Number(itemSale.q1) + Number(itemSale.q2) + Number(itemSale.q3) + Number(itemSale.q4)
            ).convertMoney()}
          </p>
        </Grid.Column>
      </Grid.Row>
    </Fragment>
  );
};

export default compose(memo, connect(null, { updateTargetsListByYearSettings }))(ItemSale);
