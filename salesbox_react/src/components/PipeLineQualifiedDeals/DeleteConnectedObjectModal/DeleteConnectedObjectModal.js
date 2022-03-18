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
import { removeConnectedObject } from '../qualifiedDeal.actions';
import { withRouter } from 'react-router';

type PropsT = {
  visible: boolean,
  onClose: () => void,
  onSave?: () => void,
};

addTranslations({
  'en-US': {
    'Confirm': 'Confirm',
    No: 'No',
    Yes: 'Yes',
    'Do you want to delete all these ?': 'Do you want to delete all these ?',
  },
});

const DeleteConnectedObjectModal = ({ visible, onClose, onSave }: PropsT) => {
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

    </ModalCommon>
  );
};

const makeMapStateToProps = () => {
  // const getUnqualifiedDeal = getQualified();
  const mapStateToProps = (state, { overviewType }) => {
    const visible = isHighlightAction(state, overviewType, 'delete_connect_object');
    const highlightedId = getHighlighted(state, overviewType);
    // const qualifiedDeal = getQualified(state, highlightedId);
    const qualifiedDeal = {uuid: highlightedId};

    return {
      visible,
      selectedObject: qualifiedDeal,
    };
  };
  return mapStateToProps;
};

export default compose(
  withRouter,
  connect(
    makeMapStateToProps,
    {
      clearHighlightAction: OverviewActions.clearHighlightAction,
      removeConnectedObject: removeConnectedObject,
    }
  ),
  withHandlers({
    onClose: ({ clearHighlightAction, overviewType, selectedObject }) => () => {
      clearHighlightAction(overviewType);
    },
    onSave: ({ selectedObject, overviewType, removeConnectedObject, history }) => () => {

      removeConnectedObject(overviewType, selectedObject.uuid, true);
    },
  })
)(DeleteConnectedObjectModal);
