/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/prop-types */
import React from 'react';
import _l from 'lib/i18n';
import { connect } from 'react-redux';
import { clearHighlight } from '../../Overview/overview.actions';
import { isHighlightAction } from '../../Overview/overview.selectors';
import ModalCommon from '../../ModalCommon/ModalCommon';
import Percentage from '../CreateQualifiedForm/percentage';
import css from '../../Task/EditTaskModal/EditTaskModal.css';
import CreateOrderForm from '../CreateOrderForm';
import { createErros, createEntityFetch, changeTab, addOrder, clearCreateEntity } from '../qualifiedDeal.actions';
import { clear, create } from '../../OrderRow/order-row.actions';
import '../CreateQualifiedModal/styles.less';

addTranslations({
  'en-US': {
    save: 'Save',
    Copy: 'Copy',
    'Contact is required': 'Contact is required',
    'Description is required': 'Description is required',
    'Progress is required': 'Progress is required',
    Order: 'Order',
  },
});

class CopyOrderModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openPopup: false,
      message: '',
    };
  }

  hideEditForm = () => {
    const { overviewType } = this.props;
    this.props.clearCreateEntity('__ORDER_CREATE');
    this.props.clear();
    this.props.create();
    this.props.clearHighlight(overviewType);
  };

  onSave = async () => {
    this.onSaveOrder();
  };

  onSaveOrder = () => {
    const { order } = this.props;
    const { description, sponsorList, participantList } = order;
    if (!description) {
      this.props.createErros(
        {
          description: _l`Description is required`,
        },
        '__ORDER_ERRORS'
      );
    }
    if (!sponsorList || (sponsorList && sponsorList.length <= 0)) {
      this.props.createErros(
        {
          sponsorList: _l`Contact is required`,
        },
        '__ORDER_ERRORS'
      );
    }
    if (!participantList || (participantList && participantList.length <= 0)) {
      this.props.createErros(
        {
          participantList: _l`A responsbile is required`,
        },
        '__ORDER_ERRORS'
      );
    }
    if (sponsorList && sponsorList.length > 0 && description && participantList && participantList.length > 0) {
      this.props.addOrder(this.props.overviewType);
    }
  };

  onOpen = (participantList) => {
    this.setState({ openPopup: true, participantList });
  };

  onClosePercentage = () => {
    this.setState({ openPopup: false });
  };

  render() {
    const { visible, overviewType } = this.props;
    return (
      <React.Fragment>
        <ModalCommon
          title={_l`Copy`}
          visible={visible}
          onDone={this.onSave}
          onClose={this.hideEditForm}
          className={css.editTaskModal}
          okLabel={_l`save`}
          scrolling={false}
        >
          <CreateOrderForm formKey="__ORDER_CREATE" onOpen={this.onOpen} onClosePercentage={this.onClosePercentage} />
        </ModalCommon>
        <Percentage
          visible={this.state.openPopup}
          onClosePercentage={this.onClosePercentage}
          formKey="__CREATE"
          participantList={this.state.participantList}
        />
      </React.Fragment>
    );
  }
}
const mapStateToProps = (state, { overviewType }) => {
  const visible = isHighlightAction(state, overviewType, 'copyOrder');
  return {
    order: state.entities.qualifiedDeal.__ORDER_CREATE || {},
    user: state.auth.user,
    visible,
  };
};

export default connect(mapStateToProps, {
  clearHighlight,
  createErros,
  createEntityFetch,
  changeTab,
  addOrder,
  clearCreateEntity,
  clear,
  create,
})(CopyOrderModal);
