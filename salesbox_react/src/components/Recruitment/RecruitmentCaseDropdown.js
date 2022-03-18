import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Dropdown } from 'semantic-ui-react';
import { fetchListRC } from './recruitment.actions';
import { getListRCForDropdown } from './recruitment.selector';
import { OverviewTypes } from '../../Constants';
import _l from 'lib/i18n';

export const RecruitmentCaseDropdown = (props) => {
  const {
    overviewType,
    value,
    onChange,
    fetchListRC,
    recruitmentCases,
    overview,
    isDropdownInForm = true,
    ...other
  } = props;

  useEffect(() => {
    fetchListRC(isDropdownInForm);
  }, []);
  return (
    <Dropdown
      value={value}
      onChange={onChange}
      search
      options={
        overviewType === OverviewTypes.RecruitmentClosed && recruitmentCases
          ? [{ key: 'ALL', text: _l`All`, value: 'ALL' }, ...recruitmentCases]
          : recruitmentCases
      }
      selection
      {...other}
    />
  );
};

const mapStateToProps = (state, { overviewType }) => ({
  recruitmentCases: getListRCForDropdown(state, overviewType),
});

const mapDispatchToProps = { fetchListRC };

export default connect(mapStateToProps, mapDispatchToProps)(RecruitmentCaseDropdown);
