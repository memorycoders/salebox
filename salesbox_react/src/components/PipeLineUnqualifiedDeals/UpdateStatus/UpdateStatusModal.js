import React from 'react';
import { compose, withHandlers, withState, lifecycle } from 'recompose';
import { connect } from 'react-redux';
import _l from 'lib/i18n';
import ModalCommon from '../../ModalCommon/ModalCommon';
import { FormPair } from 'components';
import StatusDropdown from './StatusDropdown';
import { isHighlightAction, getHighlighted } from 'components/Overview/overview.selectors';
import * as OverviewActions from '../../Overview/overview.actions';
import { Form } from 'semantic-ui-react';
import css from './Status.css';
import { makeGetUnqualifiedDeal } from '../unqualifiedDeal.selector';
import * as UnqualifiedDealActions from './../unqualifiedDeal.actions';

addTranslations({
  'en-US': {
    Status: 'Status',
    Cancel: 'Cancel',
    Save: 'Save',
  },
});
const UpdateStatusModal = ({ visible, onClose, onSave, handleChangeStatus, unqualifiedDeal, status }) => {
  return (
    <ModalCommon
      title={_l`Status`}
      visible={visible}
      cancelLabel={_l`Cancel`}
      okLabel={_l`Save`}
      onDone={onSave}
      onClose={onClose}
      size="tiny"
      scrolling={false}
      description={false}
    >
      <Form>
        <FormPair label={_l`Status`} labelStyle={css.updateStatusFormLabel} left>
          <StatusDropdown
            value={status ? status : unqualifiedDeal.status ? unqualifiedDeal.status : 'None'}
            onChange={handleChangeStatus}
          />
        </FormPair>
      </Form>
    </ModalCommon>
  );
};

const mapStateToProps = (state, { overviewType }) => {
  const visible = isHighlightAction(state, overviewType, 'updateStatus');
  const highlightedId = getHighlighted(state, overviewType);
  const getUnqualifiedDeal = makeGetUnqualifiedDeal();
  return {
    visible,
    unqualifiedDeal: getUnqualifiedDeal(state, highlightedId),
  };
};
export default compose(
  connect(
    mapStateToProps,
    {
      clearHighlight: OverviewActions.clearHighlightAction,
      updateStatus: UnqualifiedDealActions.updateStatusUnqualifiedDeal,
    }
  ),
  withState('status', 'setStatus', (props) => {
    return props.unqualifiedDeal.status;
  }),
  lifecycle({
    componentDidMount() {
      this.props.setStatus(this.props.unqualifiedDeal.status);
    },
  }),
  withHandlers({
    onClose: ({ clearHighlight, overviewType, setStatus }) => () => {
      setStatus(undefined);
      clearHighlight(overviewType);
    },
    handleChangeStatus: ({ setStatus }) => (event, { value: status }) => {
      setStatus(status);
    },
    onSave: ({ unqualifiedDeal, overviewType, status, updateStatus, setStatus }) => () => {
      if (status) updateStatus(overviewType, unqualifiedDeal.uuid, status);
      else {
        updateStatus(overviewType, unqualifiedDeal.uuid, unqualifiedDeal.status);
      }
      setStatus(undefined);
    },
  })
)(UpdateStatusModal);
