import React, { memo, Fragment, useCallback } from 'react';
import { Grid, Button, Divider } from 'semantic-ui-react';
import classnames from 'classnames';
import { compose } from 'recompose';
import { connect } from 'react-redux';

import ItemInRight from './ItemInRight';
import css from './rights.css';
import { updateSettingsRights } from '../settings.actions';

const ItemTarget = ({ rightItem, indexItemLast, index, updateSettingsRights }: any) => {
  const updateManager = useCallback(() => {
    updateSettingsRights(rightItem.uuid, {
      ...rightItem,
      permission: { ...rightItem.permission, admin: !rightItem.permission.admin },
    });
  }, [rightItem]);

  const updatePermission = useCallback(
    (query) => {
      updateSettingsRights(rightItem.uuid, { ...rightItem, permission: { ...rightItem.permission, ...query } });
    },
    [rightItem]
  );

  return (
    <Fragment>
      <Grid.Row columns={5} className={classnames(css.viewItemTarget)}>
        <Grid.Column className={classnames(css.viewAllcompany, css.heightMax, css.nameItem)}>
          <h5 className={classnames(css.textHeader)}>
            {/* css  !!rightItem.manager && css.nameManager */}
            {rightItem.firstName} {rightItem.lastName}
          </h5>
        </Grid.Column>
        <ItemInRight type="all_company" updatePermission={updatePermission} itemInRight={rightItem.permission} />
        <ItemInRight type="own_unit" updatePermission={updatePermission} itemInRight={rightItem.permission} />
        <ItemInRight type="own_objects" updatePermission={updatePermission} itemInRight={rightItem.permission} />

        <Grid.Column className={classnames(css.viewAllcompany, css.heightMax)} textAlign="center">
          <div className={css.reponsibleIconSize}>
            <div
              className={rightItem.permission.admin ? `${css.setDone}` : `${css.notSetasDone}`}
              onClick={updateManager}
            >
              <div />
            </div>
          </div>
        </Grid.Column>
      </Grid.Row>

      {index !== indexItemLast && <Divider className={css.dividerItem} />}
    </Fragment>
  );
};

export default compose(connect(null, { updateSettingsRights }))(ItemTarget);
