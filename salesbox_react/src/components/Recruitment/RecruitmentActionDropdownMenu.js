import React, { Component } from 'react';
import { connect } from 'react-redux';
import MoreMenu from 'components/MoreMenu/MoreMenu';
import { Menu, Icon } from 'semantic-ui-react';
import css from './RecruitmentListRow.css';
import editBtn from '../../../public/Edit.svg';
import user from '../../../public/user.svg';
import { highlight } from '../Overview/overview.actions';
import { OverviewTypes } from '../../Constants';

import _l from 'lib/i18n';

export const RecruitmentActionDropdownMenu = ({ currentRC, highlight, overviewType }) => {
  const onCopy = () => {
    highlight(overviewType, currentRC, 'copyRC');
  };
  // const { currentRC } = this.props
  const onDelete = () => {
    highlight(overviewType, currentRC, 'deleteRC');
  };

  return (
    <MoreMenu>
        <Menu.Item icon onClick={onCopy}>
          <div className={css.actionIcon}>
            {_l`Copy`}
            <Icon name="copy" color="grey" />
          </div>
        </Menu.Item>

      <Menu.Item icon onClick={onDelete}>
        <div className={css.actionIcon}>
          {_l`Delete`}
          <Icon name="trash alternate" color="grey" />
        </div>
      </Menu.Item>
    </MoreMenu>
  );
};

const mapStateToProps = (state) => ({
  currentRC: state.entities?.recruitment?.__COMMON_DATA?.currentRecruitmentCase,
});
const mapDispatchToProps = {
  highlight,
};

export default connect(mapStateToProps, mapDispatchToProps)(RecruitmentActionDropdownMenu);
