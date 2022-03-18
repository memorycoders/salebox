// @flow
import React, { useState } from 'react';
import { compose, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import { Form, Input, Button } from 'semantic-ui-react';
import type { EventHandlerType } from 'types/semantic-ui.types';
import * as OverviewActions from 'components/Overview/overview.actions';
import _l from 'lib/i18n';
import { isHighlightAction, getItemSelected } from 'components/Overview/overview.selectors';
import api from '../../../lib/apiClient';
import { Types, calculatingPositionMenuDropdown } from 'Constants';
import UnitDropdown from 'components/Unit/UnitDropdown';
import UserDropdown from 'components/User/UserDropdown';
import ModalCommon from 'components/ModalCommon/ModalCommon';
import css from '../../AdvancedSearch/AdvancedSearch.css';
import * as NotificationActions from '../../Notification/notification.actions';

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
    'Yes, save and share': 'Yes, save and share',
    "No, don't save": "No, don't save",
    Name: 'Name',
    Person: 'Person',
    Unit: 'Unit',
    Company: 'Company',
    'Share with': 'Share with',
  },
});

const ShareWith = ({
  visible,
  shareRequest,
  hide,
}: PropsType) => {

  const [sharedWith, setSharedWith] = useState({ selected: 'COMPANY', person: null, unit: null })


  return (
    <ModalCommon
      title={_l`Share with`}
      visible={visible}
      onDone={shareRequest}
      onClose={hide}
      size='small'
      okLabel={_l`Save`}
      scrolling={false}
      description={false}
    >
      <Form className={css._form}>
        {/* <Form.Group>
                    <div width={6} className={css._label}> {_l`Name`}</div>
                    <Input className={css._input} value={name} onChange={handleNameChange} fluid />
                </Form.Group> */}
        <Form.Group>
          <div width={6} className={css._label}> {_l`Share with`}</div>
          <Button.Group basic fluid>
            <Button
              className={css.shareWithButton}
              onClick={() => {
                setSharedWith({ selected: 'COMPANY', person: null, unit: null })
              }}
              active={sharedWith.selected === 'COMPANY'} content={_l`Company`} />
            <Button
              className={css.shareWithButton}
              onClick={() => {
                setSharedWith({ selected: 'UNIT', person: null, unit: null })
              }}
              active={sharedWith.selected === 'UNIT'} content={_l`Unit`} />
            <Button
              className={css.shareWithButton}
              onClick={() => {
                setSharedWith({ selected: 'PERSON', person: null, unit: null })
              }}
              active={sharedWith.selected === 'PERSON'} content={_l`Person`} />
          </Button.Group>
        </Form.Group>
        {sharedWith.selected === 'UNIT' && (
          <Form.Group>
            <div width={6} className={css._label}> {_l`Unit`}</div>
            <UnitDropdown
              className='position-clear'
              id={`shareWithUnit`}
              onClick={() => calculatingPositionMenuDropdown(`shareWithUnit`)}
              multiple value={sharedWith.unit} onChange={(e, { value }) => {
                setSharedWith({
                  ...sharedWith,
                  unit: value
                })
              }} />
          </Form.Group>
        )}
        {sharedWith.selected === 'PERSON' && (
          <Form.Group>
            <div width={6} className={css._label}> {_l`Person`}</div>
            <UserDropdown
              className='position-clear'
              id={`shareWithUser`}
              onClick={() => calculatingPositionMenuDropdown(`shareWithUser`)}
              multiple value={sharedWith.person} onChange={(e, { value }) => {
                setSharedWith({
                  ...sharedWith,
                  person: value
                })
              }} />
          </Form.Group>
        )}
      </Form>
    </ModalCommon>
  );
};

export default compose(
  connect(
    (state, { objectType }) => {
      const visible = isHighlightAction(state, 'INSIGHT_SHARE_WITH', 'share');
      const item = getItemSelected(state, 'INSIGHT_SHARE_WITH')
      return {
        visible,
        item
      };
    },
    {
      clearHighlightAction: OverviewActions.clearHighlightAction,
      notiSuccess: NotificationActions.success
    }
  ),
  withHandlers({
    hide: ({ clearHighlightAction }) => () => {
      clearHighlightAction('INSIGHT_SHARE_WITH');
    },
    shareRequest: ({ item, clearHighlightAction, notiSuccess }) => async (shareWith) => {
      const result = await api.post({
        resource: 'advance-search-v3.0/shareCustomDashBoard',
        data: item
      });
      clearHighlightAction('INSIGHT_SHARE_WITH');
      if (result) {
        notiSuccess(_l`Shared`, '', 2000);
      }
    },
  })
)(ShareWith);
