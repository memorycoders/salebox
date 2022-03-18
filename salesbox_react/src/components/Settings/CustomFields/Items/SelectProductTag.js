import React, { Fragment, useCallback, memo } from 'react';
import { Grid, Divider, Button } from 'semantic-ui-react';
import update from 'immer';
import last from 'lodash/last';

import css from '../customFields.css';
import _l from 'lib/i18n';

const SelectProductTag = ({ itemSelect, updateCustomFieldRequest, updateCustomField }: any) => {
  const changeCheckItem = useCallback(
    (item) => {
      updateCustomField(
        update(itemSelect, (draf) => {
          const customFieldOptionValueDTOList = draf.customFieldOptionDTO.customFieldOptionValueDTOList;
          const listActive = customFieldOptionValueDTOList.filter((i) => !!i.active);
          const lastItemActive = last(listActive);

          if (listActive.length === 1 && lastItemActive.uuid === item.uuid) {
            return;
          }

          const findItem = customFieldOptionValueDTOList.findIndex((i) => i.uuid === item.uuid);
          if (findItem !== -1) customFieldOptionValueDTOList[findItem].active = !item.active;
        })
      );
    },
    [updateCustomField, itemSelect]
  );

  return (
    <Grid.Row className={css.viewHeaderSelectFiled}>
      <Grid.Column verticalAlign="middle" width={6}>
        <p style={{ fontWeight: 500 }}>{_l`Product tag value`}</p>
      </Grid.Column>
      <Grid.Column width={10}>
        <i>*{_l`You must select at least 1 option`}</i>
      </Grid.Column>

      <Grid.Column width={16}>
        <Divider />
      </Grid.Column>

      {itemSelect.customFieldOptionDTO.customFieldOptionValueDTOList && itemSelect.customFieldOptionDTO.customFieldOptionValueDTOList.map((item, index) => (
        <Fragment key={index}>
          <Grid.Column width={2}>
            <div onClick={() => changeCheckItem(item)} className={css.reponsibleIconSize}>
              <div className={item.active ? css.setDone : css.notSetasDone}>
                <div />
              </div>
            </div>
          </Grid.Column>
          <Grid.Column verticalAlign="middle" width={14}>
            <p className={css.textItemCustomField}> {item.value}</p>
          </Grid.Column>
          <Grid.Column width={16}>
            <Divider className={css.dividerProductTag} />
          </Grid.Column>
        </Fragment>
      ))}

      <Grid.Column width={16} textAlign="center">
        <Button className={css.btnDone} onClick={updateCustomFieldRequest}>
          {_l`Done`}
        </Button>
      </Grid.Column>
    </Grid.Row>
  );
};

export default memo(SelectProductTag);
