/* eslint-disable react/prop-types */
//@flow
import * as React from 'react';
import { Transition, Modal, Button } from 'semantic-ui-react';
import _l from 'lib/i18n';
import { compose, lifecycle, withHandlers, withState } from 'recompose';
import { connect } from 'react-redux';
import ModalCommon from '../../ModalCommon/ModalCommon';
import * as OverviewActions from 'components/Overview/overview.actions';
import { isHighlightAction, getHighlighted } from 'components/Overview/overview.selectors';
import * as TaskActions from 'components/Task/task.actions';
import css from '../ConnectQualifiedDealModal/ConnectQuanlifiedDeal.css';
import { ObjectTypes } from 'Constants';
import { getProspectsByContactTask } from 'components/Prospect/prospect.selector';

type PropsT = {
  task: {},
  visible: boolean,
  hideForm: () => void,
  onSave?: () => void,
};

addTranslations({
  'en-US': {
    'Qualified': 'Qualified',
    Cancel: 'Cancel',
  },
});

const ConnectQualifiedDealModal = ({ visible, hideForm, onSave, prospects, connectQualified }: PropsT) => {
  return (
    <ModalCommon
      title={_l`Deals`}
      visible={visible}
      onDone={onSave}
      onClose={hideForm}
      size="small"
      yesLabel={_l`Add deal`}
      cancelHidden={true}
    >
      <>

        {prospects.map((item) => {
          return (
            <div key={item.uuid} onClick={() => connectQualified(item)} className={css.row}>{item.description}</div>
          )
        })}
      </>
    </ModalCommon>
  );
};

const makeMapStateToProps = () => {

  const mapStateToProps = (state, { overviewType, task }) => {
    const visible = isHighlightAction(state, overviewType, 'connectQualifiedDeal');
    const highlightedId = getHighlighted(state, overviewType);
    return {
      prospects: getProspectsByContactTask(state),
      visible,
    };
  };
  return mapStateToProps;
};

export default compose(
  connect(makeMapStateToProps, {
    clearHighlight: OverviewActions.clearHighlightAction,
    connectQualifiedDeal: TaskActions.connectQualifiedDeal,
    updateTaskConnectToOpportunity: TaskActions.updateTaskConnectToOpportunity,
  }),

  lifecycle({
    componentDidMount() {

    },
    componentWillReceiveProps(nextProps) {//fix not render when change props

    }
  }),
  withHandlers({
    hideForm: ({ clearHighlight, overviewType }) => () => {
      clearHighlight(overviewType);
    },
    onSave: ({ task, connectQualifiedDeal, overviewType, owner }) => () => {
      connectQualifiedDeal(owner, task.uuid, overviewType);
    },

    connectQualified: (props) => (item) => {
      // props.setOnwer(data);
      let owner_id = props.task.ownerId;
      let taskDTO = {
        uuid: props.task.uuid ? props.task.uuid : null,
        dateAndTime: props.task.dateAndTime,
        organisationId: props.task.organisationId ? props.task.organisation.uuid : null,
        prospectId: item.uuid,
        ownerId: owner_id,
        note: props.task.note,
        contactId: props.task.contact != null ? props.task.contact.uuid : null,
        type: 'MANUAL',
        categoryId: props.task.categoryId,
        focusWorkData: props.task.focusWorkData ? { uuid: props.task.focusWorkData.uuid } : null,
        focusActivity: props.task.focusActivity ? { uuid: props.task.focusActivity.uuid } : null,
      };
      props.updateTaskConnectToOpportunity(taskDTO);

    },
  })
)(ConnectQualifiedDealModal);
