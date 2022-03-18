import React, { memo, useMemo } from 'react';
import { Grid, Button, Divider } from 'semantic-ui-react';
import classnames from 'classnames';
import { compose } from 'recompose';

import css from './targets.css';
import ItemSale from './ItemSale';
import { connect } from 'react-redux';
import { isRevenueDTOList } from '../settings.selectors';
import { updateSettingsTargetsListByYear } from '../settings.actions';
import _l from 'lib/i18n';

const ViewSales = ({ revenueDTOList, updateSettingsTargetsListByYear, idFilter }: any) => {
  const dataRevenueDTOList = useMemo(() => {
    if (idFilter !== 'all') {
      return revenueDTOList.filter((i) => i.unitId === idFilter);
    }

    return revenueDTOList;
  }, [revenueDTOList, idFilter]);

  return (
    <Grid className={classnames(css.pageRights)}>
      <Grid.Row columns={6} className={css.viewHeader}>
        <Grid.Column floated="left">
          <h3>{_l`Sales`}</h3>
        </Grid.Column>

        <Grid.Column />
        <Grid.Column />
        <Grid.Column />
        <Grid.Column />
        <Grid.Column textAlign="center">
          <Button onClick={updateSettingsTargetsListByYear} className={css.btnDone}>
            {_l`Save`}
          </Button>
        </Grid.Column>
      </Grid.Row>

      <Divider />

      <Grid.Row columns={6}>
        <Grid.Column />
        <Grid.Column textAlign="center">
  <p className={css.textHeader}>{_l`Q`}1</p>
        </Grid.Column>
        <Grid.Column textAlign="center">
          <p className={css.textHeader}>{_l`Q`}2</p>
        </Grid.Column>
        <Grid.Column textAlign="center">
          <p className={css.textHeader}>{_l`Q`}3</p>
        </Grid.Column>
        <Grid.Column textAlign="center">
          <p className={css.textHeader}>{_l`Q`}4</p>
        </Grid.Column>
        <Grid.Column textAlign="center">
          <p className={css.textHeader}>
            {String(
              dataRevenueDTOList
                .filter((i) => !!i.active)
                .reduce((a, b) => a + Number(b.q1) + Number(b.q2) + Number(b.q3) + Number(b.q4), 0)
            ).convertMoney()}
          </p>
        </Grid.Column>
      </Grid.Row>

      {dataRevenueDTOList
        .filter((i) => !!i.active)
        .map((item, index) => (
          <ItemSale itemChangeColor={index % 2 === 0} itemSale={item} key={index} />
        ))}
    </Grid>
  );
};

export default compose(
  memo,
  connect((state) => ({ revenueDTOList: isRevenueDTOList(state) }), {
    updateSettingsTargetsListByYear,
  })
)(ViewSales);
