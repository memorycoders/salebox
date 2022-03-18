import React, { memo, useMemo, useCallback } from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { Dropdown } from 'semantic-ui-react';

import { isUnitDTOListListByYear } from '../settings.selectors';

const DropdownFilter = ({ unitDTOList, setIdFilter, idFilter }: any) => {
  const optionsDropDown = useMemo(
    () => [
      { key: 1, text: 'Company', value: 'all' },
      ...unitDTOList.map((item) => ({ key: item.uuid, text: item.name, value: item.uuid })),
    ],
    [unitDTOList]
  );

  const onChangeDropDown = useCallback(
    (event, data) => {
      setIdFilter(data.value);
    },
    [setIdFilter]
  );

  return (
    <Dropdown defaultValue="all" value={idFilter} selection options={optionsDropDown} onChange={onChangeDropDown} />
  );
};

export default compose(
  memo,
  connect((state) => ({ unitDTOList: isUnitDTOListListByYear(state) }), {})
)(DropdownFilter);
