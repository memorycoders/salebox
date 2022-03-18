import React, { useState, useEffect, useRef } from 'react';
import Collapsible from '../../Collapsible/Collapsible';
import _l from 'lib/i18n';
import { Form } from 'semantic-ui-react';
import { connect } from 'react-redux';
import api from '../../../lib/apiClient';
import ListChannelOfTeams from './ListChannelOfTeams';
import css from './SpecialCustomField.css';
import ChatPopup from './ChatPopup';
import { Endpoints, ObjectTypes } from '../../../Constants';
import { showListChannelMsTeam } from '../../Contact/contact.actions';

const SpecialCustomField = (props) => {
  const { objectType, objectId, contactDetail, listProjectForum } = props;

  const ACTION_TYPE = {
    CHAT: 'CHAT',
    REDIRECT_URL: 'REDIRECT_URL',
  };
  const [listChannels, setListChannel] = useState({ status: false, data: [] });
  const [channelId, setChannelId] = useState(null);
  const [actionType, setActionType] = useState(ACTION_TYPE.CHAT);
  const [lastStatusShowListChannelMsTeams, setLastStatusShowListChannelMsTeams] = useState(false);
  const [hasConnectTeams, setHasConnectTeams] = useState(false);
  const [teamId, setTeamId] = useState(null)
  const [isShowPopup, setStatusPopup] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [isFetchingChannel, setStatusFetchingChannel] = useState(false)



  const getProjectForums = async () => {
    if (objectType === ObjectTypes.Account || objectType === ObjectTypes.Opportunity) {
      // try {
      //   const res = await api.get({
      //     resource: `${Endpoints.Contact}/msTeam/getProjectForums`,
      //     query: {
      //       objectId: objectId,
      //       objectType: objectType === ObjectTypes.Account ? 'ACCOUNT' : 'OPPORTUNITY',
      //     },
      //   });
      //   if (res && res.code == null) {
      //     setHasConnectTeams(true);
      //     setListChannel(res.channelDTOList);
      //   }
      // } catch (error) {}
      if(listProjectForum?.code == null && listProjectForum?.channelDTOList?.length > 0) {
        setListChannel({status: false, data: listProjectForum.channelDTOList});
        setHasConnectTeams(true);
      }

    }
  };

  useEffect(() => {
    getProjectForums();

  }, [objectId, listProjectForum]);

  useEffect(() => {
    if(isMounted) {
      if(!isShowPopup) {
        setStatusPopup(true)
        setActionType(ACTION_TYPE.CHAT);
        getListChannelByTeamId(ACTION_TYPE.CHAT);
      } else {
        setStatusPopup(false)
      }
    } else {
      setIsMounted(true)
    }
    //   if (lastStatusShowListChannelMsTeams !== props.showListChannelMsTeams) {
    //     if (!listChannels.status) {
    //       setActionType(ACTION_TYPE.CHAT);
    //       getListChannelByTeamId(ACTION_TYPE.CHAT);
    //     }
    //   }
  }, [props.showListChannelMsTeams]);

  const getListChannelByTeamId = async (type) => {
    try {
      setStatusFetchingChannel(true)
      setListChannel({
        ...listChannels,
        status: true,
      });
      // let teamsId = props.statusMsTeams.msTeamsId;
      let contactId =  contactDetail && contactDetail.uuid;
      if (contactId) {
        let res = await api.get({
          resource: `${Endpoints.Contact}/msTeam/getListChannelByContactId/${contactId}`,
        });
        setStatusFetchingChannel(false)

        if (res && res.length === 1) {
          setListChannel({
            status: false,
            data: res,
          });
        console.log("getListChannelByTeamId -> type", type)

          if (type == ACTION_TYPE.CHAT) {
            selectChannel(res[0], type);
          } else {
            console.log("getListChannelByTeamId -> type", type)

            window.open(res[0].webUrl, '_blank');
          }
        } else {
          setListChannel({
            status: true,
            data: res,
          });
        }
      }
    } catch (ex) {
      setStatusFetchingChannel(false)
    }
  };

  const handleActionClick = (type) => {
    const { objectType } = props;

    setActionType(type);

    if (objectType === ObjectTypes.Contact) {
      getListChannelByTeamId(type);
    }
    props.showListChannelMsTeam(false);
  };

  const closeListChannel = () => {
    if(listChannels.status) {
      setListChannel({
        ...listChannels,
        status: false,
      });
      setChannelId(null);
    }
    setStatusPopup(false)
    // if(props.showListChannelMsTeams)
    //   props.showListChannelMsTeam(false);
  };

  const showHideListChannel = (status) => {

    if (listChannels.data.length === 1) {
        closeListChannel();
    } else {
      setListChannel({
        ...listChannels,
        status,
      });
    }
  };

  const selectChannel = async (channel, _type) => {
    if(channel && channel.teamId)
      setTeamId(channel.teamId);
    if(!_type) {
      _type = actionType
    }
    if (_type === ACTION_TYPE.CHAT) {
      setChannelId(channel.id);
    } else {
      window.open(channel.webUrl, '_blank');
    }
  };

  return (
    <>
      {objectType === ObjectTypes.Account && hasConnectTeams && (
        <Form>
          <div
            onClick={() => {
              handleActionClick(ACTION_TYPE.REDIRECT_URL);
            }}
            className={`${css.cursorPoiter} ${css.teamProject}`}
          >
            <span>{_l`Teams project forums`}</span> <span className={css.iconMSTeams}></span>
          </div>
        </Form>
      )}
      {objectType === ObjectTypes.Opportunity && hasConnectTeams && (
        <Form>
          <div
            onClick={() => {
              handleActionClick(ACTION_TYPE.REDIRECT_URL);
            }}
            className={`${css.cursorPoiter} ${css.teamProject}`}
          >
            <span>{_l`Teams project forums`}</span> <span className={css.iconMSTeams}></span>
          </div>
        </Form>
      )}
      {objectType === ObjectTypes.Contact && (
        <Form>
          <div
            onClick={() => {
              handleActionClick(ACTION_TYPE.REDIRECT_URL);
            }}
            className={`${css.cursorPoiter} ${css.teamProject}`}
          >
            <span>{_l`Teams project forums`}</span> <span className={css.iconMSTeams}></span>
          </div>
        </Form>
      )}

      <ListChannelOfTeams
        onDone={closeListChannel}
        listChannels={listChannels}
        onClick={selectChannel}
        showListChannelMsTeams={lastStatusShowListChannelMsTeams}
        isFetchingChannel={isFetchingChannel}
      />
      <ChatPopup
        setChannelId={setChannelId}
        statusChannelPopup={listChannels.status}
        showHideListChannel={showHideListChannel}
        channelId={channelId}
        // msTeamsId={props.statusMsTeams && props.statusMsTeams.msTeamsId}
        msTeamsId ={teamId}
      />
    </>
  );
};

export default connect(
  (state) => ({
    statusMsTeams: state.entities.contact.statusMsTeams,
    showListChannelMsTeams: state.entities.contact.showListChannelMsTeams,
    contactDetail: state.entities.contact["__DETAIL"],
  }),
  {
    showListChannelMsTeam,
  }
)(SpecialCustomField);
