//@flow
import * as React from 'react';
import { Message, Button, Form } from 'semantic-ui-react';
import _l from 'lib/i18n';
import { compose, withHandlers, withState, lifecycle } from 'recompose';
import { connect } from 'react-redux';
import * as OverviewActions from 'components/Overview/overview.actions';
import { isHighlightAction, getOverview } from 'components/Overview/overview.selectors';
import { CssNames, UIDefaults, OverviewTypes } from 'Constants';
import OrderRowOverview from './OrderRowOverview';
import * as OrderRowActions from './order-row.actions';
import { getOrderRows, getListOrderRows } from './order-row.selectors';
import OrderRowForm from './OrderRowForm';
import css from 'Common.css';
import orderRowCss from './OrderRow.css';
import ModalCommon from '../ModalCommon/ModalCommon';
import api from 'lib/apiClient';
import { Endpoints, RECURRING, REVENUETYPE } from '../../Constants';

type PropsT = {
  color: string,
  visible: boolean,
  hideEditForm: () => void,
  create: () => void,
  onSave?: () => void,
  rows: Array<string>,
};

addTranslations({
  'en-US': {
    'Add products': 'Add products',
    Cancel: 'Cancel',
    Save: 'Save',
    Add: 'Add',
    'Product is required': 'Product is required',
  },
});

const OrderRowModal = ({
  rows,
  color = CssNames.OrderRow,
  create,
  visible,
  hideEditForm,
  onSave,
  disabledColumns,
  error,
  overviewType,
  revenueType,
}: PropsT) => {
  const arrValues = Object.values(disabledColumns);
  const displayCount = arrValues.filter((x) => x === true).length;
  return (
    <ModalCommon
      title={_l`Add products`}
      visible={visible}
      onDone={onSave}
      onClose={hideEditForm}
      // className={css.editTaskModal}
      okLabel={_l`save`}
      scrolling={false}
      description={false}
      // size={displayCount === 0 || displayCount < 4 ? 'fullscreen' : 'large'}
    >
      <div className={orderRowCss.orderRow} style={{ overflowX: 'overlay' }} id="order-modal-form">
        <Form size="small" className="position-unset">
          {error && error.message && (
            <Message negative>
              <p>{error.message}</p>
            </Message>
          )}
          <OrderRowOverview revenueType={revenueType} rows={rows} overviewType={overviewType}>
            {rows.map((rowId) => (
              <OrderRowForm
                revenueType={revenueType}
                key={rowId}
                rowId={rowId}
                error={error && error.rowId === rowId}
                overviewType={overviewType}
              />
            ))}
          </OrderRowOverview>
        </Form>
      </div>
      <Button className={orderRowCss.btnAdd} onClick={create}>{_l`Add`}</Button>
    </ModalCommon>
  );
};

const makeMapStateToProps = () => {
  const mapStateToProps = (state, { overviewType }) => {
    const visible = isHighlightAction(state, overviewType, 'create');
    const overview = getOverview(state, overviewType);
    return {
      rows: getOrderRows(state),
      visible,
      listRow: getListOrderRows(state),
      disabledColumns: overview.disabledColumns || {},
    };
  };
  return mapStateToProps;
};

const mapDispatchToProps = {
  clearHighlight: OverviewActions.clearHighlight,
  create: OrderRowActions.create,
  updateDone: OrderRowActions.updateDone,
  clear: OrderRowActions.clear,
};

export default compose(
  connect(makeMapStateToProps, mapDispatchToProps),
  withState('error', 'setError', null),
  withHandlers({
    hideEditForm: ({ clearHighlight }) => () => {
      clearHighlight(OverviewTypes.OrderRow);
    },
    create: ({ create, listRow, setError }) => () => {
      let isError = false;
      listRow.map((r) => {
        if (!r.product) {
          isError = true;
          setError({ rowId: r.id, message: _l`Product is required` });
          return;
        }
      });
      if (!isError) {
        setError(null);
        create();
      }
    },
    onSave: ({ clearHighlight, updateDone, overviewType, listRow, setError }) => () => {
      let isError = false;
      listRow.map((r) => {
        if (!r.product) {
          isError = true;
          setError({ rowId: r.id, message: _l`Product is required` });
          return;
        }

        if (r.type === RECURRING && (!r.periodType || r.periodType === "")) {
          isError = true;
          setError({ rowId: r.id, message: _l`Period is required` });
          return;
        }
      });
      if (!isError) {
        setError(null);
        updateDone(overviewType, listRow, '__CREATE');
        clearHighlight(OverviewTypes.OrderRow);
      }
    },
  }),
  withState('revenueType', 'setRevenueType', REVENUETYPE.START_END),
  lifecycle({
    async componentWillReceiveProps(nextProps) {
      if (nextProps.visible !== this.props.visible && nextProps.visible === true) {
        try {
          const data = await api.get({
            resource: `${Endpoints.Administration}/workData/workData`,
          });
          if (data) {
            let type = data.workDataWorkDataDTOList?.find((e) => e.type === 'ORDER_ROW_TYPE');
            this.props.setRevenueType(type?.value);
          }
        } catch (error) {}
      }
    },
  })
)(OrderRowModal);
