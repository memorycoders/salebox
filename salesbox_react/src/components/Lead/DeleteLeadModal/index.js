//@flow
import * as React from 'react';
import _l from 'lib/i18n';
import { compose, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import * as OverviewActions from 'components/Overview/overview.actions';
import { isHighlightAction, getHighlighted } from 'components/Overview/overview.selectors';
import ModalCommon from '../../ModalCommon/ModalCommon';
import { makeGetLead } from '../../Lead/lead.selector';
import { deleteLead } from '../lead.actions';

type PropsT = {
  visible: boolean,
  onClose: () => void,
  onSave?: () => void,
};

addTranslations({
  'en-US': {
    Confirm: 'Confirm',
  },
});

const index = ({ visible, onClose, onSave }: PropsT) => {
  return (
    <ModalCommon
      title={_l`Confirm`}
      visible={visible}
      onDone={onSave}
      onClose={onClose}
      size="tiny"
      paddingAsHeader={true}
    >
      <p>{_l`The prospect, active reminders and meetings will be removed`}</p>
    </ModalCommon>
  );
};

const makeMapStateToProps = () => {
  const gerLead = makeGetLead();
  const mapStateToProps = (state, { overviewType }) => {
    const visible = isHighlightAction(state, overviewType, 'delete');
    const highlightedId = getHighlighted(state, overviewType);
    return {
      visible,
      lead: gerLead(state, highlightedId),
    };
  };
  return mapStateToProps;
};

export default compose(
  connect(makeMapStateToProps, {
    clearHighlightAction: OverviewActions.clearHighlightAction,
    deleteLead,
  }),
  withHandlers({
    onClose: ({ clearHighlightAction, overviewType, lead }) => () => {
      clearHighlightAction(overviewType, lead.uuid);
    },
    onSave: ({ lead, overviewType, deleteLead }) => () => {
      deleteLead(overviewType, lead.uuid);
    },
  })
)(index);
