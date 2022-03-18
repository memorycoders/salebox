//@flow
import * as React from 'react';
import { compose, withHandlers } from 'recompose';
import _l from 'lib/i18n';
import { connect } from 'react-redux';
import * as OverviewActions from 'components/Overview/overview.actions';
import { isHighlightAction, getHighlighted, getItemSelected } from 'components/Overview/overview.selectors';
// import * as TaskActions from 'components/Task/task.actions';
import * as UnqualifiedDealActions from 'components/PipeLineUnqualifiedDeals/unqualifiedDeal.actions';
import ModalCommon from 'components/ModalCommon/ModalCommon';
// import { makeGetTask } from '../task.selector';
import { makeGetUnqualifiedDeal } from '../unqualifiedDeal.selector';
import { ObjectTypes, OverviewTypes, Endpoints } from 'Constants';

type PropsT = {
  unqualifiedDeal: {},
  visible: boolean,
  onClose: () => void,
  onSave?: () => void,
};

addTranslations({
  'en-US': {
    Confirm: 'Confirm',
  },
});

const AcceptedDelegateModal = ({ visible, onClose, onSave }: PropsT) => {
  return (
    <ModalCommon title={_l`Confirm`} visible={visible} onClose={onClose} size="mini" onDone={onSave} paddingAsHeader={true}>
      <p>{_l`Are you sure you want to accept`}?</p>
    </ModalCommon>
  );
};

const makeMapStateToProps = () => {
  const getCurrentObject = makeGetUnqualifiedDeal();
  const mapStateToProps = (state, { overviewType }) => {
    const visible = isHighlightAction(state, overviewType, 'acceptedDelegate');
    const highlightedId = getHighlighted(state, overviewType);
    let unqualified = getCurrentObject(state, highlightedId);
    if (overviewType == OverviewTypes.Account_Unqualified || overviewType == OverviewTypes.Contact_Unqualified) {
      unqualified = getItemSelected(state, overviewType);
    }

    return {
      visible,
      unqualifiedDeal: {...unqualified,uuid: highlightedId},
    };
  };
  return mapStateToProps;
};

export default compose(
  connect(makeMapStateToProps, {
    clearHighlightAction: OverviewActions.clearHighlightAction,
    delegateAccept: UnqualifiedDealActions.delegateAccept,
  }),
  withHandlers({
    onClose: ({ clearHighlightAction, unqualifiedDeal, overviewType }) => () => {
      clearHighlightAction(overviewType);
    },
    onSave: ({ delegateAccept, unqualifiedDeal, overviewType }) => () => {
      delegateAccept(unqualifiedDeal.ownerId, unqualifiedDeal.uuid, overviewType, true);
    },
  })
)(AcceptedDelegateModal);
