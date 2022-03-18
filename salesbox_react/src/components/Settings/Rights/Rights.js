/* eslint-disable no-else-return */
import React, { useState, useCallback, useMemo } from 'react';
import { Grid, Divider } from 'semantic-ui-react';
import { compose } from 'recompose';

import css from './rights.css';
import ItemRight from './ItemRight';
import { connect } from 'react-redux';
import { isRightDTOList, isUnitDTOList } from '../settings.selectors';
import { updateSettingsRightsRequest } from '../settings.actions';
import HeaderRights from './HeaderRights';
import _l from 'lib/i18n';

const Rights = ({ rightDTOList, unitDTOList, updateSettingsRightsRequest }: any) => {
  const [idFilter, setIdFilter] = useState('all');

  const onClickItem = useCallback((item) => {
    setIdFilter(item.value);
  }, []);

  const dataRightDTOList = useMemo(() => {
    if (idFilter !== 'all') {
      return rightDTOList.filter((i) => i.unitId === idFilter);
    }

    return rightDTOList;
  }, [rightDTOList, idFilter]);

  const updateSettingsRights = useCallback(() => {
    updateSettingsRightsRequest();
  }, [updateSettingsRightsRequest]);

  return (
    <div style={{ backgroundColor: '#fff', height: '100%' }}>
      <HeaderRights
        options={unitDTOList}
        updateSettingsRights={updateSettingsRights}
        onClickItem={onClickItem}
        idFilter={idFilter}
      />
      <Divider className={css.dividerItem} />

      <Grid className={css.pageRights}>
        <Grid.Row columns={5} className={css.viewHeaderTitle}>
          <Grid.Column />
          <Grid.Column textAlign="center">
            <h5 className={css.textTitle}>{_l`All company`}</h5>
          </Grid.Column>
          <Grid.Column textAlign="center">
            <h5 className={css.textTitle}>{_l`Own unit`}</h5>
          </Grid.Column>
          <Grid.Column textAlign="center">
            <h5 className={css.textTitle}>{_l`Own object`}</h5>
          </Grid.Column>
          <Grid.Column textAlign="center">
            <h5 className={css.textTitle}>{_l`Admin`}</h5>
          </Grid.Column>
        </Grid.Row>

        {dataRightDTOList
          .filter((i) => !!i.active)
          .map((item, index) => (
            <ItemRight indexItemLast={dataRightDTOList.length - 1} index={index} rightItem={item} key={index} />
          ))}
      </Grid>
    </div>
  );
};

export default compose(
  connect((state) => ({ rightDTOList: isRightDTOList(state), unitDTOList: isUnitDTOList(state) }), {
    updateSettingsRightsRequest,
  })
)(Rights);
