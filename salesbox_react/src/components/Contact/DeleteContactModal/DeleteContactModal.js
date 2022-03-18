//@flow
import * as React from 'react';
import { Container } from 'semantic-ui-react';
import _l from 'lib/i18n';
import { compose, lifecycle, withHandlers, withState } from 'recompose';
import { connect } from 'react-redux';
import * as OverviewActions from 'components/Overview/overview.actions';
import {
  isHighlightAction,
  getHighlighted,
  getHighlightAction,
  getItemSelected,
} from 'components/Overview/overview.selectors';
import ModalCommon from '../../ModalCommon/ModalCommon';
import { getContact } from '../contact.selector';
// import { deleteRow } from '../qualifiedDeal.actions';
import { withRouter } from 'react-router';
import { getRulePackage } from '../../Auth/auth.selector';
import * as ContactActions from 'components/Contact/contact.actions';
import { ObjectTypes, OverviewTypes, Colors } from 'Constants';

type PropsT = {
  visible: boolean,
  onClose: () => void,
  onSave?: () => void,
};

addTranslations({
  'en-US': {
    Confirm: 'Confirm',
    No: 'No',
    Yes: 'Yes',
    'Are you sure you want to delete this contact?': 'Are you sure you want to delete this contact?',
  },
});

const DeleteContactModal = ({ visible, onClose, onSave, rulePackage, messageMode }: PropsT) => {
  return (
    <ModalCommon
      title={_l`Confirm`}
      visible={visible}
      onDone={onSave}
      onClose={onClose}
      size="tiny"
      paddingAsHeader={true}
    >
      <p>{_l`Are you sure you want to delete this contact?`}</p>
      {messageMode == 'DIFFERENT_OWNER_MORE_USER' && rulePackage != 'BASIC' && (
        <p>{_l`The contact will be removed from your personal lists but active reminders, appointments, prospects and deals will remain.`}</p>
      )}
      {messageMode == 'DIFFERENT_OWNER_MORE_USER' && rulePackage == 'BASIC' && (
        <p>{_l`The contact will be removed from your personal lists but active reminders, prospects and orders will remain.`}</p>
      )}
      {messageMode == 'DIFFERENT_OWNER_ONCE_USER' && rulePackage != 'BASIC' && (
        <p>{_l`The contact and connected active reminders, prospects, meetings and deals will be removed from all lists.`}</p>
      )}
      {messageMode == 'DIFFERENT_OWNER_ONCE_USER' && rulePackage == 'BASIC' && (
        <p>{_l`The contact and connected active reminders, prospects and orders will be removed from all lists.`}</p>
      )}
      {/*{rulePackage != 'BASIC' ? <p>{_l`The deal, active reminders and meetings will be removed`}</p> : <p>{_l`The order and active reminders will be removed`}</p>}*/}
    </ModalCommon>
  );
};

const makeMapStateToProps = () => {
  // const getUnqualifiedDeal = getQualified();
  const mapStateToProps = (state, { overviewType, messageModeAPI }) => {
    const visible = isHighlightAction(state, overviewType, 'delete');
    const highlightedId = getHighlighted(state, overviewType);
    let contact = getContact(state, highlightedId);
    // const highlightAction = getHighlightAction(state, overviewType);
    // const qualifiedDeal = {uuid: highlightedId};

    if (overviewType == OverviewTypes.Account_Contact) {
      contact = getItemSelected(state, overviewType);
    }

    let messageMode = 'DIFFERENT_OWNER_ONCE_USER';
    if (contact != null) {
      if (!contact.participantList) {
        // messageMode = messageModeAPI;
      } else {
        if (contact.participantList.length > 1) {
          messageMode = 'DIFFERENT_OWNER_MORE_USER';
        } else {
          messageMode = 'DIFFERENT_OWNER_ONCE_USER';
        }
      }
    }
    return {
      visible,
      selectedObject: { ...contact, uuid: highlightedId },
      rulePackage: getRulePackage(state),
      messageMode: messageMode,
      // highlightAction
    };
  };
  return mapStateToProps;
};

export default compose(
  withRouter,
  // withState('messageModeAPI', 'setMessageMode', 'DIFFERENT_OWNER_ONCE_USER'),
  connect(makeMapStateToProps, {
    clearHighlightAction: OverviewActions.clearHighlightAction,
    deleteRow: ContactActions.deleteRow,
    unhighlight: OverviewActions.unhighlight,
  }),
  /*  lifecycle({
    componentDidUpdate(prevProps, prevState) {
      if (this.props.visible){
        const onLoadNew = async () => {
          const { selectedObject, setMessageMode } = this.props;

          if (selectedObject != null && !selectedObject.participantList)
            try {

              if (!selectedObject.uuid) {
                // if (nextProps.itemSelected) {
                const data = await api.get({
                  resource: `${Endpoints.Organisation}/${selectedObject.uuid}/participant/list`
                });

                const { participantDTOList } = data;
                if (participantDTOList != null && participantDTOList.length > 1)
                  setMessageMode('DIFFERENT_OWNER_MORE_USER');
                else
                  setMessageMode('DIFFERENT_OWNER_ONCE_USER');
                // }
              }
            } catch (error) {

            }


        }
        onLoadNew();
      }

    },
  }),*/
  withHandlers({
    onClose: ({ clearHighlightAction, overviewType, selectedObject }) => () => {
      clearHighlightAction(overviewType);
    },
    onSave: ({
      selectedObject,
      overviewType,
      deleteRow,
      history,
      currentPath = '/contacts',
      location,
      unhighlight,
    }) => () => {
      let path = window.location.pathname;

      let uuid = path.slice(currentPath.length + 1);
      deleteRow(overviewType, selectedObject.uuid);
      if (
        overviewType != OverviewTypes.Account_Contact &&
        uuid === selectedObject.uuid &&
        location.pathname != currentPath
      ) {
        history.push(currentPath);
      }
      if (OverviewTypes.CallList.SubContact == overviewType) {
        // history.push(currentPath);
        // unhighlight(overviewType, selectedObject.uuid);
        // history.goBack()

        if (path.includes(selectedObject.uuid)) {
          let newDirection = path.slice(0, path.length - selectedObject.uuid.length - 1);
          history.push(newDirection);
        }
      }
    },
  })
)(DeleteContactModal);
