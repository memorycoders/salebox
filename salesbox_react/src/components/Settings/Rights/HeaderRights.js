import React, { Fragment, memo } from 'react';
import { Menu, Button, Icon } from 'semantic-ui-react';

import css from './PeriodSelector.css';
import MoreMenu from '../../MoreMenu/MoreMenu';
import _l from 'lib/i18n';

const HeaderRights = ({ options = [], onClickItem, idFilter, updateSettingsRights }) => {
  return (
    <Menu id="period" secondary borderless className={css.secondary}>
      <span className={css.title}>{_l`User rights`}</span>
      <Menu.Menu className={css.centerChild} position="right">
        <Fragment />
      </Menu.Menu>

      <Menu.Menu className={css.haveFilter} position="right">
        <Menu.Item className={`${css.rightIcon} ${css.mr5}`}>
          <MoreMenu filter position="bottom right">
            {[
              { key: 1, text: 'Company', value: 'all' },
              ...options.map((item) => ({ key: item.uuid, text: item.name == 'No Unit' || item.name == 'No unit' ? _l`No unit` : item.name, value: item.uuid })),
            ].map((item, index) => (
              <Menu.Item onClick={() => onClickItem(item)} key={index} className={css.itemDropdown} icon>
                <div>{item.text === 'No Unit' ? _l`No unit` : item.text}</div>
                {idFilter === item.value && <Icon name="check" />}
              </Menu.Item>
            ))}
          </MoreMenu>
        </Menu.Item>

        <Menu.Item>
          <Button onClick={updateSettingsRights} className={css.buttonSave}>
            {_l`Save`}
          </Button>
        </Menu.Item>
      </Menu.Menu>
    </Menu>
  );
};

export default memo(HeaderRights);
