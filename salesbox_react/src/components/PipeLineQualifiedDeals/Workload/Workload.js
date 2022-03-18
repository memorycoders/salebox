//@flow
import * as React from 'react';
import _l from 'lib/i18n';
import { Table } from 'semantic-ui-react';
import Collapsible from 'components/Collapsible/Collapsible';
import css from './Workload.css';
import { WIDTH_DEFINE } from '../../../Constants';

addTranslations({
  se: {
    '{0}': '{0}',
  },
  'en-US': {
    'Remaining work effort (h)': 'Remaining work effort (h)',
    Workload: 'Workload',
  },
});

export const Workload = ({ data }: PropsT) => {
  return (
    <Collapsible width={WIDTH_DEFINE.DETAIL_WIDTH_CONTENT} padded title={_l`Workload`}>
      <Table className={css.paneTable} compact>
        <Table.Body>
          <Table.Row>
            <Table.Cell>{_l`Meetings left`}</Table.Cell>
            <Table.Cell>{data.numberMeetingLeft}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>{_l`Remaining work effort (h)`}</Table.Cell>
            <Table.Cell>{Math.ceil(data.neededWorkEffort)}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>{_l`Pipelines`}</Table.Cell>
            <Table.Cell>{data.salesMethodName}</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    </Collapsible>
  );
};
