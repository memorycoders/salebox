import React, { memo, useMemo } from 'react';
import { Grid, Button } from 'semantic-ui-react';
import classnames from 'classnames';
import { compose } from 'recompose';
import { connect } from 'react-redux';

import _l from 'lib/i18n';
import * as NotificationActions from 'components/Notification/notification.actions';
import css from './rights.css';
import { useClickRight } from './useClickRight';

const ItemInRight = ({ itemInRight, pushError, type, updatePermission }: any) => {
  const item = useMemo(() => itemInRight[type], [itemInRight, type]);

  const { changeDelete, changeRead, changeWrite } = useClickRight({ itemInRight, pushError, type, updatePermission });

  return (
    <Grid.Column className={css.viewAllcompany} textAlign="center">
      <Grid.Row>
        <Button onClick={changeRead} className={classnames(css.btnDone, !item.read && css.buttonGroupClicked)}>
          {_l`Read`}
        </Button>
      </Grid.Row>
      <Grid.Row>
        <Button
          onClick={changeWrite}
          className={classnames(css.itemButtonSecond, css.btnDone, !item.write && css.buttonGroupClicked)}
        >
          {_l`Write`}
        </Button>
      </Grid.Row>
      <Grid.Row>
        <Button
          onClick={changeDelete}
          className={classnames(css.itemButtonSecond, css.btnDone, !item.delete && css.buttonGroupClicked)}
        >
          {_l`Delete`}
        </Button>
      </Grid.Row>
    </Grid.Column>
  );
};

export default compose(memo, connect(null, { pushError: NotificationActions.error }))(ItemInRight);
