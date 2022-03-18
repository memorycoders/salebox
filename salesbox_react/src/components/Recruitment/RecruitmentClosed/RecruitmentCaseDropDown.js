import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Dropdown } from 'semantic-ui-react';
import { fetchListRC } from '../recruitment.actions';
import { getListRCForDropdown } from '../recruitment.selector';
import AddDropdown from '../../AddDropdown/AddDropdown';

export const RecruitmentCaseDropdown = (props) => {
  const {
    value,
    onChange,
    fetchListRC,
    recruitmentCases,
    overview,
    addRecruitment,
    addLabel,
    onClickAdd,
    defaultValue,
    isDropdownInForm = true,
    ...other
  } = props;
  console.log('this.props', props);

  useEffect(() => {
    fetchListRC(isDropdownInForm);
  }, []);
  return (
    <AddDropdown
      addLabel={addLabel}
      search
      size="small"
      value={value}
      defaultValue={defaultValue}
      onClickAdd={onClickAdd}
      onChange={onChange}
      search
      options={recruitmentCases}
      selection
      {...other}
    />
  );
};

const mapStateToProps = (state) => ({
  recruitmentCases: getListRCForDropdown(state),
});

const mapDispatchToProps = { fetchListRC };

export default connect(mapStateToProps, mapDispatchToProps)(RecruitmentCaseDropdown);
