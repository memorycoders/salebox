import React, { Component, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import ModalCommon from '../../ModalCommon/ModalCommon';
import css from './InviteToTeamsModal.css';
import api from 'lib/apiClient';
import _l from 'lib/i18n';
import { Table, Icon, Message, Input, Loader, Dimmer, Segment } from 'semantic-ui-react';
import { isHighlightActionFor, getHighlighted } from '../../Overview/overview.selectors';
import { clearHighlight } from '../../Overview/overview.actions';
import { Endpoints, OverviewTypes } from '../../../Constants';
import cx from 'classnames';
import * as NotificationActions from '../../Notification/notification.actions';
import { getUser } from '../../Auth/auth.selector';
import { checkIfContactExistedInTeams} from '../../Contact/contact.actions';

let arrayFullData = [];

export const InviteToTeamsModal = (props) => {
  const {
    visible,
    clearHighlight,
    overviewType,
    contactDetail,
    notiSuccess,
    notiError,
    currentUser,
    highlighted,
    showInviteToTeam,
    showPopupInviteToTeam,
    checkIfContactExistedInTeams
  } = props;

  const [listJoinedTeam, setListJoinedTeam] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingButtonDone, setIsLoadingButtonDone] = useState(false);
  const [search, setSearch] = useState('');
  const [isFetchingList, setIsFetchingList] = useState(false);
  const [isShow, setShowHide] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    // if (contactDetail && highlighted !== contactDetail.uuid) return;
  console.log("InviteToTeamsModal -> showInviteToTeam", showInviteToTeam)
    
    if(isMounted) {
      if (isShow) {
        setShowHide(false)
      } else {
        setShowHide(true)
        setListJoinedTeam([]);
        fetchListJoinedTeam();
        setError(false);
      }
    } else {
      setIsMounted(true)
    }

  },[showInviteToTeam]);

  const fetchListJoinedTeam = async () => {
    try {
      setIsFetchingList(true);
      const res = await api.get({
        resource: `${Endpoints.Contact}/msTeam/getListJoinedTeam`,
      });
      if (res) {
        setListJoinedTeam(res);
        setIsLoading(false);
        arrayFullData = res;

        setIsFetchingList(false);

        // if(!showInviteToTeam){
        //   showPopupInviteToTeam();
        // }
      }
    } catch (e) {
      setIsLoading(false);
      setIsFetchingList(false);
    }
  };
  const handleInviteTeam = async (e) => {
    try {
      if (selectedTeam == null) {
        setError(true);
        return;
      }
      setIsLoadingButtonDone(true);

      const res = await api.post({
        resource: `${Endpoints.Contact}/msTeam/inviteToTeams`,
        query: {
          contactId: contactDetail && contactDetail.uuid,
          teamId: selectedTeam,
        },
      });
      if (res === 'SUCCESS') {
        setSelectedTeam(null);
        notiSuccess(_l`Success`, '', 2000);
        let _data = {
          contactId: contactDetail.uuid, msTeamId: selectedTeam, disableOpenList: true,
        };
        checkIfContactExistedInTeams(_data);
        setIsLoadingButtonDone(false);
        setShowHide(false)
        clearHighlight(OverviewTypes.Contact, highlighted);
      }
    } catch (error) {
      setIsLoadingButtonDone(false);
      if (error.message === 'CONTACT_HAS_NO_EMAIL') {
        notiError('Contact has no email');
      } else {
        notiError('Oh, something went wrong');
      }
    }
  };
  const handleCreateTeam = async (e) => {
    try {
      let teamName = `${currentUser && currentUser.name} - ${contactDetail.firstName} ${contactDetail.lastName}`;
      if (listJoinedTeam.filter((e) => e.displayName === teamName).length > 0) {
        let fullName = `${contactDetail.firstName} ${contactDetail.lastName}`;
        notiError(_l`You already have a private chat group with ${fullName}`, '', null, true);
        return;
      }

      setIsLoading(true);

      const res = await api.post({
        resource: `${Endpoints.Contact}/msTeam/inviteToTeams`,
        query: {
          contactId: contactDetail && contactDetail.uuid,
        },
      });
      if (res === 'SUCCESS') {
        // clearHighlight(overviewType);
        // setSelectedTeam(null);
        notiSuccess(_l`Success`, '', 2000);
        setTimeout(() => {
          fetchListJoinedTeam();
        }, 2000);
      }
    } catch (error) {
      setIsLoading(false);
      if (error.message === 'CONTACT_HAS_NO_EMAIL') {
        notiError('Contact has no email');
      } else {
        notiError('Oh, something went wrong');
      }
    }
  };
  const handleSelectTeam = (teamId) => {
    setSelectedTeam(teamId);
    setError(false);
  };
  const closePopup = () => {
    clearHighlight(OverviewTypes.Contact, highlighted);
    setSelectedTeam(null);
    setSearch('');
    setShowHide(false);
  };

  const handleSearch = (e) => {
    let value = e.target.value;
    setSearch(value);
    if (value == null || value == '') {
      setListJoinedTeam(arrayFullData);
    } else {
      setListJoinedTeam(
        arrayFullData.filter(
          (e) =>
            e.displayName &&
            e.displayName
              .toString()
              .toLowerCase()
              .includes(value.toLowerCase())
        )
      );
    }
  };

  return (
    <ModalCommon
      visible={isShow}
      size="tiny"
      title={_l`Invite`}
      onClose={handleCreateTeam}
      onDone={handleInviteTeam}
      cancelLabel={_l`Create new team`}
      okLabel={_l`Invite`}
      closeOnDimmerClick={true}
      onClickIconClose={closePopup}
      clickDimmerNotCallActionOnClose
      isLoadingCloseButton={isLoading}
      isLoadingDoneButton={isLoadingButtonDone}
      description={false}
      scrolling={false}
      id="modalInviteToTeam"
    >
      <div className={css.search}>
        <Input
          id="inputSearchGroup"
          style={{ width: '80%' }}
          value={search}
          onChange={handleSearch}
          iconPosition="left"
          placeholder={_l`Search group`}
          icon={<Icon id="iconSearchGroup" name="search" link size="small" />}
        />
      </div>
      {error && (
        <Message style={{ fontSize: '11px' }} negative>
          {_l`You must select a group first`}.
        </Message>
      )}
      {isFetchingList ? 
        <Dimmer.Dimmable
          as={Segment}
          dimmed={isFetchingList}
          style={{ display: isFetchingList ? 'block' : 'none', height: '320px' }}
        >
          <Dimmer active={isFetchingList}>
            <Loader></Loader>
          </Dimmer>
        </Dimmer.Dimmable>
        
      : 
        <div className={cx(listJoinedTeam && listJoinedTeam.length <= 6 ? `tableNotScroll` : `tableScroll`)}>
          {listJoinedTeam && listJoinedTeam.length == 0 ? (
            <div style={{ marginTop: '85px' }}>
              <Message error icon>
                <Icon name="search" />
                <Message.Content>
                  <Message.Header>{_l`No results`}</Message.Header>
                  {_l`Your search/filtering yielded no results, please try again with a different search term or filter`}
                </Message.Content>
              </Message>
            </div>
          ) : (
            <Table compact className={css.tableActions}>
              <Table.Body>
                {listJoinedTeam &&
                  listJoinedTeam.map((e, index) => {
                    return (
                      <Table.Row
                        className={cx(css.row, selectedTeam == e.id && css.selectedRow)}
                        key={index}
                        onClick={() => handleSelectTeam(e.id)}
                      >
                        <Table.Cell>
                          <div className={css.itemRow}>
                            {e.displayName}
                            {selectedTeam == e.id && <Icon name="check" />}
                          </div>
                        </Table.Cell>
                      </Table.Row>
                    );
                  })}
              </Table.Body>
            </Table>
          )}
        </div>
      }
    </ModalCommon>
  );
};

const mapStateToProps = (state, { overviewType }) => {
  let overviewT = OverviewTypes.Contact;
  const highlighted = getHighlighted(state, overviewT);
  const visible = isHighlightActionFor(state, overviewT, highlighted, 'showInviteToTeam');

  return {
    visible,
    highlighted,
    contactDetail: state.entities.contact.__DETAIL,
    currentUser: getUser(state),
    showInviteToTeam: state.entities.contact.showInviteToTeam,
  };
};

const mapDispatchToProps = {
  clearHighlight,
  notiSuccess: NotificationActions.success,
  notiError: NotificationActions.error,
  checkIfContactExistedInTeams
};

export default connect(mapStateToProps, mapDispatchToProps)(InviteToTeamsModal);