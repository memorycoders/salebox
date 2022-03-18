/* eslint-disable react/prop-types */
//@flow
import * as React from 'react';
import { Transition, Modal, Button } from 'semantic-ui-react';
import _l from 'lib/i18n';
import { compose, withHandlers, withState } from 'recompose';
import { connect } from 'react-redux';
import DelegateForm from './DelegateForm';
import ModalCommon from '../../ModalCommon/ModalCommon';
import * as OverviewActions from 'components/Overview/overview.actions';
import { isHighlightAction, getHighlighted, getItemSelected } from 'components/Overview/overview.selectors';
import * as UnqualifiedDealActions from 'components/PipeLineUnqualifiedDeals/unqualifiedDeal.actions';
import { makeGetUnqualifiedDeal } from '../unqualifiedDeal.selector';
// import css from '../Delegation.css';
import { OverviewTypes } from '../../../Constants';

type PropsT = {
  unqualifiedDeal: {},
  visible: boolean,
  hideAssignForm: () => void,
  onSave?: () => void,
};

addTranslations({
  'en-US': {
    Delegate: 'Delegate',
    Cancel: 'Cancel',
    Done: 'Done',
  },
});

const DelegateModal = ({ unqualifiedDeal, visible, hideAssignForm, onSave, onChange }: PropsT) => {
  return (
    <ModalCommon
      title={_l`Delegate`}
      visible={visible}
      onDone={onSave}
      onClose={hideAssignForm}
      size="small"
      scrolling={false}
    >
      <DelegateForm unqualifiedDeal={unqualifiedDeal} onChange={onChange} />
    </ModalCommon>
  );
};

const makeMapStateToProps = () => {
  const getTask = makeGetUnqualifiedDeal();
  const mapStateToProps = (state, { overviewType }) => {
    const visible = isHighlightAction(state, overviewType, 'assignD');
    const highlightedId = getHighlighted(state, overviewType);
    let uq = getTask(state, highlightedId);
    if(overviewType != OverviewTypes.Pipeline.Lead){
      uq = getItemSelected(state,overviewType)
    }
    return {
      visible,
      unqualifiedDeal: uq,
    };
  };
  return mapStateToProps;
};

export default compose(
  connect(makeMapStateToProps, {
    clearHighlight: OverviewActions.clearHighlightAction,
    delegateUnqualified: UnqualifiedDealActions.delegateUnqualified,
  }),
  withState('owner', 'setOnwer', null),
  withHandlers({
    hideAssignForm: ({ clearHighlight, unqualifiedDeal, overviewType }) => () => {
      clearHighlight(overviewType, unqualifiedDeal.uuid);
    },
    onSave: ({ unqualifiedDeal, delegateUnqualified, overviewType, owner }) => () => {
      delegateUnqualified(owner, unqualifiedDeal.uuid, overviewType);
    },
    onChange: (props) => (data) => {
      props.setOnwer(data);
    },
  })
)(DelegateModal);
