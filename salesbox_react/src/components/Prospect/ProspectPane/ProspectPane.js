//@flow
import * as React from 'react';
import _l from 'lib/i18n';
import { Table } from 'semantic-ui-react';
import { withRouter } from 'react-router';
import moment from 'moment';
import { branch, renderNothing, compose, pure, withHandlers } from 'recompose';
import Collapsible from 'components/Collapsible/Collapsible';
import Deadline from 'components/Deadline/Deadline';
import CircularProgressBar from 'components/CircularProgressBar/CircularProgressBar';
import Thermometer from '../../Thermometer/Thermometer';
import { roundToTwoDecimals } from 'lib/math';
import css from './ProspectPane.css';
import { WIDTH_DEFINE } from '../../../Constants';
import ConnectQualifiedDealModal from '../../Task/ConnectQualifiedDealModal/ConnectQualifiedDealModal';
import * as TaskActions from 'components/Task/task.actions';
import connect from 'react-redux/es/connect/connect';
import { OverviewTypes } from 'Constants';
import * as OverviewActions from '../../Overview/overview.actions';
import { getListByContacts } from '../prospect.action';

type PropsT = {
  prospect: {},
};

addTranslations({
  se: {
    '{0}': '{0}',
  },
  'en-US': {
    '{0}': '{0}',
    Qualified: 'Qualified',
    'Order value': 'Order value',
    Profit: 'Profit',
    Margin: 'Margin',
    'Remaining work effort (h)': 'Remaining work effort (h)',
    'Days in pipe': 'Days in pipe',
    'Next action': 'Next action',
    Unqualified: 'Unqualified',
    'Product group': 'Product group',
    Products: 'Products',
  },
});

const Prospect = ({
  history,
  prospect,
  unQualified,
  task,
  showConnectQualifiedDealForm,
  hasShowConnect,
  route,
}: PropsT) => {
  const profit = prospect.profit !== undefined && prospect.profit !== null ? prospect.profit : null;
  const margin = prospect.margin !== undefined && prospect.margin !== null ? prospect.margin : null;
  const grossValue = prospect.grossValue !== undefined && prospect.grossValue !== null ? prospect.grossValue : null;
  const neededWorkEffort =
    prospect.neededWorkEffort !== undefined && prospect.neededWorkEffort !== null ? prospect.neededWorkEffort : null;
  const daysInPipeline =
    prospect.daysInPipeline !== undefined && prospect.daysInPipeline !== null ? prospect.daysInPipeline : null;
  const contractDate = prospect.contractDate ? prospect.contractDate : null;

  let focusWorkDataType = '';
  if (task.focusWorkData) {
    focusWorkDataType = task.focusWorkData.keyCode;
  }
  if (unQualified) {
    const { productList, lineOfBusiness, createdDate, priority } = unQualified;
    let products = productList.map((value) => value.name).toString();
    let groupName = lineOfBusiness ? lineOfBusiness.name : '';
    return (
      <Collapsible hasDragable width={WIDTH_DEFINE.DETAIL_WIDTH_CONTENT} padded title={_l`Prospect`}>
        <Table
          onClick={() => {
            history.push(`${route}/unqualified/${unQualified.uuid}`);
          }}
          className={css.prospectPaneTable}
          compact
        >
          <Table.Body>
            <Table.Row>
              <Table.Cell>{_l`Product group`}</Table.Cell>
              <Table.Cell className={css.textBold}>{_l`${groupName}:c`}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>{_l`Products`}</Table.Cell>
              <Table.Cell className={css.textBold}>{_l`${products}:c`}</Table.Cell>
            </Table.Row>
            {createdDate && (
              <Table.Row>
                <Table.Cell>{_l`Added`}</Table.Cell>
                <Table.Cell className={css.textBold}>
                  <Deadline className={css.textBold} date={createdDate} />
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
        <div className={css.progress}>
          <Thermometer unQualified={unQualified} degree={priority} />
        </div>
      </Collapsible>
    );
  }

  if (focusWorkDataType === 'IDENTIFY_LEAD_CONTACT' || focusWorkDataType === 'QUALIFY_LEAD') {
    return <div />;
  }
  if (!unQualified && prospect.uuid) {
    return (
      <Collapsible width={WIDTH_DEFINE.DETAIL_WIDTH_CONTENT} padded title={_l`Deal`}>
        {profit !== null ? (
          <>
            <Table
              onClick={() => {
                history.push(`${route}/qualified/${prospect.uuid}`);
                // history.push(`/activities/qualified-task/${prospect.uuid}`)
              }}
              className={css.prospectPaneTable}
              compact
            >
              <Table.Body>
                <Table.Row>
                  <Table.Cell colSpan={2}>
                    <strong>{prospect.description}</strong>
                  </Table.Cell>
                </Table.Row>
                {grossValue !== null && (
                  <Table.Row>
                    <Table.Cell>{_l`Order value`}</Table.Cell>
                    <Table.Cell>{_l`${grossValue}:c`}</Table.Cell>
                  </Table.Row>
                )}
                {profit !== null && (
                  <Table.Row>
                    <Table.Cell>{_l`{0}`}</Table.Cell>
                    <Table.Cell>{_l`${profit}:c`}</Table.Cell>
                  </Table.Row>
                )}
                {daysInPipeline !== null && (
                  <Table.Row>
                    <Table.Cell>{_l`Days in pipe`}</Table.Cell>
                    <Table.Cell>{_l`${roundToTwoDecimals(daysInPipeline)}:n`}</Table.Cell>
                  </Table.Row>
                )}
                {margin !== null && (
                  <Table.Row>
                    <Table.Cell>{_l`Margin`}</Table.Cell>
                    <Table.Cell>{_l`${prospect.margin}:p`}</Table.Cell>
                  </Table.Row>
                )}
                {neededWorkEffort !== null && (
                  <Table.Row>
                    <Table.Cell>{_l`Remaining work effort (h)`}</Table.Cell>
                    <Table.Cell>{_l`${roundToTwoDecimals(neededWorkEffort)}:n`}</Table.Cell>
                  </Table.Row>
                )}
                {contractDate && (
                  <Table.Row>
                    <Table.Cell>{_l`Next action`}</Table.Cell>
                    <Table.Cell>
                      <Deadline date={contractDate} onlyDate />
                    </Table.Cell>
                  </Table.Row>
                )}
              </Table.Body>
            </Table>
            {prospect.contractDate && (
              <div className={css.progress}>
                <CircularProgressBar color="#df5759" percentage={prospect.realProspectProgress} />
              </div>
            )}
          </>
        ) : (
          ''
        )}
      </Collapsible>
    );
  } else {
    if (hasShowConnect) {
      return <Collapsible width={WIDTH_DEFINE.DETAIL_WIDTH_CONTENT} padded title={_l`Qualified`}>
        <div className={css.prospectPanButton} size="small" onClick={showConnectQualifiedDealForm} fluid>{_l`Add a deal`}</div>
      </Collapsible>
    }
    return null;
  }
};

export default compose(
  withRouter,
  connect((state) => {}, {
    highlight: OverviewActions.highlight,
    getListByContacts: getListByContacts,
  }),
  pure,
  withHandlers({
    showConnectQualifiedDealForm: ({ overviewType, highlight, task, getListByContacts }) => (e) => {
      e.stopPropagation();
      highlight(overviewType, task.uuid, 'connectQualifiedDeal');
      const contactIdList = task.contactList ? task.contactList.map((value) => value.uuid) : [];
      getListByContacts(contactIdList);
    },
  })
)(Prospect);
