import React, { memo } from 'react';
import { Grid } from 'semantic-ui-react';
import { compose } from 'recompose';
import { connect } from 'react-redux';

import css from './organisation.css';
import ListItemOrganisation from './ListItemOrganisation';
import * as SettingsActions from 'components/Settings/settings.actions';
import { withGetData } from 'lib/hocHelpers';
import { isCompanyOrganisation } from '../settings.selectors';
import ViewActionsOrganisation from './ViewActionsOrganisation';
import _l from 'lib/i18n';

const Organisation = ({ company }: any) => {
  return (
    <div style={{ backgroundColor: '#ffffff', height: 'auto', minHeight: '100%' }}>
      {/* <Menu id="period" secondary borderless className={css.secondary}>
        <div className={css.title}>{company.name}</div>
      </Menu> */}

      <Grid className={css.vewContent}>
        <Grid.Column width={16}>
          <ViewActionsOrganisation />

          <ListItemOrganisation />
        </Grid.Column>
      </Grid>
    </div>
  );
};

export default compose(
  memo,
  connect((state) => ({ company: isCompanyOrganisation(state) }), {
    fetchOrganisationSettings: SettingsActions.fetchOrganisationSettings,
  }),
  withGetData(({ fetchOrganisationSettings }) => () => fetchOrganisationSettings())
)(Organisation);
