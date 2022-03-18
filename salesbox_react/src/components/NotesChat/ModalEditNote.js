/* eslint-disable react/prop-types */
//@flow
import * as React from 'react';
import _l from 'lib/i18n';
import { connect } from 'react-redux';
import { Input, TextArea } from 'semantic-ui-react';
import { isHighlightAction, getHighlighted, getItemSelected } from 'components/Overview/overview.selectors';
import { clearHighlight } from 'components/Overview/overview.actions';
import { refeshUnqualifiedDetail } from '../PipeLineUnqualifiedDeals/unqualifiedDeal.actions';
import { refeshQualifiedDeal, refeshOrderDeal } from '../PipeLineQualifiedDeals/qualifiedDeal.actions';
import { refreshOrganisation } from '../Organisation/organisation.actions';
import { refreshContact } from '../Contact/contact.actions';
import ModalCommon from '../ModalCommon/ModalCommon';
import css from './ModalEditNote.css';
import api from '../../lib/apiClient';
import { ObjectTypes, OverviewTypes } from '../../Constants';
import { Endpoints } from 'Constants';

addTranslations({
  'en-US': {
    'Edit Note': 'Edit Note',
    Cancel: 'Cancel',
    Save: 'Save',
    Subject: 'Subject',
    Content: 'Content',
    'Add note': 'Add note',
    'Subject is required': 'Subject is required',
  },
});

class EditNoteModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      subject: '',
      content: '',
      restSubject: 80,
      restContent: 2000,
      subjectError: '',
    };
  }

  hideEditForm = () => {
    const { overviewType } = this.props;
    this.setState({
      subject: '',
      content: '',
      restSubject: 80,
      restContent: 2000,
      subjectError: '',
    });
    this.props.clearHighlight(overviewType);
  };

  componentWillReceiveProps(nextProps) {
    const { note } = this.props;
    if(nextProps.modalType  === 'add_note') {
      this.setState({
        subject: '',
        content: '',
        restSubject: 80,
        restContent: 2000,
        subjectError: '',
      });
    }
    if ((note !== nextProps.note || this.props.visible!= nextProps.visible )&& nextProps.note) {
      const { subject, content } = nextProps.note;
      this.setState({
        subject: subject ? subject : '',
        content: content ? content : '',
        restSubject: 80 - (subject ? subject : '').length,
        restContent: 2000 - (content ? content : '').length,
      });
    }
  }

  onSave = async () => {
    const { subject, content } = this.state;
    const {
      refreshContact,
      note,
      refeshUnqualifiedDetail,
      refreshQualifiedDetail,
      refreshOrderDetail,
      refreshOrganisation,
      objectId,
      modalType,
      userId,
      overviewType,
    } = this.props;
    if (subject === '') {
      this.setState({
        subjectError: _l`Subject is required`,
      });
      return;
    }
    if (modalType === 'add_note') {
      let url = Endpoints.Document + '/note/add';
      try {
        // ở đây đang là trường hợp với unqualified thì có leadId nếu vào các trường hợp khác thì có id tương ứng với object ID

        if (overviewType === OverviewTypes.Pipeline.Lead_Note) {
          const result = await api.post({
            resource: url,
            data: {
              appointmentId: null,
              authorId: userId,
              contactId: null,
              leadId: objectId,
              // prospectId: objectId,
              organisationId: null,
              taskId: null,
              subject,
              content,
            },
          });
          refeshUnqualifiedDetail('note');
        }
        //trường hợp ở màn Account thay đổi dữ liệu truyền lên
        if (overviewType === OverviewTypes.Account_Note || overviewType === OverviewTypes.CallList.SubAccount) {
          const result = await api.post({
            resource: url,
            data: {
              appointmentId: null,
              authorId: userId,
              contactId: null,
              leadId: null,
              prospectId: null,
              organisationId: objectId,
              taskId: null,
              subject,
              content,
            },
          });
          refreshOrganisation('note');
        }
        //trường hợp ở màn Contact truyền contactId
        if (overviewType === OverviewTypes.Contact_Note || overviewType === OverviewTypes.CallList.SubContact) {
          const result = await api.post({
            resource: url,
            data: {
              appointmentId: null,
              authorId: userId,
              contactId: objectId,
              leadId: null,
              prospectId: null,
              organisationId: null,
              taskId: null,
              subject,
              content,
            },
          });
          refreshContact('note');
        }

        // trường hợp ở màn Qualified cần truyền thêm prospectId = Object id và leadId truyền lên null
        if (
          overviewType === OverviewTypes.Pipeline.Qualified_Note ||
          overviewType === OverviewTypes.Pipeline.Order ||
          overviewType === OverviewTypes.Account_Order ||
          overviewType === OverviewTypes.Contact_Order
        ) {
          const result = await api.post({
            resource: url,
            data: {
              appointmentId: null,
              authorId: userId,
              contactId: null,
              leadId: null,
              prospectId: objectId,
              organisationId: null,
              taskId: null,
              subject,
              content,
            },
          });
          if (overviewType === OverviewTypes.Pipeline.Qualified_Note) {
            refreshQualifiedDetail('note');
          } else if (overviewType === OverviewTypes.Pipeline.Order) {
            refreshOrderDetail('note');
          } else if (overviewType === OverviewTypes.Account_Order) {
            refreshOrganisation('note');
          } else if (overviewType === OverviewTypes.Contact_Order) {
            refreshContact('note');
          }
        }

        this.setState({
          subject: '',
          content: '',
          restSubject: 80,
          restContent: 2000,
          subjectError: '',
        });
      } catch (error) {
        // alert(error.message);

      }
      return;
    }

    let url = Endpoints.Document + '/note/update';
    let data = {
      ...note,
      subject,
      content,
    };
    if (note.taskId) {
      url = Endpoints.Task + '/updateNote';
      data = { uuid: note.taskId, note: content };
    } else if (note.appointmentId) {
      url = Endpoints.Appointment + '/updateNote';

      data = { uuid: note.appointmentId, note: content };
    } else if (note.leadId && !note.uuid) {
      url = Endpoints.Lead + '/updateNote';
      data = { uuid: note.leadId, note: content };
    }

    try {
      const result = await api.post({
        resource: url,
        data,
      });
      if (overviewType === OverviewTypes.Pipeline.Lead_Note) {
        refeshUnqualifiedDetail('note');
      } else if (overviewType === OverviewTypes.Pipeline.Qualified_Note) {
        refreshQualifiedDetail('note');
      } else if (overviewType === OverviewTypes.Pipeline.Order) {
        refreshOrderDetail('note');
      } else if (overviewType === OverviewTypes.Account_Note) {
        refreshOrganisation('note');
      } else if (overviewType === OverviewTypes.Account_Order || overviewType === OverviewTypes.CallList.SubAccount) {
        refreshOrganisation('note');
      } else if (overviewType === OverviewTypes.Contact_Note || overviewType === OverviewTypes.CallList.SubContact) {
        refreshContact('note');
      } else if (overviewType === OverviewTypes.Contact_Order) {
        refreshContact('note');
      }
    } catch (error) {}
  };

  onChangeSubject = (e) => {
    const { value } = e.target;
    if (value.length > 80) {
      return;
    }
    this.setState({ subject: value, restSubject: 80 - value.length, subjectError: '' });
  };

  onChangeContent = (e) => {
    const { value } = e.target;
    if (value.length > 2000) {
      return;
    }
    this.setState({ content: value, restContent: 2000 - value.length });
  };

  render() {
    const { visible, modalType } = this.props;
    const { subject, content, restContent, restSubject, subjectError } = this.state;
    return (
      <ModalCommon
        title={modalType === 'add_note' ? _l`Add note` : _l`Update note`}
        visible={visible}
        className={css.editNoteModal}
        onDone={this.onSave}
        onClose={this.hideEditForm}
        okLabel={_l`Save`}
        scrolling={true}
      >
        <div className={css.subjectContainer}>
          <span className={css.title}>
            {_l`Subject`}
            <span style={{ color: '#ff0000' }}>*</span>
          </span>

          <Input maxlength="80" onChange={this.onChangeSubject} value={subject} className={css.input} autoFocus/>
          <span className={css.rest}>{restSubject}</span>
          <span className={css.error}>{subjectError}</span>
        </div>
        <div className={css.contentContainer}>
          <span className={css.title}>{_l`Content`}</span>
          <TextArea
            className={css.inputContent}
            placeholder={_l`Note...`}
            rows={5}
            // autoHeight
            maxLength="2000"
            value={content}
            onChange={this.onChangeContent}
          />
          <span className={css.rest}>{restContent}</span>
        </div>
      </ModalCommon>
    );
  }
}
const mapStateToProps = (state, { overviewType, modalType }) => {
  const visible = isHighlightAction(state, overviewType, modalType === 'add_note' ? 'add_note' : 'edit_note');
  const note = getItemSelected(state, overviewType);
  const objectId = getHighlighted(state, overviewType);

  return {
    visible,
    note,
    objectId,
    userId: state.auth && state.auth.userId ? state.auth.userId : null,
  };
};

export default connect(mapStateToProps, {
  clearHighlight,
  refeshUnqualifiedDetail,
  refreshOrganisation,
  refreshQualifiedDetail: refeshQualifiedDeal,
  refreshOrderDetail: refeshOrderDeal,
  refreshContact,
  // notiError:
})(EditNoteModal);
