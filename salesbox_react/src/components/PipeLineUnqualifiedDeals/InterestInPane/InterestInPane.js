import React from 'react';
import Collapsible from '../../Collapsible/Collapsible';
import { WIDTH_DEFINE } from '../../../Constants';
import { Table } from 'semantic-ui-react';
import _l from 'lib/i18n';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import css from './InterestInPane.css';
import cx from 'classnames';

addTranslations({
  se: {
    '{0}': '{0}',
  },
  'en-US': {
    'Product group': 'Product group',
    Products: 'Products',
  },
});
const InterestInPane = ({ unqualifiedDeal }) => {
  const status = unqualifiedDeal.status;
  const groupName = unqualifiedDeal.lineOfBusiness.name;
  const products = unqualifiedDeal.productList.map((e) => e.name).toString();

  let color;
  if (status === 'unqualified') {
    color = '#F4B24E';
  } else if (status === 'qualified') {
    color = '#AACD40';
  }
  return (
    <Collapsible hasDragable width={WIDTH_DEFINE.DETAIL_WIDTH_CONTENT} padded title={_l`Interested in`}>
      <Table className={css.interestTable} compact>
        {status && <div style={{ backgroundColor: color }} className={cx(css.focusLine)} />}

        <Table.Body>
          {groupName && (
            <Table.Row>
              <Table.Cell width="7">{_l`Product group`}</Table.Cell>
              <Table.Cell className={css.textBold}>{_l`${groupName}`}</Table.Cell>
            </Table.Row>
          )}
          {products && (
            <Table.Row>
              <Table.Cell>{_l`Products`}</Table.Cell>
              <Table.Cell className={css.textBold}>{`${products}`}</Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>
    </Collapsible>
  );
};

export default compose(connect())(InterestInPane);
