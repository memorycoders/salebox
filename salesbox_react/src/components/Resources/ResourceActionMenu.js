import React, { Component } from 'react';
import { connect } from 'react-redux';
import MoreMenu from 'components/MoreMenu/MoreMenu';
import { Menu, Icon } from 'semantic-ui-react';
import css from '../Recruitment/RecruitmentListRow.css';
import editBtn from '../../../public/Edit.svg';
import user from '../../../public/user.svg';
import { highlight } from '../Overview/overview.actions';
import _l from 'lib/i18n';

export const ResourceActionMenu = ({ candidate, highlight, overviewType }) => {
  const onAddDeal = () => {
    // highlight(overviewType, candidate.uuid, 'updateCandidate', candidate);
  };
  const onShareProfile = () => {
    // highlight(overviewType, candidate.uuid, 'updateResponsibleCandiate', candidate);
  };
  const onSendCV = () => {
    // highlight(overviewType, candidate.uuid, 'copyCandidate', candidate);
  };
  const onDelete = () => {
    // highlight(overviewType, candidate.uuid, 'deleteCandidate');
  };

  return (
    <MoreMenu>
      <Menu.Item icon onClick={onAddDeal}>
        <div className={css.actionIcon}>
          {_l`Add deal`}
          <img style={{ height: '13px', width: '20px' }} src={editBtn} />
        </div>
      </Menu.Item>

      <Menu.Item icon onClick={onShareProfile}>
        <div className={css.actionIcon}>
          {_l`Share profile`}
          <img style={{ height: '13px', width: '20px' }} src={user} />
        </div>
      </Menu.Item>
      <Menu.Item icon onClick={onSendCV}>
        <div className={css.actionIcon}>
          {_l`Send CV`}
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

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {
  highlight,
};

export default connect(mapStateToProps, mapDispatchToProps)(ResourceActionMenu);
