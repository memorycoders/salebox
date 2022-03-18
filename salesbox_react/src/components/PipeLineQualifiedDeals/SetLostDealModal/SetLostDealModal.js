//@flow

import React from 'react';
import { connect } from 'react-redux';
import ModalCommon from '../../ModalCommon/ModalCommon';
import _l from 'lib/i18n';
import * as OverviewActions from '../../Overview/overview.actions';
import { setLostDeal } from './../qualifiedDeal.actions';
import { isHighlightAction } from 'components/Overview/overview.selectors';
import { getQualified } from '../qualifiedDeal.selector';
import { getHighlighted } from '../../Overview/overview.selectors';
addTranslations({
  'en-US': {
    Confirm: 'Confirm',
    Yes: 'Yes',
    No: 'No',
  },
});

class SetLostDealModal extends React.Component {
  constructor(props) {
    super(props);
  }

  onDone = () => {
    const { highlight, overviewType, storeSelectedValue, qualifiedDeal } = this.props;
    storeSelectedValue(overviewType, { selectedWon: false });

    highlight(overviewType, qualifiedDeal.uuid, 'select_closure_date');
  };
  onClose = () => {
    const { clearHighlight, overviewType } = this.props;
    clearHighlight(overviewType);
  };

  render() {
    const { visible } = this.props;
    return (
      <ModalCommon
        title={_l`Confirm`}
        visible={visible}
        cancelLabel={_l`No`}
        okLabel={_l`Yes`}
        onDone={this.onDone}
        onClose={this.onClose}
        scrolling={false}
        size="tiny"
        paddingAsHeader={true}
      >
        <p>{_l`Do you really want to set this deal as lost ?`}</p>
      </ModalCommon>
    );
  }
}

const mapStateToProps = (state, { overviewType }) => {
  const visible = isHighlightAction(state, overviewType, 'set_lost_qualified_deal');
  const highlightedId = getHighlighted(state, overviewType);
  const qualifiedDealFromState = getQualified(state, highlightedId);
  // qualifiedDeal.uuid = highlightedId;
  const qualifiedDeal = qualifiedDealFromState.uuid != null ? qualifiedDealFromState : { uuid: highlightedId };
  return {
    visible,
    qualifiedDeal,
  };
};

export default connect(mapStateToProps, {
  clearHighlight: OverviewActions.clearHighlightAction,
  highlight: OverviewActions.highlight,
  storeSelectedValue: OverviewActions.storeDataTemp,
  setLostDeal,
})(SetLostDealModal);
