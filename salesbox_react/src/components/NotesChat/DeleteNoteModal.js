//@flow
import * as React from 'react';
import { Container } from 'semantic-ui-react';
import _l from 'lib/i18n';
import { compose, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import * as OverviewActions from 'components/Overview/overview.actions';
import { deleteNote } from '../PipeLineUnqualifiedDeals/unqualifiedDeal.actions';
import { isHighlightAction, getItemSelected } from 'components/Overview/overview.selectors';
import ModalCommon from '../ModalCommon/ModalCommon';
import { refeshUnqualifiedDetail } from '../PipeLineUnqualifiedDeals/unqualifiedDeal.actions';
import { refreshOrganisation } from '../Organisation/organisation.actions';
import { Endpoints } from 'Constants';
import api from '../../lib/apiClient';
import { refreshContact } from '../Contact/contact.actions';
import { refeshQualifiedDeal } from '../PipeLineQualifiedDeals/qualifiedDeal.actions';
import { ObjectTypes, OverviewTypes } from '../../Constants';

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
    'Do you really want to delete?': 'Do you really want to delete?',
  },
});

const DeleteNoteModal = ({ visible, onClose, onSave }: PropsT) => {
  return (
    <ModalCommon title={_l`Confirm`} visible={visible} onDone={onSave} onClose={onClose} size="tiny" paddingAsHeader={true}>
      <p>{_l`Do you really want to delete?`}</p>
    </ModalCommon>
  );
};

const makeMapStateToProps = () => {
  const mapStateToProps = (state, { overviewType }) => {
    const visible = isHighlightAction(state, overviewType, 'delete_note');
    const note = getItemSelected(state, overviewType);
    return {
      visible,
      note
    };
  };
  return mapStateToProps;
};

export default compose(
  connect(makeMapStateToProps, {
    clearHighlightAction: OverviewActions.clearHighlightAction,
    refeshUnqualifiedDetail,
    refreshQualifiedDetail: refeshQualifiedDeal,
    refreshOrganisation,
    refreshContact
  }),
  withHandlers({
    onClose: ({ clearHighlightAction, overviewType }) => () => {
      clearHighlightAction(overviewType);
    },
    onSave: ({ refreshContact, note, overviewType, refreshQualifiedDetail, refeshUnqualifiedDetail, refreshOrganisation }) => async () => {
      let url = Endpoints.Document + '/note/delete/' + note.uuid
      let data = {

      }

      if (note.taskId) {
        url = Endpoints.Task + '/updateNote';
        data = { uuid: note.taskId, note: '' }
      }
      else if (note.appointmentId) {
        url = Endpoints.Appointment + '/updateNote';

        data = { uuid: note.appointmentId, note: '' }
      }
      else if (note.leadId && !note.uuid) {
        url = Endpoints.Lead + '/updateNote';
        data = { uuid: note.leadId, note: '' }
      }
      try {
        if (note.taskId || note.appointmentId || note.leadId && !note.uuid){
          const result = await api.post({ resource: url, data });
        } else {
          const result = await api.get({ resource: url });
        }
        if (overviewType === OverviewTypes.Pipeline.Lead_Note) {
          refeshUnqualifiedDetail('note');
        } else if (overviewType === OverviewTypes.Pipeline.Qualified_Note) {
          refreshQualifiedDetail('note');
        } else if (overviewType === OverviewTypes.Account_Note) {
          refreshOrganisation('note');
        } else if (overviewType === OverviewTypes.Contact_Note) {
          refreshContact('note');
        }

      } catch (error) {

      }


    },
  })
)(DeleteNoteModal);
