//@flow
import * as React from 'react';
import { Container } from 'semantic-ui-react';
import _l from 'lib/i18n';
import { compose, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import * as OverviewActions from 'components/Overview/overview.actions';
import { isHighlightAction, getHighlighted } from 'components/Overview/overview.selectors';
import ModalCommon from '../../ModalCommon/ModalCommon';
// import { getQualified } from '../qualifiedDeal.selector';
import { deleteRow } from '../qualifiedDeal.actions';
import { withRouter } from 'react-router';
import { getRulePackage } from '../../Auth/auth.selector';

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

const DeleteOpportunityWithManyUsersConnectedModal = ({ visible, onClose, onSave }: PropsT) => {
  return (
    <ModalCommon
      title={_l`Confirm`}
      visible={visible}
      onDone={onSave}
      onClose={onClose}
      size="tiny"
      paddingAsHeader={true}
    >
      <p>{_l`The deal will be removed from your personal lists but active reminders and meetings will remain.`}</p>
    </ModalCommon>
  );
};

const makeMapStateToProps = () => {
  // const getUnqualifiedDeal = getQualified();
  const mapStateToProps = (state, { overviewType }) => {
    const visible = isHighlightAction(state, overviewType, 'delete_with_many_user');
    const highlightedId = getHighlighted(state, overviewType);
    // const qualifiedDeal = getQualified(state, highlightedId);
    const qualifiedDeal = { uuid: highlightedId };
    return {
      visible,
      selectedObject: qualifiedDeal,
      rulePackage: getRulePackage(state),
    };
  };
  return mapStateToProps;
};

export default compose(
  withRouter,
  connect(makeMapStateToProps, {
    clearHighlightAction: OverviewActions.clearHighlightAction,
    removeUserFromOppTeam: deleteRow,
  }),
  withHandlers({
    onClose: ({ clearHighlightAction, overviewType, selectedObject }) => () => {
      clearHighlightAction(overviewType);
    },
    onSave: ({
      selectedObject,
      overviewType,
      removeUserFromOppTeam,
      history,
      currentPath = '/pipeline/overview',
      location,
    }) => () => {
      let path = window.location.pathname;
      let uuid = path.slice(currentPath.length + 1);
      removeUserFromOppTeam(overviewType, selectedObject.uuid, true);
      if (uuid === selectedObject.uuid && location.pathname != currentPath) {
        history.push(currentPath);
      }
    },
  })
)(DeleteOpportunityWithManyUsersConnectedModal);
