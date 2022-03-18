/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/prop-types */
import React from 'react';
import _l from 'lib/i18n';
import { connect } from 'react-redux';
import { Button, Form, Message } from 'semantic-ui-react';
import { clearHighlight } from '../../Overview/overview.actions';
import { isHighlightAction } from '../../Overview/overview.selectors';
import ModalCommon from '../../ModalCommon/ModalCommon';
import { getOrderRows, getListOrderRows } from '../order-row.selectors';
import { clear, create, addOrderRow, updateList } from '../../OrderRow/order-row.actions';
import orderRowCss from '../OrderRow.css';
import OrderRowOverview from '../OrderRowOverview';
import OrderRowForm from '../OrderRowForm';
import api from 'lib/apiClient';
import { Endpoints, RECURRING, REVENUETYPE } from '../../../Constants';

addTranslations({
  'en-US': {
    save: 'Save',
    'Updated products': 'Updated products',
    'Product is required': 'Product is required',
  },
});

class EditOrderRowModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openPopup: false,
      error: null,
      revenueType: REVENUETYPE.START_END,
    };
  }

  hideEditForm = () => {
    const { overviewType } = this.props;
    this.props.clear();
    this.props.create();
    this.props.clearHighlight(overviewType);
  };

  onSave = async () => {
    const { listRow = [], overviewType } = this.props;
    let isError = false;
    listRow.map((r) => {
      if (!r.product) {
        isError = true;
        this.setState({ error: { rowId: r.id, message: _l`Product is required` } });
        return;
      }
      if (r.type === RECURRING && (!r.periodType || r.periodType === "")) {
        isError = true;
        this.setState({ error: { rowId: r.id, message: _l`Period is required` }});
        return;
      }
    });
    if (!isError) {
      this.setState({ error: null });
      const obj = listRow.find((r) => {
        if (!r.uuid) return r;
      });
      obj && this.props.addOrderRow(obj, overviewType);
      const data = listRow
        .filter((f) => f.uuid)
        .map((item) => {
          const numberOfUnit = item.quantity;
          delete item.value;
          delete item.quantity;
          delete item.cost;
          delete item.profit;
          delete item.discountAmount;
          delete item.id;
          delete item.product;
          delete item.customFieldListDTO;
          return {
            listCustomFieldDTOs: item.listCustomFieldDTOs ? item.listCustomFieldDTOs : [],
            orderRowDTO: { ...item, numberOfUnit },
          };
        });
      setTimeout(() => {
        this.props.updateList(data, overviewType);
      }, 1000);
      this.props.clearHighlight(overviewType);
    }
  };

  async componentWillReceiveProps(nextProps) {
    if (nextProps.visible !== this.props.visible && nextProps.visible === true) {
      try {
        const data = await api.get({
          resource: `${Endpoints.Administration}/workData/workData`,
        });
        if (data) {
          let type = data.workDataWorkDataDTOList?.find((e) => e.type === 'ORDER_ROW_TYPE');
          this.setState({
            revenueType: type?.value,
          });
        }
      } catch (error) {}
    }
  }
  onOpen = (participantList) => {
    this.setState({ openPopup: true, participantList });
  };

  onClosePercentage = () => {
    this.setState({ openPopup: false });
  };

  create = () => {
    const { listRow = [], overviewType } = this.props;
    let isError = false;
    listRow.map((r) => {
      if (!r.product) {
        isError = true;
        this.setState({ error: { rowId: r.id, message: _l`Product is required` } });
        return;
      }
    });
    if (!isError) {
      this.setState({ error: null });
      const obj = listRow.find((r) => {
        if (!r.uuid) return r;
      });
      obj ? this.props.addOrderRow(obj, overviewType) : this.props.create();
    }
  };

  render() {
    const { visible, rows, overviewType } = this.props;
    const { error, revenueType } = this.state;
    return (
      <React.Fragment>
        <ModalCommon
          title={_l`Updated products`}
          visible={visible}
          onDone={this.onSave}
          onClose={this.hideEditForm}
          okLabel={_l`save`}
          scrolling={false}
          description={false}
        >
          <div className={orderRowCss.orderRow} style={{ overflowX: 'overlay' }} id="order-modal-edit">
            {error && error.message && (
              <Message negative>
                <p>{error.message}</p>
              </Message>
            )}
            <Form size="small" className="position-unset">
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
          <Button className={orderRowCss.btnAdd} onClick={this.create}>{_l`Add`}</Button>
        </ModalCommon>
      </React.Fragment>
    );
  }
}
const mapStateToProps = (state, { overviewType }) => {
  const visible = isHighlightAction(state, overviewType, 'editProducts');
  return {
    rows: getOrderRows(state),
    listRow: getListOrderRows(state),
    visible,
  };
};

export default connect(mapStateToProps, {
  clearHighlight,
  clear,
  create,
  addOrderRow,
  updateList,
})(EditOrderRowModal);
