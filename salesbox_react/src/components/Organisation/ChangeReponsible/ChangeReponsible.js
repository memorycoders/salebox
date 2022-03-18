//@flow
import * as React from 'react';
import { Transition, Modal, Button, Form } from 'semantic-ui-react';
import _l from 'lib/i18n';
import { compose, withHandlers, withState, lifecycle } from 'recompose';
import { connect } from 'react-redux';
import { withGetData } from 'lib/hocHelpers';
import * as TaskActions from 'components/Task/task.actions';
import * as OverviewActions from 'components/Overview/overview.actions';
import { isHighlightAction, getItemSelected } from 'components/Overview/overview.selectors';
import TagDropdown from 'components/Tag/TagDropdown';
import type { EventHandlerType } from 'types/semantic-ui.types';
import { FormPair } from 'components';
// import { makeGetTask } from '../task.selector';
import ModalCommon from '../../ModalCommon/ModalCommon';
import css from '../../Task/Delegation.css';
import { getAuth } from '../../Auth/auth.selector';
import UserDropdown from '../../../components/PipeLineQualifiedDeals/CreateQualifiedForm/UserDropdown';
import UserDropdown2 from '../../../components/User/UserDropdown';
import { changeOnMultiMenu, updateResponsibleOneDeal } from '../organisation.actions';
import api from 'lib/apiClient';
import { ObjectTypes, Endpoints, OverviewTypes } from 'Constants';
import Percentage from '../../../components/PipeLineQualifiedDeals/CreateQualifiedForm/percentage'
import localCss from '../ChangeReponsible/ChangeReponsible.css'
import * as CallListAccountActions from '../../CallListAccount/callListAccount.actions';
import * as CallListContactActions from '../../CallListContact/callListContact.actions';

type PropsT = {
  task: {},
  visible: boolean,
  hideAssignForm: () => void,
  onSave?: () => void,
  handleTagChange: EventHandlerType,
};

addTranslations({
  'en-US': {
    'Update responsible': 'Update responsible',
    Cancel: 'Cancel',
    Save: 'Save',
    'Responsible': 'Responsible',
    'Responsible is required': 'Responsible is required',
    'Account team': 'Account team'
  },
});

const ChangeReponsibleModal = ({ error, changePercentageReponsible, _handleLabelClick, participantOpts, onClosePercentage, visiablePercentage, visible, hideAssignForm, onSave, _handleUserChange, users, overviewType }: PropsT) => {
  return (
    <>
      <ModalCommon
        title={_l`Update responsible`}
        visible={visible}
        cancelLabel={_l`Cancel`}
        okLabel={_l`Save`}
        onDone={onSave}
        onClose={hideAssignForm}
        size="small"
        className={css.mutilChangeModal}
        scrolling={false}
        description={false}
      >
        <Form>
          <FormPair style={{ position: 'relative',}} required label={_l`Responsible`} labelStyle={css.delegateFormLabel} left>
            <UserDropdown
              overviewType={overviewType}
              onChange={_handleUserChange}
              value={users}
              // mutilChange
              participantOpts={participantOpts}
              onLabelClick={_handleLabelClick}
              hasSearch />
            <span className={localCss.error}>{error}</span>
          </FormPair>

        </Form>
      </ModalCommon>
      <Percentage
        visible={false}
        onClosePercentage={onClosePercentage}
        // formKey="__CREATE"
        changePercentageReponsible={changePercentageReponsible}
        participantList={participantOpts}
      />
    </>
  );
};

const makeMapStateToProps = () => {
  const mapStateToProps = (state, { overviewType }) => {
    const visible = isHighlightAction(state, overviewType, 'change_reponsible');
    return {
      visible,
      itemSelected: getItemSelected(state, overviewType)
    };
  };
  return mapStateToProps;
};

