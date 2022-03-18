import React from 'react';
import { Menu, Button, Icon } from 'semantic-ui-react';
import classNames from 'classnames';

import css from './PeriodSelector.css';
import MoreMenu from '../../MoreMenu/MoreMenu';
import _l from 'lib/i18n';

const HeaderTargets = ({ onClickPrev, onClickNext, time, options, onClickItem, idFilter }) => {
  return (
    <Menu id="period" secondary borderless className={css.secondary}>
      <span className={css.title}>{_l`Targets`}</span>
      <Menu.Menu className={css.centerChild} position="right">
        <Menu.Menu className={css.singleLine}>
          <Menu.Item className={css.classMrB0}>
            <Button.Group size="small">
              <Button className={css.chevron} onClick={onClickPrev} icon="chevron left" />
            </Button.Group>
          </Menu.Item>
          <Menu.Item position="right" className={css.period}>
            {time}
          </Menu.Item>
          <Menu.Item className={css.classMrB0}>
            <Button.Group size="small">
              <Button className={css.chevron} onClick={onClickNext} icon="chevron right" />
            </Button.Group>
          </Menu.Item>
        </Menu.Menu>

        <Menu.Menu className={css.periods}>
          <Menu.Item fitted>
            <Button.Group>
              <Button className={classNames(css.buttonYear)}>{_l`Year`}</Button>
            </Button.Group>
          </Menu.Item>
        </Menu.Menu>
      </Menu.Menu>

      <Menu.Menu className={css.haveFilter} position="right">
        <Menu.Item className={`${css.rightIcon} ${css.mr5}`}>
          <MoreMenu filter position="bottom right">
            {[
              { key: 1, text: _l`Company`, value: 'all' },
              ...options.map((item) => ({ key: item.uuid, text: item.name, value: item.uuid })),
            ].map((item, index) => (
              <Menu.Item onClick={() => onClickItem(item)} key={index} className={css.itemDropdown} icon>
                <div>{item.text}</div>
                {idFilter === item.value && <Icon name="check" />}
              </Menu.Item>
            ))}
          </MoreMenu>
        </Menu.Item>
      </Menu.Menu>
    </Menu>
  );
};

export default HeaderTargets;
