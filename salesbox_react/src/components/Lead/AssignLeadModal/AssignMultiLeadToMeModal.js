//@flow
import * as React from 'react';
import _l from 'lib/i18n';
import { compose, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import * as OverviewActions from 'components/Overview/overview.actions';
import { isHighlightAction, getHighlighted } from 'components/Overview/overview.selectors';
import ModalCommon from '../../ModalCommon/ModalCommon';
import { changeOnMultiMenu } from '../../PipeLineUnqualifiedDeals/unqualifiedDeal.actions';
import { makeGetLead } from '../../Lead/lead.selector';

type PropsT = {
  lead: {},
  visible: boolean,
  onClose: () => void,
  onSave?: () => void,
};

addTranslations({
  'en-US': {
    Confirm: 'Confirm',
  },
});

const AssignMultiLeadToMeModal = ({ task, visible, onClose, onSave }: PropsT) => {
  return (
    <>
      <ModalCommon
        title={_l`Confirm`}
        visible={visible}
        onDone={onSave}
        onClose={onClose}
        size="tiny"
        paddingAsHeader={true}
      >
        <p>{_l`Are you sure you want to assign?`}</p>
      </ModalCommon>
    </>
  );
};

const makeMapStateToProps = () => {
  const getUnqualifiedDeal = makeGetLead();
  const mapStateToProps = (state, { overviewType }) => {
    const visible = isHighlightAction(state, overviewType, 'assignMultiUnqualifiedToMe');
    const highlightedId = getHighlighted(state, overviewType);
    return {
      visible,
      lead: getUnqualifiedDeal(state, highlightedId),
    };
  };
  return mapStateToProps;
};

export default compose(
  connect(
    makeMapStateToProps,
    {
      clearHighlight: OverviewActions.clearHighlightAction,
      changeOnMultiMenu: changeOnMultiMenu,
    }
  ),
  withHandlers({
    onClose: ({ clearHighlight, overviewType }) => () => {
      clearHighlight(overviewType);
    },
    onSave: ({ overviewType, changeOnMultiMenu }) => () => {
      changeOnMultiMenu('assign_multi_unqualified_to_me', null, overviewType);
    },
  })
)(AssignMultiLeadToMeModal);
