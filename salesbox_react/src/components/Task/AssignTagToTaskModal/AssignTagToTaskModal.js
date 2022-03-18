//@flow
import * as React from 'react';
import { Transition, Modal, Button, Form } from 'semantic-ui-react';
import _l from 'lib/i18n';
import { compose, withHandlers, withState, withProps, lifecycle } from 'recompose';
import { connect } from 'react-redux';
import * as TaskActions from 'components/Task/task.actions';
import * as OverviewActions from 'components/Overview/overview.actions';
import { isHighlightAction, getHighlighted } from 'components/Overview/overview.selectors';
import TagDropdown from 'components/Tag/TagDropdown';
import type { EventHandlerType } from 'types/semantic-ui.types';
import { FormPair } from 'components';
import { makeGetTask } from '../task.selector';
import ModalCommon from '../../ModalCommon/ModalCommon';
import css from '../Delegation.css';
import { getAuth } from '../../Auth/auth.selector';

type PropsT = {
  task: {},
  visible: boolean,
  hideAssignForm: () => void,
  onSave?: () => void,
  handleTagChange: EventHandlerType,
  tagId: string,
};

addTranslations({
  'en-US': {
    Tag: 'Tag',
    Cancel: 'Cancel',
    Save: 'Save',
  },
});
const AssignTagToTaskModal = ({ task, handleTagChange, visible, hideAssignForm, onSave, tagId }: PropsT) => {
  return (
    <ModalCommon
      title={_l`Tag`}
      visible={visible}
      cancelLabel={_l`Cancel`}
      okLabel={_l`Save`}
      onDone={onSave}
      onClose={hideAssignForm}
      size="tiny"
      scrolling={false}
      description={false}
    >
      <Form>
        <FormPair label={_l`Tag`} labelStyle={css.delegateFormLabel} left>
          <TagDropdown value={tagId ? tagId : task.tag.uuid} onChange={handleTagChange} />
        </FormPair>
      </Form>
    </ModalCommon>
    // <Transition unmountOnHide visible={visible} animation="fade down" duration={250}>
    //   <Modal open onClose={hideAssignForm} size="small" closeIcon>
    //     <Modal.Header className={css.purple}>{_l`Tag`}</Modal.Header>
    // <FormPair label={_l`Tag`}>
    //   <TagDropdown value={task.tag.uuid} onChange={handleTagChange} />
    // </FormPair>
    //     <Modal.Actions>
    //       <Button basic onClick={hideAssignForm}>{_l`Cancel`}</Button>
    //       <Button primary onClick={onSave}>{_l`Save`}</Button>
    //     </Modal.Actions>
    //   </Modal>
    // </Transition>
  );
};

const makeMapStateToProps = () => {
  const getTask = makeGetTask();
  const mapStateToProps = (state, { overviewType }) => {
    const visible = isHighlightAction(state, overviewType, 'tag');
    const highlightedId = getHighlighted(state, overviewType);
    return {
      visible,
      task: getTask(state, highlightedId),
      auth: getAuth(state),
    };
  };
  return mapStateToProps;
};

export default compose(
  connect(makeMapStateToProps, {
    clearHighlight: OverviewActions.clearHighlightAction,
    updateTask: TaskActions.updateTask,
    changeTagTask: TaskActions.changeTagTask,
    refreshListTask: TaskActions.refreshListTask,
  }),
  withState('tagId', 'setTagId', (props) => {

    return props.task.tag.uuid;
  }),
  lifecycle({
    componentDidMount() {
      this.props.setTagId(this.props.task.tag.uuid);
    },
  }),

  withHandlers({
    hideAssignForm: ({ clearHighlight, task, overviewType, refreshListTask, setTagId }) => () => {
      // refreshListTask(overviewType);
      setTagId(undefined);
      clearHighlight(overviewType);
    },
    handleTagChange: ({ task, updateTask, setTagId }) => (event, { value: tag }) => {
      setTagId(tag);
      // updateTask(task.uuid, { tag });
    },
    onSave: ({ auth, task, changeTagTask, overviewType, tagId, setTagId }) => () => {
      if (tagId) changeTagTask(auth.enterpriseID, auth.token, task.uuid, tagId, overviewType);
      else {
        changeTagTask(auth.enterpriseID, auth.token, task.uuid, task.tag.uuid, overviewType);
      }
      setTagId(undefined);
    },
  })
)(AssignTagToTaskModal);
