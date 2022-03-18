import React, { useCallback, memo } from 'react';
import { Grid, Input, Button, Popup, Icon } from 'semantic-ui-react';
import _l from 'lib/i18n';

import css from '../customFields.css';

const ItemDropdown = ({ item, removeItem, updateValueItem }: any) => {
  const onChangeInput = useCallback(
    (_, data) => {
      updateValueItem(item._uuid, data.value);
    },
    [updateValueItem, item]
  );

  return (
    <Grid>
      <Grid.Column className={css.itemView} verticalAlign="middle" width={13}>
        <Input onChange={onChangeInput} placeholder={_l`Required`} type="text" value={item.value} transparent fluid />
      </Grid.Column>
      <Grid.Column className={css.itemView} textAlign="right" width={1}>
        <Popup
          className={css.popupCommmon}
          trigger={
            <div className={css.iconList}>
              <Icon name="list ul" color="grey" className={css.iconListItem} />
            </div>
          }
          content={_l`Drag & Drop`}
        />
      </Grid.Column>
      <Grid.Column className={css.itemView} textAlign="right" width={1}>
        <Popup
          className={css.popupCommmon}
          trigger={<Button onClick={() => removeItem(item)} icon="close" size="mini" circular compact />}
          content={_l`Delete`}
        />
      </Grid.Column>
    </Grid>
  );
};

export default memo(ItemDropdown);
