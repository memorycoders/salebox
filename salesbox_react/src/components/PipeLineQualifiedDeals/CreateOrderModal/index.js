/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/prop-types */
import React from 'react';
import _l from 'lib/i18n';
import { connect } from 'react-redux';
import { clearHighlight } from '../../Overview/overview.actions';
import { isHighlightAction, getHighlighted, getItemSelected } from '../../Overview/overview.selectors';
import ModalCommon from '../../ModalCommon/ModalCommon';
import Percentage from '../CreateQualifiedForm/percentage';
import css from '../../Task/EditTaskModal/EditTaskModal.css';
import CreateOrderForm from '../CreateOrderForm';
import { createErros, createEntityFetch, changeTab, addOrder, clearCreateEntity } from '../qualifiedDeal.actions';
import { clear, create } from '../../OrderRow/order-row.actions';
import '../CreateQualifiedModal/styles.less';
import { makeGetUnqualifiedDeal } from '../../PipeLineUnqualifiedDeals/unqualifiedDeal.selector';
import { OverviewTypes, ObjectTypes } from 'Constants';
import { changeOnMultiMenu } from '../../Contact/contact.actions';
import { getCustomFieldsObject } from '../../CustomField/custom-field.selectors';

addTranslations({
  'en-US': {
    save: 'Save',
    'Add order': 'Add order',
    'Contact is required': 'Contact is required',
    'Description is required': 'Description is required',
    'Progress is required': 'Progress is required',
    Order: 'Order',
    'Convert to order': 'Convert to order',
    'Cannot add order without order rows': 'Cannot add order without order rows',
  },
});

class CreateOrderModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openPopup: false,
      message: '',
    };
  }

  hideEditForm = () => {
    const { overviewType, unqualifiedDeal } = this.props;
    this.props.clearCreateEntity('__ORDER_CREATE');
    this.props.clear();
    this.props.create();
    this.props.clearHighlight(overviewType, unqualifiedDeal.uuid);
  };

  onSave = async () => {
    this.onSaveOrder();
  };

  onSaveOrder = () => {
    const { order } = this.props;
    const { description, sponsorList, participantList, orderRowCustomFieldDTOList } = order;
    if (!description) {
      this.props.createErros(
        {
          description: _l`Description is required`,
        },
        '__ORDER_ERRORS'
      );
    }
    if (
      (this.props.overviewType !== 'CONTACT_ORDER_MULTI' && !sponsorList) ||
      (sponsorList && sponsorList.length <= 0)
    ) {
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
    // if (!orderRowCustomFieldDTOList || (orderRowCustomFieldDTOList && orderRowCustomFieldDTOList.length <=0 )) {
    //   this.props.createErros(
    //     {
    //       product: _l`Cannot add order without order rows`,
    //     },
    //     '__ORDER_ERRORS'
    //   );
    // }
    if (this.props.overviewType !== 'CONTACT_ORDER_MULTI') {
      if (
        sponsorList &&
        sponsorList.length > 0 &&
        description &&
        participantList &&
        participantList.length > 0
        // &&
        // orderRowCustomFieldDTOList &&
        // orderRowCustomFieldDTOList.length > 0
      ) {
        this.props.addOrder(this.props.overviewType);
      }
    } else {
      if (
        description &&
        participantList &&
        participantList.length > 0
        // &&
        // orderRowCustomFieldDTOList &&
        // orderRowCustomFieldDTOList.length
      ) {
        this.props.changeOnMultiMenu('contact_order_multi', {}, OverviewTypes.Contact);
      }
    }
  };

  onOpen = (participantList) => {
    this.setState({ openPopup: true, participantList });
  };

  onClosePercentage = () => {
    this.setState({ openPopup: false });
  };

  render() {
    const { visible, overviewType, unqualifiedDeal, customField} = this.props;
    return (
      <React.Fragment>
        <ModalCommon
          title={unqualifiedDeal && unqualifiedDeal.uuid ? _l`Convert to order` : _l`Add order`}
          visible={visible}
          onDone={this.onSave}
          onClose={this.hideEditForm}
          className={customField.length > 0 ? css.modalCustomField : css.editTaskModal}
          okLabel={_l`save`}
          scrolling={true}
        >
          <CreateOrderForm
            formKey="__ORDER_CREATE"
            onOpen={this.onOpen}
            onClosePercentage={this.onClosePercentage}
            unqualifiedDeal={unqualifiedDeal}
            overviewType={this.props.overviewType}
          />
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

const makeMapStateToProps = () => {
  const getUnqualifiedDeal = makeGetUnqualifiedDeal();
  const mapStateToProps = (state, { overviewType }) => {
    const visible = isHighlightAction(state, overviewType, 'create');
    const highlightedId = getHighlighted(state, overviewType);
    const customField = getCustomFieldsObject(state);
    let unqualifiedDeal = getUnqualifiedDeal(state, highlightedId);
    if (overviewType == OverviewTypes.Account_Unqualified_Qualified) {
      unqualifiedDeal = getItemSelected(state, overviewType);
    }
    return {
      customField,
      order: state.entities.qualifiedDeal.__ORDER_CREATE || {},
      user: state.auth.user,
      visible,
      unqualifiedDeal: unqualifiedDeal,
    };
  };
  return mapStateToProps;
};

export default connect(makeMapStateToProps, {
  clearHighlight,
  createErros,
  createEntityFetch,
  changeTab,
  addOrder,
  clearCreateEntity,
  clear,
  create,
  changeOnMultiMenu,
})(CreateOrderModal);
