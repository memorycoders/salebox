//@flow
import * as React from 'react';
import _l from 'lib/i18n';
import { compose, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import * as OverviewActions from 'components/Overview/overview.actions';
import { isHighlightAction, getHighlighted } from '../../../Overview/overview.selectors';
import ModalCommon from '../../../ModalCommon/ModalCommon';
import { deleteDocumentSelected, fetchDocumentsByFileId } from '../../common.actions';
import api from '../../../../lib/apiClient';
type PropsT = {
  visible: boolean,
  onSave?: () => void,
  hide: () => void,
};

addTranslations({
  'en-US': {
    Confirm: 'Confirm',
    No: 'No',
    Yes: 'Yes',
    'Do you really want to delete?': 'Do you really want to delete?',
  },
});

const DeleteDocumentModal = ({ visible, hide, onSave }: PropsT) => {
  return (
    <ModalCommon
      title={_l`Confirm`}
      cancelLabel={_l`No`}
      okLabel={_l`Yes`}
      visible={visible}
      onDone={onSave}
      onClose={hide}
      size="tiny"
      paddingAsHeader={true}
    >
      <p>{_l`Do you really want to delete?`}</p>
    </ModalCommon>
  );
};

const makeMapStateToProps = () => {
  const mapStateToProps = (state) => {
    const visible = isHighlightAction(state, state.common.currentOverviewType, 'delete_document');
    const itemId = getHighlighted(state, state.common.currentOverviewType);
    return {
      visible,
      itemId,
      overviewType: state.common.currentOverviewType,
      selected: state.common.__DOCUMENTS.selected
        ? state.common.__DOCUMENTS.selected
        : {},
    };
  };
  return mapStateToProps;
};
export default compose(
  connect(makeMapStateToProps, {
    clearHighlightAction: OverviewActions.clearHighlightAction,
    deleteDocumentSelected,
    fetchDocumentsByFileId,
  }),
  withHandlers({
    hide: ({ clearHighlightAction, overviewType }) => () => {
      clearHighlightAction(overviewType);
    },
    onSave: ({
      selected,
      deleteDocumentSelected,
      clearHighlightAction,
      overviewType,
    }) => async () => {
      try {
        let url = `document-v3.0/document/delete/${selected.fileId}`;
        if (selected.isFolder) {
          url = `document-v3.0/document/deleteFolder/${selected.fileId}`;
        }
        const result = await api.get({
          resource: url,
        });
        if (result) {
          deleteDocumentSelected(selected.fileId);
          clearHighlightAction(overviewType);
        }
      } catch (error) {
        console.log(error);
      }
    },
  })
)(DeleteDocumentModal);
