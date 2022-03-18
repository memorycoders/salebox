//@flow
import * as React from 'react';
import { Input, Form } from 'semantic-ui-react';
import _l from 'lib/i18n';
import { compose, withHandlers, withState } from 'recompose';
import ModalCommon from '../../../ModalCommon/ModalCommon';
import api from '../../../../lib/apiClient';
import * as NotificationActions from '../../../Notification/notification.actions';
import { connect } from 'react-redux';

type PropsT = {
  task: {},
  visible: boolean,
  hideAssignForm: () => void,
  onSave?: () => void,
  handleTagChange: EventHandlerType,
};

addTranslations({
  'en-US': {
    Cancel: 'Cancel',
    Save: 'Save',
    Name: 'Name',
    'Name is required': 'Name is required',
  },
});
const AddIndustryModal = ({ onClose, visible, hideAssignForm, onSave, setName, name, error, setError }: PropsT) => {
  return (
    <ModalCommon
      title={_l`Add industry`}
      visible={visible}
      cancelLabel={_l`Cancel`}
      okLabel={_l`Save`}
      onDone={onSave}
      onClose={onClose}
      size="small"
      // closeOnDimmerClick={true}
      scrolling={false}
    >
      <div className="qualified-add-form">
        <Form>
          <Form.Group className="unqualified-fields">
            <div className="unqualified-label">
              {_l`Name`}
              <span className="required">*</span>
            </div>
            <div className="dropdown-wrapper" width={8}>
              <Input
                value={name}
                onChange={(event) => {
                  if (event.target.value) {
                    setError('');
                  }
                  setName(event.target.value);
                }}
              />
              {error && <span className="form-errors">{error}</span>}
            </div>
          </Form.Group>
        </Form>
      </div>
    </ModalCommon>
  );
};

const mapStateToProps = (state) => ({});
const mapDispatchToProps = {
  notiError: NotificationActions.error,
  notiSuccess: NotificationActions.success,
};
export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withState('name', 'setName', ''),
  withState('error', 'setError', ''),
  withHandlers({
    onSave: ({ name, onHandleAddNew, hideAssignForm, setError, notiError, notiSuccess, setName }) => async () => {
      if (name) {
        try {
          const result = await api.post({
            resource: 'administration-v3.0/workData/organisation/add',
            data: {
              type: 'INDUSTRY',
              name: name,
            },
          });
          hideAssignForm();
          onHandleAddNew(result);
          notiSuccess('Added', '', 2000);
          setName('');
          setError('')
        } catch (error) {
          notiError(error.message);
        }
      } else {
        setError(_l`Name is required`);
      }
    },
    onClose: ({hideAssignForm, setError, setName}) => () => {
      hideAssignForm();
      setName('');
      setError('')
    }
  })
)(AddIndustryModal);
