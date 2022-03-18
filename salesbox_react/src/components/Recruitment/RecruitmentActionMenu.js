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

export const RecruitmentActionMenu = ({ candidate, highlight, overviewType }) => {
  const onEdit = () => {
    highlight(overviewType, candidate.uuid, 'updateCandidate', candidate);
  };
  const onUpdateResponsible = () => {
    highlight(overviewType, candidate.uuid, 'updateResponsibleCandiate', candidate);
  };
  const onCopy = () => {
    highlight(overviewType, candidate.uuid, 'copyCandidate', candidate);
  };
  const onDelete = () => {
    highlight(overviewType, candidate.uuid, 'deleteCandidate');
  };

  return (
    <MoreMenu>
      {overviewType === OverviewTypes.RecruitmentActive && (
        <Menu.Item icon onClick={onEdit}>
          <div className={css.actionIcon}>
            {_l`Update`}
            <img style={{ height: '13px', width: '20px' }} src={editBtn} />
          </div>
        </Menu.Item>
      )}

      <Menu.Item icon onClick={onUpdateResponsible}>
        <div className={css.actionIcon}>
          {_l`Update responsible`}
          <img style={{ height: '13px', width: '20px' }} src={user} />
        </div>
      </Menu.Item>
      {overviewType === OverviewTypes.RecruitmentActive && (
        <Menu.Item icon onClick={onCopy}>
          <div className={css.actionIcon}>
            {_l`Copy`}
            <Icon name="copy" color="grey" />
          </div>
        </Menu.Item>
      )}

      <Menu.Item icon onClick={onDelete}>
        <div className={css.actionIcon}>
          {_l`Delete`}
          <Icon name="trash alternate" color="grey" />
        </div>
      </Menu.Item>
    </MoreMenu>
  );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {
  highlight,
};

export default connect(mapStateToProps, mapDispatchToProps)(RecruitmentActionMenu);
