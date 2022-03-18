// @flow
import * as React from 'react';
import {compose, withHandlers, withState} from 'recompose';
import { connect } from 'react-redux';
import { Form, Input } from 'semantic-ui-react';
import type { EventHandlerType } from 'types/semantic-ui.types';
import _l from 'lib/i18n';
import { isAction } from './advanced-search.selectors';
import { ConfirmationDialog, FormPair } from 'components';
import * as AdvancedSearchActions from './advanced-search.actions';
import ModalCommon from "../ModalCommon/ModalCommon";
import cssForm from "../Task/TaskForm/TaskForm.css";
import css from "./AdvancedSearch.css";

const PERCENT = '100%';

type PropsType = {
  visible: boolean,
  hide: () => void,
  name: string,
  handleNameChange: EventHandlerType,
  copyRequest: () => void,
  error: string
};

addTranslations({
  'en-US': {
    'Copy advanced search': 'Copy advanced search',
    'Yes, copy this search': 'Yes, copy this search',
    "No, don't copy": "No, don't copy",
    'Name is required': 'Name is required',
    'Yes': 'Yes',
    "No": "No",
    Name: 'Name',
  },
});

const CopyAdvancedSearchModal = ({ copyRequest, visible, name, handleNameChange, hide, error }: PropsType) => {
  return (
    <>
{/*    <ConfirmationDialog
      visible={visible}
      onClose={hide}
      title={_l`Copy search`}
      yesLabel={_l`Yes, copy this search`}
      noLabel={_l`No, don't copy`}
      yesEnabled={name !== ''}
      onSave={copyRequest}
    >
      <Form>
        <FormPair label={_l`Name`}>
          <Input value={name} onChange={handleNameChange} fluid />
        </FormPair>
      </Form>
    </ConfirmationDialog>*/}
      <ModalCommon visible={visible} onDone={copyRequest} onClose={hide} size="small"
                   title={_l`Copy search`}
                   yesLabel={_l`Yes`}
                   noLabel={_l`No`}
                   yesEnabled={name !== ''}
      >
        <Form style={{paddingRight: '1rem',
          paddingLeft: '0.43rem'}}>
          <Form.Group>
            <div className={cssForm.label} width={6}>{_l`Name`}
              <span className={css.required}>*</span>
            </div>
            <div className={css.inputWraper100}>
            <Form.Input required error={error}  value={name}  style={{ width: PERCENT }} onChange={handleNameChange} fluid />
            <span className="form-errors">{error && _l`Name is required`}</span>
            </div>
          </Form.Group>
        </Form>
      </ModalCommon>
    </>
  );
};

export default compose(
  connect(
    (state, { objectType }) => ({
      visible: isAction(state, objectType, 'copy'),
    }),
    {
      setAction: AdvancedSearchActions.setAction,
      copyRequest: AdvancedSearchActions.copyRequest,
      setName: AdvancedSearchActions.setName,
    }
  ),
  withState('error', 'setError', false),
  withHandlers({
    hide: ({ setAction, objectType, setError }) => () => {
      setError(false);
      setAction(objectType, null);
    },
    handleNameChange: ({ setName, objectType }) => (event, { value: name }) => {
      setName(objectType, name);
    },
    copyRequest: ({ objectType, copyRequest, name, setError  }) => () => {
      setError(false);
      if(!name || name && name.length === 0) {
        setError(true)
        return;
      }
      copyRequest(objectType);
    },
  })
)(CopyAdvancedSearchModal);
