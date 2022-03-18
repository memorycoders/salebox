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
import CreateQualifiedForm from '../CreateQualifiedForm';
import { createErros, createEntityFetch, changeTab, addOrder, clearCreateEntity } from '../qualifiedDeal.actions';
import { clear, create } from '../../OrderRow/order-row.actions';
import './styles.less';
import { makeGetUnqualifiedDeal } from '../../PipeLineUnqualifiedDeals/unqualifiedDeal.selector';
import { OverviewTypes, ObjectTypes } from 'Constants';
import { changeOnMultiMenu } from '../../Contact/contact.actions';
import { getCustomFieldsObject } from '../../CustomField/custom-field.selectors';
import { setAddDealResource, setAddMultiDealResource } from '../../Resources/resources.actions';

addTranslations({
  'en-US': {
    save: 'Save',
    'Contact is required': 'Contact is required',
    'Description is required': 'Description is required',
    'Progress is required': 'Progress is required',
    Order: 'Order',
  },
});

class CreateQualifiedModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openPopup: false,
      message: '',
    };
  }

  hideEditForm = () => {
    const { overviewType } = this.props;
    this.props.clearCreateEntity();
    this.props.clear();
    this.props.create();
    this.props.clearHighlight(overviewType, this.props.unqualifiedDeal.uuid);
    this.props.setAddDealResource(false);
    this.props.setAddMultiDealResource(false);

  };

  onSave = async () => {
    this.onSaveQualified();
  };

  onSaveQualified = () => {
    const { form, types } = this.props;
    const { description, sponsorList, salesMethod, manualProgress, participantList } = form;
    if (!description) {
      this.props.createErros({
        description: _l`Description is required`,
      });
    }
    if (
      (this.props.overviewType !== 'CONTACT_QUALIFIED_MULTI' && !sponsorList) ||
      (sponsorList && sponsorList.length <= 0)
    ) {
      this.props.createErros({
        sponsorList: _l`Contact is required`,
      });
    }
    if (!participantList || (participantList && participantList.length <= 0)) {
      this.props.createErros({
        participantList: _l`A responsbile is required`,
      });
    }
    if (!salesMethod) {
      this.props.createErros({
        salesMethod: _l`Pipeline is required`,
      });
    }
    if (salesMethod && types[salesMethod.uuid] && types[salesMethod.uuid].manualProgress === 'ON' && !manualProgress) {
      return this.props.createErros({
        manualProgress: _l`Progress is required`,
      });
    }
    if (this.props.overviewType !== 'CONTACT_QUALIFIED_MULTI') {
      if (
        // manualProgress &&
        sponsorList &&
        sponsorList.length > 0 &&
        salesMethod &&
        description &&
        participantList &&
        participantList.length > 0
      ) {
        this.props.createEntityFetch(this.props.overviewType);
      }
    } else {
      if (
        // manualProgress &&
        salesMethod &&
        description &&
        participantList &&
        participantList.length > 0
      ) {
        this.props.changeOnMultiMenu('contact_qualified_multi', {}, OverviewTypes.Contact);
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
    const { visible, overviewType, unqualifiedDeal, customField } = this.props;
    return (
      <React.Fragment>
        <ModalCommon
          title={unqualifiedDeal && unqualifiedDeal.uuid !== '' ? _l`Convert to deal` : _l`Add deal`}
          visible={visible}
          onDone={this.onSave}
          onClose={this.hideEditForm}
          className={customField.length > 0 ? css.modalCustomField : css.editTaskModal}
          okLabel={_l`save`}
          scrolling={true}
        >
          <CreateQualifiedForm
            formKey="__CREATE"
            onOpen={this.onOpen}
            onClosePercentage={this.onClosePercentage}
            highlightAction="create"
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
      form: state.entities.qualifiedDeal.__CREATE || {},
      user: state.auth.user,
      visible,
      types: state.entities.salesMethod,
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
  setAddDealResource,
  setAddMultiDealResource
})(CreateQualifiedModal);