export default compose(
  connect(
    makeMapStateToProps,
    {
      clearHighlightAction: OverviewActions.clearHighlightAction,
      changeOnMultiMenu: changeOnMultiMenu,
      updateResponsibleOneDeal,
      changeOnMultiCallListAccount: CallListAccountActions.changeOnMultiMenu,
      changeOnMultiCallListContact: CallListContactActions.changeOnMultiMenu,
    }
  ),

  withState('users', 'setUsers', []),
  withState('visiablePercentage', 'setVisiablePercentage', false),
  withState('participantOpts', 'setParticipantOpts', []),
  withState('error', 'setError', ''),
  lifecycle({
    async componentWillReceiveProps(nextProps) {
      const { itemSelected, setUsers, setParticipantOpts, visible } = this.props;
      if (!visible){
        return;
      }
      if (itemSelected !== nextProps.itemSelected && nextProps.itemSelected) {
        try {

          if (nextProps.itemSelected) {
            const data = await api.get({
              resource: `${Endpoints.Organisation}/${nextProps.itemSelected.uuid}/participant/list`
            });

            const { userDTOList } = data;
            setUsers(userDTOList.map(value => value.uuid));
            setParticipantOpts(userDTOList.map(value => ({ uuid: value.uuid, sharedPercent: value.sharedPercent})))
          }
        } catch (error) {

        }
      }

    },

    componentWillUnmount() {
      const { setUsers } = this.props;
      setUsers([])
    }
  }),

  withHandlers({
    changePercentageReponsible: ({ setParticipantOpts })=>(list)=>{
      setParticipantOpts(list)
    },
    _handleLabelClick: ({ setVisiablePercentage }) => ()=> {
      setVisiablePercentage(true);
    },
    onClosePercentage: ({ setVisiablePercentage })=> ()=>{
      setVisiablePercentage(false);
    },
    hideAssignForm: ({ setError, clearHighlightAction, overviewType, setUsers, setParticipantOpts }) => () => {
      setUsers([]);
      setError('')
      setParticipantOpts([])
      clearHighlightAction(overviewType);
    },
    _handleUserChange: ({ setError, setUsers, setParticipantOpts, participantOpts }) => (event, { value }) => {
      setUsers(value);
      if(value.length > 0){
        setError('')
      }
      let ids = [];
      if(typeof value === 'object'){
        value.map((id) => {
          const right = participantOpts.find((x) => x.uuid === id);
          if (right) {
            ids.push(right);
          } else {
            ids.push({ uuid: id, sharedPercent: 0 });
          }
        });
      }
      let sum = 0;
      for (let i = 0; i < ids.length; i++) {
        sum += parseInt(ids[i].sharedPercent);
      }

      if (sum !== 100) {
        for (let i = 0; i < ids.length; i++) {
          ids[i].sharedPercent = i === 0 ? (Number(100 - sum) + Number(ids[i].sharedPercent)) : ids[i].sharedPercent;
        }
      }

      setParticipantOpts(ids)
    },
    onSave: ({ setError, changeOnMultiMenu, changeOnMultiCallListAccount, changeOnMultiCallListContact, participantOpts, setParticipantOpts, users, overviewType, itemSelected, updateResponsibleOneDeal, setUsers }) => () => {
      if (users.length > 0) {
        if (itemSelected) {
          if(overviewType === OverviewTypes.Account) {
            updateResponsibleOneDeal(itemSelected.uuid, participantOpts, overviewType);

          } else if(overviewType === OverviewTypes.CallList.SubAccount) {
            updateResponsibleOneDeal(itemSelected.organisationId, participantOpts, overviewType);

          }
        } else {
          if(overviewType === OverviewTypes.CallList.Account) {
            changeOnMultiCallListAccount('change_reponsible', users, overviewType);
          } if(overviewType === OverviewTypes.CallList.Contact) {
            changeOnMultiCallListContact('change_reponsible', users, overviewType);
          } else changeOnMultiMenu('change_reponsible', participantOpts, overviewType);
        }
        // setUsers([])
        // setParticipantOpts([])
      } else {
        setError(_l`Responsible is required`)
      }

    },
  })
)(ChangeReponsibleModal);
