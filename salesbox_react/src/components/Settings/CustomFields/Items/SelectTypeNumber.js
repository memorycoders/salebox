import React, { Fragment, useCallback, memo, useState } from 'react';
import { Grid, Divider, Input, Button } from 'semantic-ui-react';
import update from 'immer';

import css from '../customFields.css';
import _l from 'lib/i18n';

const SelectTypeNumber = ({ itemSelect, updateCustomFieldRequest, updateCustomField }: any) => {
  const [showError, setShowError] = useState(false);

  const onChangeInput1 = useCallback(
    (_, data) => {
      if (data.value.length < 7) {
        updateCustomField(
          update(itemSelect, (draf) => {
            draf.customFieldOptionDTO.numberOfIntegers = data.value ? data.value : 6;
          })
        );
      }
    },
    [updateCustomField, itemSelect]
  );

  const onChangeInput2 = useCallback(
    (_, data) => {
      if (data.value.length < 7) {
        updateCustomField(
          update(itemSelect, (draf) => {
            draf.customFieldOptionDTO.numberOfDecimals = data.value ? data.value : 0;
          })
        );
      }
    },
    [updateCustomField, itemSelect]
  );

  const onClick = useCallback(() => {
    if (!itemSelect.customFieldOptionDTO.numberOfDecimals || !itemSelect.customFieldOptionDTO.numberOfIntegers) {
      setShowError(true);
    } else {
      setShowError(false);
      updateCustomFieldRequest();
    }
  }, [itemSelect, updateCustomFieldRequest]);

  return (
    <Grid.Row className={css.viewHeaderSelectFiled}>
      {/* <Grid.Column width={16}>{showError && <span className={css.error}>Title is required</span>}</Grid.Column> */}

      <Grid.Column verticalAlign="middle" width={6}>
        <p style={{ fontWeight: '500' }}>{_l`Settings`}</p>
      </Grid.Column>

      <Grid.Column width={16}>
        <Divider />
      </Grid.Column>

      <Fragment>
        <Grid.Column verticalAlign="middle" width={6}>
          <p className={css.textItemCustomField}>{_l`No. of integers`}</p>
        </Grid.Column>

        <Grid.Column width={10}>
          <Input
            type="number"
            onChange={onChangeInput1}
            value={itemSelect.customFieldOptionDTO.numberOfIntegers}
            className={css.inputSelectField}
            maxLength={6}
            transparent
            fluid
            error={showError}
          />
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider className={css.dividerProductTag} />
        </Grid.Column>
      </Fragment>

      <Fragment>
        <Grid.Column verticalAlign="middle" width={6}>
          <p className={css.textItemCustomField}>{_l`No. of decimals`}</p>
        </Grid.Column>

        <Grid.Column width={10}>
          <Input
            type="number"
            value={itemSelect.customFieldOptionDTO.numberOfDecimals}
            className={css.inputSelectField}
            maxLength={6}
            onChange={onChangeInput2}
            transparent
            fluid
            error={showError}
          />
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider className={css.dividerProductTag} />
        </Grid.Column>
      </Fragment>

      <Grid.Column width={16} textAlign="center">
        <Button className={css.btnDone} onClick={onClick}>
          {_l`Done`}
        </Button>
      </Grid.Column>
    </Grid.Row>
  );
};

export default memo(SelectTypeNumber);
