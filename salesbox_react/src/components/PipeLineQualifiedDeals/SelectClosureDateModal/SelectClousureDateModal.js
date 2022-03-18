//@flow

import React from 'react';
import { connect } from 'react-redux';
import ModalCommon from '../../ModalCommon/ModalCommon';
import _l from 'lib/i18n';
import * as OverviewActions from '../../Overview/overview.actions';
import { isHighlightAction, getTempDataQualifiedDeal, getHighlighted } from 'components/Overview/overview.selectors';
import { getQualified } from '../qualifiedDeal.selector';

addTranslations({
  'en-US': {
    Confirm: 'Confirm',
    TodayDate: "Today's Date",
    "Do you want to use today's date or contract date as closure date?":
      "Do you want to use today's date or contract date as closure date?",
  },
});

class SelectClosureDateModal extends React.Component {
  constructor(props) {
    super(props);
  }

  onDone = () => {
    const { overviewType, highlight, storeSelectedValue, tempData, qualifiedDeal } = this.props;
    storeSelectedValue(overviewType, { selectedWon: tempData.selectedWon, isUseToday: true });
    highlight(overviewType, qualifiedDeal.uuid, 'select_suggest_actions');
  };

  onClose = () => {
    const { overviewType, highlight, storeSelectedValue, tempData, qualifiedDeal } = this.props;
    storeSelectedValue(overviewType, { selectedWon: tempData.selectedWon, isUseToday: false });
    highlight(overviewType, qualifiedDeal.uuid, 'select_suggest_actions');
  };

  onClickIconClose = () => {
    const { overviewType, qualifiedDeal } = this.props;
    this.props.clearHighlight(overviewType, qualifiedDeal.uuid);
  };
  render() {
    const { visible } = this.props;
    return (
      <ModalCommon
        title={_l`Confirm`}
        visible={visible}
        okLabel={_l`Today's Date`}
        cancelLabel={_l`Next action`}
        onDone={this.onDone}
        onClose={this.onClose}
        scrolling={false}
        size="tiny"
        paddingAsHeader={true}
        closeOnDimmerClick={true}
        clickDimmerNotCallActionOnClose
        onClickIconClose={this.onClickIconClose}
      >
        <p>{_l`Do you want to use today's date or next action date as closure date ?`}</p>
      </ModalCommon>
    );
  }
}

const mapStateToProps = (state, { overviewType }) => {
  const visible = isHighlightAction(state, overviewType, 'select_closure_date');
  const tempData = getTempDataQualifiedDeal(state, overviewType);
  const highlightedId = getHighlighted(state, overviewType);
  const qualifiedDealFromState = getQualified(state, highlightedId);
  const qualifiedDeal = qualifiedDealFromState.uuid != null ? qualifiedDealFromState : { uuid: highlightedId };

  return {
    visible,
    tempData,
    qualifiedDeal,
  };
};
export default connect(mapStateToProps, {
  highlight: OverviewActions.highlight,
  clearHighlight: OverviewActions.clearHighlightAction,
  storeSelectedValue: OverviewActions.storeDataTemp,
})(SelectClosureDateModal);
