//@flow
import * as React from 'react';
import { Container } from 'semantic-ui-react';
import _l from 'lib/i18n';
import { compose, lifecycle, withHandlers, withState } from 'recompose';
import { connect } from 'react-redux';
import * as OverviewActions from 'components/Overview/overview.actions';
import { isHighlightAction, getHighlighted, getHighlightAction } from 'components/Overview/overview.selectors';
import ModalCommon from '../../ModalCommon/ModalCommon';
import { getOrganisation } from '../organisation.selector';
// import { deleteRow } from '../qualifiedDeal.actions';
import { withRouter } from 'react-router';
import { getRulePackage } from '../../Auth/auth.selector';
import * as OrganisationActions from 'components/Organisation/organisation.actions';
import { CssNames, OverviewTypes } from 'Constants';

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
    'Are you sure you want to delete this account?': 'Are you sure you want to delete this account?',
  },
});

const DeleteOrganisationModal = ({ visible, onClose, onSave, rulePackage, messageMode }: PropsT) => {
  return (
    <ModalCommon
      title={_l`Confirm`}
      visible={visible}
      onDone={onSave}
      onClose={onClose}
      size="tiny"
      paddingAsHeader={true}
    >
      <p>{_l`Are you sure you want to delete this company?`}</p>
      {messageMode == 'DIFFERENT_OWNER_MORE_USER' && rulePackage != 'BASIC' && (
        <p>{_l`The company and connected contacts will be removed from your personal lists but active reminders, meetings, prospects and deals will remain.`}</p>
      )}
      {messageMode == 'DIFFERENT_OWNER_MORE_USER' && rulePackage == 'BASIC' && (
        <p>{_l`The company and connected contacts will be removed from your personal lists but active reminders, prospects and orders will remain.`}</p>
      )}
      {messageMode == 'DIFFERENT_OWNER_ONCE_USER' && rulePackage != 'BASIC' && (
        <p>{_l`The company and connected contacts, active reminders, prospects, meetings and deals will be removed from all lists.`}</p>
      )}
      {messageMode == 'DIFFERENT_OWNER_ONCE_USER' && rulePackage == 'BASIC' && (
        <p>{_l`The company and connected contacts, active reminders, prospects and orders will be removed from all lists.`}</p>
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
    const organisation = getOrganisation(state, highlightedId);
    const highlightAction = getHighlightAction(state, overviewType);
    // const qualifiedDeal = {uuid: highlightedId};
    let messageMode = 'DIFFERENT_OWNER_ONCE_USER';
    if (!organisation.participantList) {
      messageMode = messageModeAPI;
    } else {
      if (organisation.participantList.length > 1) {
        messageMode = 'DIFFERENT_OWNER_MORE_USER';
      } else {
        messageMode = 'DIFFERENT_OWNER_ONCE_USER';
      }
    }

    return {
      visible,
      selectedObject: { ...organisation, uuid: highlightedId },
      rulePackage: getRulePackage(state),
      messageMode: messageMode,
      highlightAction,
    };
  };
  return mapStateToProps;
};

export default compose(
  withRouter,
  withState('messageModeAPI', 'setMessageMode', 'DIFFERENT_OWNER_ONCE_USER'),
  connect(makeMapStateToProps, {
    clearHighlightAction: OverviewActions.clearHighlightAction,
    deleteOrganisation: OrganisationActions.deleteRow,
    unhighlight: OverviewActions.unhighlight,
  }),
  lifecycle({
    componentDidUpdate(prevProps, prevState) {
      if (this.props.visible) {
        const onLoadNew = async () => {
          const { selectedObject, setMessageMode } = this.props;

          if (selectedObject != null && !selectedObject.participantList)
            try {
              if (!selectedObject.uuid) {
                // if (nextProps.itemSelected) {
                const data = await api.get({
                  resource: `${Endpoints.Organisation}/${selectedObject.uuid}/participant/list`,
                });

                const { participantDTOList } = data;
                if (participantDTOList != null && participantDTOList.length > 1)
                  setMessageMode('DIFFERENT_OWNER_MORE_USER');
                else setMessageMode('DIFFERENT_OWNER_ONCE_USER');
                // }
              }
            } catch (error) {}
        };
        onLoadNew();
      }
    },
  }),
  withHandlers({
    onClose: ({ clearHighlightAction, overviewType, selectedObject }) => () => {
      clearHighlightAction(overviewType);
    },
    onSave: ({
      selectedObject,
      overviewType,
      deleteOrganisation,
      history,
      currentPath = '/accounts',
      location,
      unhighlight,
      newPath = '/call-lists/account',
    }) => () => {
      let path = window.location.pathname;

      let uuid = path.slice(currentPath.length + 1);
      deleteOrganisation(overviewType, selectedObject.uuid);
      if (uuid === selectedObject.uuid && location.pathname != currentPath) {
        history.push(currentPath);
      }
      if (OverviewTypes.CallList.SubAccount == overviewType) {
        if (path.includes(selectedObject.uuid)) {
          let newDirection = path.slice(0, path.length - selectedObject.uuid.length - 1);
          history.push(newDirection);
        }
      }
    },
  })
)(DeleteOrganisationModal);
