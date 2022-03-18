//@flow
import * as React from 'react';
import _l from 'lib/i18n';
import { connect } from 'react-redux';
import { compose, pure, branch, renderNothing, withHandlers } from 'recompose';
import { FormPair, Collapsible } from 'components';
import { Grid, Progress, Divider, Menu, Icon, Label } from 'semantic-ui-react';
import { highlight } from '../../Overview/overview.actions';

import css from './AccountTargetPane.css';

type PropsType = {
  account: {},
};

String.prototype.convertMoney = function() {
  return this.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

addTranslations({
  'en-US': {
    '{0}': '{0}',
    'Account Targets': 'Account Targets',
    'Sales per year': 'Sales per year',
    'Appointment/week': 'Appointment/week',
  },
});

const AccountTargetPane = ({ account, openChangeAppointmentTarget, openChangeSaleTarget }: PropsType) => {
  const {
    numberActiveMeeting,
    numberFinishedMeetingCurrentWeek,
    numberGoalsMeeting,
    budget,
    wonProfit, // Total Sale
    // FIXME: Sale % Percentage.
  } = account;

  return (
    <Collapsible hasDragable width={308} padded title={_l`Company targets`}>
      <Grid stackable={true} padded={true}>
        <Grid.Row className={css.compactRow}>
          <Grid.Column width={8} className={css.compactColumn}>
            <Label style={{ fontSize: 11 }} pointing="below">{_l`Sales per year`}</Label>
          </Grid.Column>
          <Grid.Column width={7} className={css.compactColumn} textAlign="right">
            {wonProfit
              ? Number(wonProfit)
                  .toString()
                  .convertMoney()
              : ''}{' '}
            / {budget ? Number(budget).toFixed(0).toString().convertMoney() : ''}
          </Grid.Column>
          <Grid.Column width={1} className={css.compactColumn} textAlign="right">
            <Icon onClick={openChangeSaleTarget} name="pencil" />
          </Grid.Column>
        </Grid.Row>

        <Grid.Row className={css.compactRow}>
          <Grid.Column width={16} className={css.compactColumn}>
            <Progress
              color={'green-special'}
              percent={Number(Number((wonProfit / budget) * 100).toFixed(0))}
              progress="percent"
              size="small"
            ></Progress>
          </Grid.Column>
        </Grid.Row>

        <Grid.Row className={css.compactRow}>
          <Grid.Column width={8} className={css.compactColumn}>
            <Label style={{ fontSize: 11 }} pointing='below'>{_l`Meetings per week`}</Label>
          </Grid.Column>
          <Grid.Column width={7} className={css.compactColumn} textAlign="right">
            {numberFinishedMeetingCurrentWeek} / {numberGoalsMeeting}
          </Grid.Column>
          <Grid.Column width={1} className={css.compactColumn} textAlign="right">
            <Icon onClick={openChangeAppointmentTarget} name="pencil" />
          </Grid.Column>
        </Grid.Row>

        <Grid.Row className={css.compactRow}>
          <Grid.Column width={16} className={css.compactColumn}>
            <Progress
              color={'yellow'}
              percent={Number(Number((numberFinishedMeetingCurrentWeek / numberGoalsMeeting) * 100)).toFixed(0)}
              progress="percent"
              size="small"
            ></Progress>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Collapsible>
  );
};

export default compose(
  connect(null, {
    highlight,
  }),

  withHandlers({
    openChangeAppointmentTarget: ({ highlight, overviewType }) => () => {
      highlight(overviewType, null, 'edit_appointment_target');
    },
    openChangeSaleTarget: ({ highlight, overviewType }) => () => {
      highlight(overviewType, null, 'edit_sale_target');
    },
  }),
  // branch(({ contact }) => !contact || Object.keys(contact).length < 1, renderNothing),
  pure
)(AccountTargetPane);
