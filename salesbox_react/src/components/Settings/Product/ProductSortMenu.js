import React from 'react';
import { Menu, Icon } from 'semantic-ui-react';

import MoreMenu from 'components/MoreMenu/MoreMenu';

import { PRODUCT_SORT_ITEMS } from '../../../Constants';
import css from './index.css';
import _l from 'lib/i18n';

const ProductSortMenu = ({ sortAction, sortKey }: any) => {
  return (
    <MoreMenu filter className={css.bgMore} color="task">
      {PRODUCT_SORT_ITEMS.map((item) => (
        <Menu.Item key={item.key} onClick={() => sortAction(item.key)} icon>
          <div className={css.actionIcon}>
            {_l.call(this, [item.label])}
            {sortKey === item.key && <Icon name="checkmark" color="grey" />}
          </div>
        </Menu.Item>
      ))}
    </MoreMenu>
  );
};

export default React.memo(ProductSortMenu);
