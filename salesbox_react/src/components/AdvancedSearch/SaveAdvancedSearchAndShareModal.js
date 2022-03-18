
// @flow
import * as React from 'react';
import { compose, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import { Form, Input, Button } from 'semantic-ui-react';
import type { EventHandlerType } from 'types/semantic-ui.types';
import _l from 'lib/i18n';
import { getSearch, isAction } from './advanced-search.selectors';
import { ConfirmationDialog, FormPair } from 'components';
import UnitDropdown from 'components/Unit/UnitDropdown';
import UserDropdown from 'components/User/UserDropdown';
import ModalCommon from 'components/ModalCommon/ModalCommon';
import * as AdvancedSearchActions from './advanced-search.actions';
import css from './AdvancedSearch.css';
type PropsType = {
  visible: boolean,
  hide: () => void,
  name: string,
  sharedWith: string,
  unit: string,
  person: string,
  shareWithCompany: EventHandlerType,
  shareWithUnit: EventHandlerType,
  shareWithPerson: EventHandlerType,
  handleNameChange: EventHandlerType,
  selectUnit: EventHandlerType,
  selectPerson: EventHandlerType,
  shareRequest: () => void,
};

addTranslations({
  'en-US': {
    'Share advanced search': 'Share advanced search',
    "No, don't save": "No, don't save",
    Name: 'Name',
    Person: 'Person',
    Unit: 'Unit',
    Company: 'Company',
    'Share with': 'Share with',
  },
});

const SaveAdvancedSearchAndShareModal = ({
  sharedWith,
  visible,
  name,
  shareRequest,
  handleNameChange,
  shareWithCompany,
  shareWithUnit,
  shareWithPerson,
  selectUnit,
  selectPerson,
  unit,
  person,
  hide,
}: PropsType) => {
//            <Button onClick={shareWithPerson} active={sharedWith === 'person'} content={_l`Person`} />
  return (
    <ModalCommon
    title={_l`Share search`}
    visible={visible}
    onDone={shareRequest}
    onClose={hide}
    size='small'
    okLabel='Save'
    scrolling={false}
    description={false}
    >
      <Form className={css._form}>
        <Form.Group>
          <div width={6} className={css._label}> {_l`Name`}</div>
          <Input className={css._input}  value={name} onChange={handleNameChange} fluid />
        </Form.Group>
        <Form.Group>
          <div width={6} className={css._label}> {_l`Share with`}</div>
          <Button.Group basic fluid>
            <Button className={css.shareWithButton} onClick={shareWithCompany} active={sharedWith === 'company'} content={_l`Company`} />
            <Button className={css.shareWithButton} onClick={shareWithUnit} active={sharedWith === 'unit'} content={_l`Unit`} />
            <Button className={css.shareWithButton} onClick={shareWithPerson} active={sharedWith === 'person'} content={_l`Person`} />
          </Button.Group>
        </Form.Group>
          {sharedWith === 'unit' && (
            <Form.Group>
              <div width={6} className={css._label}> {_l`Unit`}</div>
              <UnitDropdown multiple value={unit} onChange={selectUnit} />
            </Form.Group>
          )}
          {sharedWith === 'person' && (
            <Form.Group>
              <div width={6} className={css._label}> {_l`Person`}</div>
              <UserDropdown multiple value={person} onChange={selectPerson} />
            </Form.Group>
          )}
      </Form>
  </ModalCommon>
  );
};

export default compose(
  connect(
    (state, { objectType }) => {
      const {
        sharedWith: { selected, person, unit },
      } = getSearch(state, objectType);
      return {
        visible: isAction(state, objectType, 'saveAndShare'),
        sharedWith: selected,
        person,
        unit,
      };
    },
    {
      setAction: AdvancedSearchActions.setAction,
      shareWith: AdvancedSearchActions.shareWith,
      shareWithEntity: AdvancedSearchActions.shareWithEntity,
      setName: AdvancedSearchActions.setName,
      shareRequest: AdvancedSearchActions.shareRequest,
    }
  ),
  withHandlers({
    hide: ({ setAction, objectType }) => () => {
      setAction(objectType, null);
    },
    handleNameChange: ({ setName, objectType }) => (event, { value: name }) => {
      setName(objectType, name);
    },
    shareWithCompany: ({ shareWith, objectType }) => () => {
      shareWith(objectType, 'company');
    },
    shareWithPerson: ({ shareWith, objectType }) => () => {
      shareWith(objectType, 'person');
    },
    shareWithUnit: ({ shareWith, objectType }) => () => {
      shareWith(objectType, 'unit');
    },
    selectUnit: ({ shareWithEntity, objectType }) => (event, { value: uuid }) => {
      shareWithEntity(objectType, 'unit', uuid);
    },
    selectPerson: ({ shareWithEntity, objectType }) => (event, { value: uuid }) => {
      shareWithEntity(objectType, 'person', uuid);
    },
    shareRequest: ({ objectType, shareRequest }) => () => {
      shareRequest(objectType);
    },
  })
)(SaveAdvancedSearchAndShareModal);
