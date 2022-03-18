/* eslint-disable react/jsx-no-bind */
//@flow
import * as React from 'react';
import { Input, Form } from 'semantic-ui-react';
import _l from 'lib/i18n';
import { compose, withHandlers, withState } from 'recompose';
import ModalCommon from '../../../ModalCommon/ModalCommon';
import api from '../../../../lib/apiClient';
import isEmail from 'lib/isEmail';

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
    Email: 'Email',
    'Email is required': 'Email is required',
  },
});
const AddEmailModal = ({ visible, hideAssignForm, onSave, setName, name, error, setError }: PropsT) => {
  return (
    <ModalCommon
      title={_l`Add email`}
      visible={visible}
      cancelLabel={_l`Cancel`}
      okLabel={_l`Save`}
      onDone={onSave}
      onClose={hideAssignForm}
      size="small"
      scrolling={false}
    >
      <div className="qualified-add-form">
        <Form>
          <Form.Group className="unqualified-fields">
            <div className="unqualified-label">
              {_l`Email`}
              <span className="required">*</span>
            </div>
            <div className="dropdown-wrapper" width={8}>
              <Input
                value={name}
                error={error}
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

export default compose(
  withState('name', 'setName', ''),
  withState('error', 'setError', ''),
  withHandlers({
    onSave: ({ name, onHandleAddNew, hideAssignForm, setError, setName }) => async () => {
      if (name && isEmail(name)) {
        hideAssignForm();
        onHandleAddNew(name);
        // try {
        //   const result = await api.post({
        //     resource: 'administration-v3.0/workData/organisation/add',
        //     data: {
        //       type: 'INDUSTRY',
        //       name: name,
        //     },
        //   });
        //   hideAssignForm();
        //   onHandleAddNew(result);
        // } catch (error) {}
      } else if(name && !isEmail(name)){
        setError(_l`Email is invalid`);
      } else {
        setError(_l`Email is required`);
      }
      setName('');
    },
  })
)(AddEmailModal);
