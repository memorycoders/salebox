import React, { memo, useState, useMemo, useCallback, useEffect } from 'react';
import moment from 'moment';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import _l from 'lib/i18n';
import ViewSales from './ViewSales';
import ViewActivity from './ViewActivity';
import * as SetingsActions from 'components/Settings/settings.actions';
import HeaderTargets from './HeaderTargets';
import { isUnitDTOListListByYear } from '../settings.selectors';

String.prototype.convertMoney = function() {
  return this.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
};

const Targets = ({ requestFetchTargetsSettings, unitDTOList }: any) => {
  const [yearCurrent, setYearCurrent] = useState(0);
  const [idFilter, setIdFilter] = useState('all');

  const startOfMonth = useMemo(
    () =>
      yearCurrent < 0
        ? moment()
            .startOf('year')
            .subtract('year', -yearCurrent)
            .format('ll')
        : moment()
            .startOf('year')
            .add('year', yearCurrent)
            .format('ll'),
    [yearCurrent]
  );

  const endOfMonth = useMemo(
    () =>
      yearCurrent < 0
        ? moment()
            .endOf('year')
            .subtract('year', -yearCurrent)
            .format('ll')
        : moment()
            .endOf('year')
            .add('year', yearCurrent)
            .format('ll'),
    [yearCurrent]
  );

  const minusYear = useCallback(() => {
    setYearCurrent(yearCurrent - 1);
  }, [yearCurrent]);

  const plusYear = useCallback(() => {
    setYearCurrent(yearCurrent + 1);
  }, [yearCurrent]);

  useEffect(() => {
    requestFetchTargetsSettings(moment().year() + yearCurrent);
  }, [requestFetchTargetsSettings, yearCurrent]);

  const onClickItem = useCallback((item) => {
    setIdFilter(item.value);
  }, []);

  return (
    <div style={{ backgroundColor: '#fff', height: 'auto' }}>
      <HeaderTargets
        options={unitDTOList}
        idFilter={idFilter}
        onClickPrev={minusYear}
        onClickNext={plusYear}
        onClickItem={onClickItem}
        time={_l`${startOfMonth} - ${endOfMonth}`}
      />

      <ViewSales idFilter={idFilter} setIdFilter={setIdFilter} />
      <ViewActivity idFilter={idFilter} setIdFilter={setIdFilter} />
    </div>
  );
};

export default compose(
  memo,
  connect((state) => ({ unitDTOList: isUnitDTOListListByYear(state) }), {
    requestFetchTargetsSettings: SetingsActions.requestFetchTargetsSettings,
  })
)(Targets);
