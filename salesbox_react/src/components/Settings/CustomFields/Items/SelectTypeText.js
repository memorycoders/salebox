import React, { useCallback, memo, useState } from 'react';
import { Grid, Divider, Button, Input } from 'semantic-ui-react';
import update from 'immer';
import _l from 'lib/i18n';
import css from '../customFields.css';

const SelectTypeText = ({ itemSelect, updateCustomFieldRequest, updateCustomField }: any) => {
  const [errorMaximum, setErrorMaximum] = useState(false);

  const onChangeInput = useCallback(
    (_, data) => {
      if (data.value.length < 7) {
        updateCustomField(
          update(itemSelect, (draf) => {
            draf.customFieldOptionDTO.maxLength = data.value !== null ? data.value : 20;
          })
        );
      }
    },
    [updateCustomField, itemSelect]
  );

  const onDone = () => {
    if(itemSelect.customFieldOptionDTO.maxLength > 2000) {
      setErrorMaximum(true);
    } else {
      setErrorMaximum(false);
      updateCustomFieldRequest();
    }
  }
  return (
    <Grid.Row className={css.viewHeaderSelectFiled}>
      <Grid.Column verticalAlign="middle" width={6}>
        <h5 className={css.textHeader}>{_l`Settings`}</h5>
      </Grid.Column>

      <Grid.Column width={16}>
        <Divider />
      </Grid.Column>

      <Grid.Column verticalAlign="middle" width={6}>
        <p className={css.textItemCustomField}>{_l`No. of characters`}</p>
      </Grid.Column>

      <Grid.Column width={10}>
        <Input
          type="number"
          value={itemSelect.customFieldOptionDTO.maxLength !== null ? itemSelect.customFieldOptionDTO.maxLength : 20}
          className={css.inputSelectField}
          transparent
          onChange={onChangeInput}
          maxLength={6}
          fluid
        />
      </Grid.Column>
      {
        errorMaximum && <Grid.Column width={16}><p style={{color: '#ed684e'}}>{_l`Maximum is 2000`}</p></Grid.Column>
      }
      <Grid.Column width={16} textAlign="center">
        <Button style={{ width: ' 150px !important' }} onClick={onDone} className={css.btnDone}>
          {_l`Done`}
        </Button>
      </Grid.Column>
    </Grid.Row>
  );
};

export default memo(SelectTypeText);
