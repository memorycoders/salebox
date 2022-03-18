// @flow
import * as React from 'react';
import { compose, withHandlers, withState } from 'recompose';
import { connect } from 'react-redux';
import { Form, Input } from 'semantic-ui-react';
import type { EventHandlerType } from 'types/semantic-ui.types';
import _l from 'lib/i18n';
import { isAction } from './advanced-search.selectors';
// import { ConfirmationDialog, FormPair } from 'components';
import ModalCommon from 'components/ModalCommon/ModalCommon';
import * as AdvancedSearchActions from './advanced-search.actions';
import css from './AdvancedSearch.css';

type PropsType = {
  visible: boolean,
  hide: () => void,
  name: string,
  handleNameChange: EventHandlerType,
  saveRequest: () => void,
  error: string
};

addTranslations({
  'en-US': {
    "No, don't save": "No, don't save",
    Name: 'Name',
    'Name is required': 'Name is required',
  },
});

const SaveAdvancedSearchModal = ({ saveRequest, visible, name, handleNameChange, hide, error }: PropsType) => {
  return (
    <ModalCommon
      title={_l`Save search`}
      visible={visible}
      onDone={saveRequest}
      onClose={hide}
      size='small'
      scrolling={false}
      okLabel={_l`Save`}
      >
      <Form className={css._form}>
        <Form.Group>
          <div width={6} className={css._label}> {_l`Name`}
          <span className={css.required}>*</span>
          </div>
          <div className={css.inputWraper100}>
            <Form.Input required error={error} className={css._input} value={name} onChange={handleNameChange} fluid/>
            <span className="form-errors">{error && _l`Name is required`}</span>
          </div>
        </Form.Group>
      </Form>
    </ModalCommon>
  );
};

export default compose(
  connect(
    (state, { objectType }) => ({
      visible: isAction(state, objectType, 'save'),
    }),
    {
      setAction: AdvancedSearchActions.setAction,
      saveRequest: AdvancedSearchActions.saveRequest,
      setName: AdvancedSearchActions.setName,
    }
  ),
  withState('error', 'setError', false),
  withHandlers({
    hide: ({ setAction, objectType, setError }) => () => {
      setError(false)
      setAction(objectType, null);
    },
    handleNameChange: ({ setName, objectType }) => (event, { value: name }) => {
      setName(objectType, name);
    },
    saveRequest: ({ objectType, saveRequest, name, setError }) => () => {
      setError(false)
      if(!name || name && name.length === 0) {
        setError(true)
        return;
      }
      saveRequest(objectType);
    },
  })
)(SaveAdvancedSearchModal);
