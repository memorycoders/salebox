//@flow
import * as React from 'react';
import _l from 'lib/i18n';
import { compose, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import * as OverviewActions from 'components/Overview/overview.actions';
import { isHighlightAction, getHighlighted } from 'components/Overview/overview.selectors';
import { setUnqualifiedDone } from '../unqualifiedDeal.actions';
import ModalCommon from '../../ModalCommon/ModalCommon';
import { getUnqualified } from '../unqualifiedDeal.selector';
import { withRouter } from 'react-router';
import {  OverviewTypes } from 'Constants';

type PropsT = {
  visible: boolean,
  onClose: () => void,
  onSave: () => void,
};

addTranslations({
  'en-US': {
    Confirm: 'Confirm',
    No: 'No',
    Yes: 'Yes',
    'Do you really want to set this unqualified deal as done?':
      'Do you really want to set this unqualified deal as done?',
  },
});

const SetToDoneModal = ({ visible, onClose, onSave }: PropsT) => {
  return (
    <ModalCommon
      title={_l`Confirm`}
      visible={visible}
      onDone={onSave}
      onClose={onClose}
      size="tiny"
      paddingAsHeader={true}
    >
      <p>{_l`Do you really want to mark this as done?`}</p>
    </ModalCommon>
  );
};

const makeMapStateToProps = () => {
  const mapStateToProps = (state, { overviewType }) => {
    const visible = isHighlightAction(state, overviewType, 'set');
    const highlightedId = getHighlighted(state, overviewType);
    const unqualified = getUnqualified(state, highlightedId);
    return {
      visible,
      unqualified: unqualified || {uuid: highlightedId} ,
    };
  };
  return mapStateToProps;
};
export default compose(
  withRouter,
  connect(
    makeMapStateToProps,
    {
      clearHighlight: OverviewActions.clearHighlightAction,
      setUnqualifiedDone,
    }
  ),
  withHandlers({
    onClose: ({ clearHighlight, overviewType, task }) => () => {
      clearHighlight(overviewType);
    },
    onSave: ({ unqualified, overviewType, setUnqualifiedDone, history }) => () => {
      let path = window.location.pathname;
      let uuid = path.slice('/pipeline/leads'.length + 1);
      setUnqualifiedDone(overviewType, unqualified.uuid);
      if (overviewType != OverviewTypes.Account_Unqualified &&
        overviewType != OverviewTypes.Contact_Unqualified) {
        if (uuid === unqualified.uuid) {
          history.push(`/pipeline/leads`);
        }
      }
    },
  })
)(SetToDoneModal);
