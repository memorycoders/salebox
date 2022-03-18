import React, { useCallback, memo } from 'react';
import { Grid, Input } from 'semantic-ui-react';

import css from './targets.css';

const ItemInputTarget = ({ value, type, updateField }: any) => {
  const onChange = useCallback(
    (_, data) => {
      updateField({ [type]: Number(data.value) });
    },
    [updateField, type]
  );

  return (
    <Grid.Column textAlign="center">
      <Input value={value} onChange={onChange} className={css.itemInput} type="number" size="small" />
    </Grid.Column>
  );
};

export default memo(ItemInputTarget);
