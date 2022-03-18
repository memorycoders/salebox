//@flow
import * as React from 'react';
import _l from 'lib/i18n';
import { compose, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import * as OverviewActions from 'components/Overview/overview.actions';
import ModalCommon from '../../ModalCommon/ModalCommon';
import { Table, TableBody, TableRow, TableCell } from 'semantic-ui-react';
import { setCurrentSpecialTask, addQualifyLead } from '../task.actions';
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
  },
});

const SpecialTaskModal = ({ currentSpecialTask, handleCloseModal, handleDone, handleChooseMode }: PropsT) => {
  return (
    <ModalCommon
      title={_l`Confirm`}
      visible={currentSpecialTask && currentSpecialTask.status}
      onClose={handleCloseModal}
      onDone={handleDone}
      okHidden= {currentSpecialTask && currentSpecialTask.options && currentSpecialTask.options.length > 0 ? true : false}
      size="tiny"
      paddingAsHeader={true}
    >
      <p>-{currentSpecialTask && currentSpecialTask.title}</p>
      <Table compact className="table-suggest">
        <TableBody>
          {currentSpecialTask && currentSpecialTask.options && currentSpecialTask.options.map((e, key) => (
            <TableRow key={key}>
              <TableCell onClick={() => {handleChooseMode(e)}}>{e.value}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ModalCommon>
  );
};

const makeMapStateToProps = () => {
  const mapStateToProps = (state) => {
    const currentSpecialTask = state.entities.task.currentSpecialTask
    return {
      currentSpecialTask,
    };
  };
  return mapStateToProps;
};
export default compose(
  connect(makeMapStateToProps, {
    setCurrentSpecialTask: setCurrentSpecialTask,
    addQualifyLead: addQualifyLead,
  }),
  withHandlers({
    handleCloseModal: ({setCurrentSpecialTask}) => () => {
      setCurrentSpecialTask(false)
    },
    handleDone: ({addQualifyLead, currentSpecialTask}) => () => {
      addQualifyLead(currentSpecialTask.type)
    },
    handleChooseMode: ({addQualifyLead, currentSpecialTask}) => (value) => {
      addQualifyLead(currentSpecialTask.type, value.option)
    }
  })
)(SpecialTaskModal);
