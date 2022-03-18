import React, { memo, useMemo } from 'react';
import { Grid, Button, Divider } from 'semantic-ui-react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { compose } from 'recompose';

import css from './targets.css';
import ItemActivity from './ItemActivity';
import { isBudgetActivityDTOList } from '../settings.selectors';
import { updateSettingsTargetsActivity } from '../settings.actions';
import _l from 'lib/i18n';

const ViewActivity = ({ budgetActivityDTOList, updateSettingsTargetsActivity, idFilter }: any) => {
  const dataBudgetActivityDTOList = useMemo(() => {
    if (idFilter !== 'all') {
      return budgetActivityDTOList.filter((i) => i.unitId === idFilter);
    }

    return budgetActivityDTOList;
  }, [budgetActivityDTOList, idFilter]);

  return (
    <Grid className={classnames(css.viewActivity)}>
      <Grid.Row columns={6} className={css.viewHeader} verticalAlign="middle">
        <Grid.Column floated="left">
          <h3>{_l`Activity`}</h3>
        </Grid.Column>

        <Grid.Column />
        <Grid.Column />
        <Grid.Column />
        <Grid.Column />
        <Grid.Column textAlign="center">
          <Button onClick={updateSettingsTargetsActivity} className={css.btnDone}>
            {_l`Save`}
          </Button>
        </Grid.Column>
      </Grid.Row>

      <Divider />

      <Grid.Row columns={6}>
        <Grid.Column />
        <Grid.Column textAlign="center">
          <h4 className={css.textHeader}>{_l`Appointments/week`}</h4>
        </Grid.Column>
        <Grid.Column textAlign="center">
          <h4 className={css.textHeader}>{_l`Calls/week`}</h4>
        </Grid.Column>
        <Grid.Column textAlign="center">
          <h4 className={css.textHeader}>{_l`Dials / week`}</h4>
        </Grid.Column>
        <Grid.Column textAlign="center">
          <h4 className={css.textHeader}>{_l`Quote sent / week`}</h4>
        </Grid.Column>
        <Grid.Column textAlign="center">
          <h4 className={css.textHeader}>{_l`Negotiating / week`}</h4>
        </Grid.Column>
      </Grid.Row>

      {dataBudgetActivityDTOList
        .filter((i) => !!i.active)
        .map((item, index) => (
          <ItemActivity itemChangeColor={index % 2 === 0} key={index} itemActivity={item} />
        ))}
    </Grid>
  );
};

export default compose(
  memo,
  connect(
    (state) => ({
      budgetActivityDTOList: isBudgetActivityDTOList(state),
    }),
    { updateSettingsTargetsActivity }
  )
)(ViewActivity);
