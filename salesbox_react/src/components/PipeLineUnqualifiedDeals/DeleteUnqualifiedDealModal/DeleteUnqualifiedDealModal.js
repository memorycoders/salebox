//@flow
import * as React from 'react';
import { Container } from 'semantic-ui-react';
import _l from 'lib/i18n';
import { compose, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import * as OverviewActions from 'components/Overview/overview.actions';
import { isHighlightAction, getHighlighted } from 'components/Overview/overview.selectors';
import ModalCommon from '../../ModalCommon/ModalCommon';
import { makeGetUnqualifiedDeal } from '../unqualifiedDeal.selector';
import { deleteRow } from '../unqualifiedDeal.actions';
import { withRouter } from 'react-router';
import { ObjectTypes, OverviewTypes, Endpoints } from 'Constants';

type PropsT = {
  visible: boolean,
  onClose: () => void,
  onSave?: () => void,
};

addTranslations({
  'en-US': {
    Confirm: 'Confirm',
    No: 'No',
    Yes: 'Yes',
  },
});

const AssignUnqualifiedDealToMeModal = ({ visible, onClose, onSave }: PropsT) => {
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
  const getUnqualifiedDeal = makeGetUnqualifiedDeal();
  const mapStateToProps = (state, { overviewType }) => {
    const visible = isHighlightAction(state, overviewType, 'delete');
    const highlightedId = getHighlighted(state, overviewType);
    const unqualified = getUnqualifiedDeal(state, highlightedId);
    return {
      visible,
      unqualifiedDeal: { ...unqualified, uuid: highlightedId },
    };
  };
  return mapStateToProps;
};

export default compose(
  withRouter,
  connect(makeMapStateToProps, {
    clearHighlightAction: OverviewActions.clearHighlightAction,
    deleteUnqualifiedDeal: deleteRow,
  }),
  withHandlers({
    onClose: ({ clearHighlightAction, overviewType, unqualifiedDeal }) => () => {
      clearHighlightAction(overviewType);
    },
    onSave: ({ unqualifiedDeal, overviewType, deleteUnqualifiedDeal, history }) => () => {
      let path = window.location.pathname;
      let uuid = path.slice('/pipeline/leads'.length + 1);
      deleteUnqualifiedDeal(overviewType, unqualifiedDeal.uuid);
      if (overviewType == OverviewTypes.Pipeline.Lead && uuid === unqualifiedDeal.uuid) {
        history.push(`/pipeline/leads`);
      }
    },
  })
)(AssignUnqualifiedDealToMeModal);
