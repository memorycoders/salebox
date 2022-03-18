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
// import { deleteRow } from '../qualifiedDeal.actions';
import { withRouter } from 'react-router';
import { getRulePackage } from '../../Auth/auth.selector';
import * as OrganisationActions from 'components/Organisation/organisation.actions';

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
    'Do you want to delete all these ?': 'Do you want to delete all these ?',
  },
});

const ConfirmDeactivateAllModal = ({ visible, onClose, onSave, rulePackage }: PropsT) => {
  return (
    <ModalCommon
      title={_l`Confirm`}
      visible={visible}
      onDone={onSave}
      onClose={onClose}
      size="tiny"
      paddingAsHeader={true}
    >
      <p>{_l`Do you want to delete all these ?`}</p>
      {/*{rulePackage != 'BASIC' ? <p>{_l`Do you want to delete all these ?`}</p> : <p>{_l`The order and active reminders will be removed`}</p>}*/}
    </ModalCommon>
  );
};

const makeMapStateToProps = () => {
  // const getUnqualifiedDeal = getQualified();
  const mapStateToProps = (state, { overviewType }) => {
    const visible = isHighlightAction(state, overviewType, 'deactivate_all');
    const highlightedId = getHighlighted(state, overviewType);
    // const qualifiedDeal = getQualified(state, highlightedId);
    const organisation = { uuid: highlightedId };
    return {
      visible,
      selectedObject: organisation,
      rulePackage: getRulePackage(state),
    };
  };
  return mapStateToProps;
};

export default compose(
  withRouter,
  connect(makeMapStateToProps, {
    clearHighlightAction: OverviewActions.clearHighlightAction,
    deactiveAll: OrganisationActions.deactivateAll,
  }),
  withHandlers({
    onClose: ({ clearHighlightAction, overviewType, selectedObject }) => () => {
      clearHighlightAction(overviewType);
    },
    onSave: ({ selectedObject, overviewType, deactiveAll }) => () => {
      // let path = window.location.pathname;
      //
      // let uuid = path.slice(currentPath.length + 1);
      deactiveAll(overviewType, selectedObject.uuid);
      // if (uuid === selectedObject.uuid && location.pathname!=currentPath) {
      //   history.push(currentPath);
      // }
    },
  })
)(ConfirmDeactivateAllModal);
