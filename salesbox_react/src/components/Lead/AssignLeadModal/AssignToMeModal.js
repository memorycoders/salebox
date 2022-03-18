//@flow
import * as React from 'react';
import { Container } from 'semantic-ui-react';
import _l from 'lib/i18n';
import { compose, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import * as OverviewActions from 'components/Overview/overview.actions';
import { isHighlightAction, getHighlighted } from 'components/Overview/overview.selectors';
import { makeGetLead } from '../../Lead/lead.selector';

import ModalCommon from "../../ModalCommon/ModalCommon";
import * as LeadActions from '../lead.actions';

type PropsT = {
  task: {},
  visible: boolean,
  onClose: () => void,
  onSave?: () => void,
};

addTranslations({
  'en-US': {
    'Confirm': 'Confirm',
  },
});

const AssignToMeModal = ({ task, visible, onClose, onSave }: PropsT) => {
  return (
    <>
  <ModalCommon title={_l`Confirm`} visible={visible} onDone={onSave} onClose={onClose} size="tiny" paddingAsHeader={true}>
    <p>{_l`Are you sure you want to assign?`}</p>
  </ModalCommon>
    </>

);
};

const makeMapStateToProps = () => {
  const getUnqualifiedDeal = makeGetLead();
  const mapStateToProps = (state, { overviewType }) => {
    const visible = isHighlightAction(state, overviewType, 'assignToMe');
    const highlightedId = getHighlighted(state, overviewType);
    const unqualified =  getUnqualifiedDeal(state, highlightedId);

    return {
      visible,
      task: {...unqualified,uuid: highlightedId},
    };
  };
  return mapStateToProps;
};

export default compose(
  connect(
    makeMapStateToProps,
    {
      clearHighlight: OverviewActions.clearHighlightAction,
      assignToMe: LeadActions.assignToMe
    }
  ),
  withHandlers({
    onClose: ({ task, clearHighlight, overviewType }) => () => {
      clearHighlight(overviewType);
    },
    onSave: ({ task, overviewType, assignToMe }) => () => {
      assignToMe( task.uuid, overviewType,);
    },
  })
)(AssignToMeModal);
