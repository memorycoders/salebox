import React, { useEffect, useState } from 'react';
import ModalCommon from '../../ModalCommon/ModalCommon';
import _l from 'lib/i18n';
import { ModalContent, Loader, Dimmer, Segment, Input, Icon, Label, Image, Popup } from 'semantic-ui-react';
import api from '../../../lib/apiClient';
import moment from 'moment';
import css from './SpecialCustomField.css';
import noneAvatar from '../../../../public/none_avatar.png';
import { forEach, filter } from 'lodash';
import AddMenuItemChat from './AddMenuItemChat';
import smileIcon from '../../../../public/smile.png';
import { connect } from 'react-redux';
import { getUser } from '../../Auth/auth.selector';
import AvatarMSTeam from './AvatarMSTeam';
import { Endpoints } from '../../../Constants';
import { addLatestCommunication } from '../../Contact/contact.actions';

const ChatPopup = (props) => {
  const [isShowPopupChat, showPopupChat] = useState(false);
  const [messages, setMessages] = useState(null);
  const [replies, setReplies] = useState({});
  const [isLoading, setStatusLoading] = useState(false);
  const [isLoadingSendMessage, setLoadingSendMessage] = useState(false)
  const [replyId, setReplyId] = useState(null);
  const [replyValue, setReplyValue] = useState('');
  const [messageValue, setMessageValue] = useState('');
  const [timeFetchNewMessage, setTimeFetchNewMessage] = useState(0);
  const { showHideListChannel, setChannelId } = props;
  const pageSizeReply = 2;
  const [accessToken, setAccessToken] = useState(null);
  const [latestMessage, setLastestMessage] = useState(null);
  const [existIDs, setExistID] = useState([])

  // const isURLs = (url) => {
  //   const regex = /(?<!\?.+)(?<=\/)[\w-]+(?=[/\r\n?]|$)/g;
  //   return regex.test(url);
  // };
  useEffect(() => {
    if(props.channelId) {
      setExistID([])
      getChannelMessage();
      setTimeFetchNewMessage(Date.now());
    }
  }, [props.channelId]);

  useEffect(() => {
    if (isShowPopupChat && props.channelId === props.notificationMsTeamsMessage.objectId) {
      fetchNewMessage(timeFetchNewMessage);
      setTimeFetchNewMessage(Date.now());
    }
  }, [props.notificationMsTeamsMessage]);

  const getChannelMessage = async () => {
    try {
      if (props.channelId && props.msTeamsId) {

        if(props.statusChannelPopup) {
          showHideListChannel(false);
        }
        setStatusLoading(true);
        showPopupChat(true);
        setMessages(null);
        const res = await getMessage(false);
        setReplies({
          ...replies,
          ...res.replies,
        });
        setMessages(res);
        setStatusLoading(false);
        if (res && res.msTeamChannelMessageDTOList) {
          setLastestMessage(res.msTeamChannelMessageDTOList[0]);
        }
      }
    } catch (ex) {
    console.log("getChannelMessage -> ex", ex)
      
    }
  };

  const getMessage = async (isLoadMore) => {
    try {
      const res = await api.post({
        resource: `${Endpoints.Contact}/msTeam/getChannelMessage`,
        query: {
          pageSizeMessage: 4,
          isLoadMore: isLoadMore,
          pageSizeReply: pageSizeReply,
        },
        data: {
          teamId: props.msTeamsId,
          channelId: props.channelId,
        },
      });
      let _replies = {};
      forEach(res.msTeamChannelMessageDTOList, (mess) => {
        _replies[mess.id] = mess.replies;
      });
      res['replies'] = _replies;
      if (res && res.accessToken) {
        setAccessToken(res.accessToken);
      }
      return res;
    } catch (ex) {}
  };

  const getMoreMessage = async () => {
    const res = await getMessage(true);
    setReplies({
      ...replies,
      ...res.replies,
    });

    setMessages({
      ...messages,
      lastPage: res.lastPage,
      msTeamChannelMessageDTOList: messages.msTeamChannelMessageDTOList.concat(res.msTeamChannelMessageDTOList),
    });
  };

  const getMoreReply = async (mess) => {
    try {
      const res = await api.post({
        resource: `${Endpoints.Contact}/msTeam/getMessageReply`,
        query: {
          pageSize: pageSizeReply,
          isLoadMore: true,
        },
        data: {
          teamId: props.msTeamsId,
          channelId: props.channelId,
          messageId: mess.id,
        },
      });
      let _replies = replies[mess.id];
      _replies.lastPage = res.lastPage;
      _replies.msTeamChannelMessageDTOList = _replies.msTeamChannelMessageDTOList.concat(
        res.msTeamChannelMessageDTOList
      );

      setReplies({
        ...replies,
        [mess.id]: _replies,
      });
    } catch (ex) {}
  };

  const handleReply = (id) => {
    if (id === replyId) {
      setReplyId(null);
    } else {
      setReplyId(id);
      setReplyValue('');
    }
  };

  const sendReply = async () => {
    if (replyValue) {
      try {
        const res = await api.post({
          resource: `${Endpoints.Contact}/msTeam/replyMessage`,
          query: {
            teamId: props.msTeamsId,
            channelId: props.channelId,
            messageId: replyId,
          },
          data: {
            body: {
              contentType: 'html',
              content: replyValue,
              // content: isURLs(replyValue) ? <a href={replyValue}>{`${replyValue}`}</a> : replyValue,
            },
          },
        });

        if (res) {
          setReplies({
            ...replies,
            [replyId]: {
              ...replies[replyId],
              msTeamChannelMessageDTOList: replies[replyId].msTeamChannelMessageDTOList.concat(res),
            },
          });

          // setLastestMessage(res);
        }
        setReplyId(null);
      } catch (ex) {
        setReplyId(null);
      }
    }
  };

  const sendMessage = async () => {
    if (messageValue) {
      setLoadingSendMessage(true)
      try {
        const res = await api.post({
          resource: `${Endpoints.Contact}/msTeam/sendMessage`,
          query: {
            teamId: props.msTeamsId,
            channelId: props.channelId,
          },
          data: {
            body: {
              contentType: 'html',
              content: messageValue,
            },
          },
        });

        if (res) {
          setMessages({
            ...messages,
            msTeamChannelMessageDTOList: [res].concat(messages.msTeamChannelMessageDTOList),
          });
          setReplies({
            ...replies,
            [res.id]: res.replies ? res.replies : { lastPage: true, msTeamChannelMessageDTOList: [] },
          });
          setLoadingSendMessage(false)
          setExistID([...existIDs, res.id])
          setTimeFetchNewMessage(Date.now());
        }
        setMessageValue('');
      } catch (ex) {
        setLoadingSendMessage(false)
        setMessageValue('');
      }
    }
  };

  const fetchNewMessage = async (filterDate) => {
    try {
      const res = await api.post({
        resource: `${Endpoints.Contact}/msTeam/getChannelMessageNoPagination`,
        data: {
          teamId: props.msTeamsId,
          channelId: props.channelId,
          filterDate: filterDate,
        },
      });
      if (res.length > 0) {
        let listMess = filter(res, (item) => {
          if(existIDs.indexOf(item.id) === -1) {
            return item;
          }
        })

        let listOldMessage = [];
        for (let i = 0; i < messages.msTeamChannelMessageDTOList.length; i++) {
          for (let j = 0; j < res.length; j ++) {
            if(messages.msTeamChannelMessageDTOList[i].id !== res[j].id) {
              listOldMessage = [...listOldMessage, messages.msTeamChannelMessageDTOList[i]];
            }
          }
        }
        console.log("fetchNewMessage -> listOldMessage", listOldMessage)

      
        setLoadingSendMessage(false)
        setMessages({
          ...messages,
          msTeamChannelMessageDTOList: [...listMess, ...listOldMessage],
        });

        for(let r = 0 ; r < res.length; r++) {
          if(res[r].replies.msTeamChannelMessageDTOList) {
            setReplies({
              ...replies,
              [res[r].id]: { lastPage: true, msTeamChannelMessageDTOList: res[r].replies.msTeamChannelMessageDTOList},
            });
          }
        }
  
      }
    } catch (ex) {}
  };

  const handleChangeMessageValue = (e) => {
    setMessageValue(e.currentTarget.value);
  };
  const handleChangeValue = (e) => {
    setReplyValue(e.currentTarget.value);
  };
  const hanldeKeyDownMesseage = (e) => {
    if (e.key == 'Enter') {
      sendMessage();
    }
  };
  const hanldeKeyDownReply = (e) => {
    if (e.key == 'Enter') {
      sendReply();
    }
  };
  const closePopup = async () => {
    showPopupChat(false);
    showHideListChannel(true);
    setChannelId(null);
    setReplyId(null);
    setTimeFetchNewMessage(0);

    let firstlElement = messages && messages.msTeamChannelMessageDTOList[0];

    if (latestMessage && firstlElement && latestMessage.id !== firstlElement.id) {
      // console.log(object);
      setLastestMessage(firstlElement);
      try {
        const savedCommunicationLog = await api.post({
          resource: `${Endpoints.Contact}/msTeam/saveCommunicationHistory`,
          query: {
            contactId: props.contactDetail && props.contactDetail.uuid,
          },
          data: {
            ...firstlElement,
          },
        });
        if (savedCommunicationLog) {
          console.log('--------------vao dayy');
          props.addLatestCommunication(props.contactDetail.uuid, savedCommunicationLog);
        }
      } catch (error) {}
    }
  };

  const chooseEmoji = (e, emojiObject) => {
    e.stopPropagation();

    setMessageValue(`${messageValue}${emojiObject.emoji}`);
  };
  const handleClickEmojiPicker = (e) => {
    e.stopPropagation();
  };
  return (
    <>
      <ModalCommon
        title={_l`Message`}
        visible={isShowPopupChat}
        size="tiny"
        okLabel={_l`Close`}
        cancelHidden
        onClose={closePopup}
        onDone={closePopup}
        dimmer={true}
      >
        <ModalContent>
          {isLoading ? (
            <Dimmer.Dimmable
              as={Segment}
              dimmed={isLoading}
              style={{ display: isLoading ? 'block' : 'none', height: '80px' }}
            >
              <Dimmer active={isLoading}>
                <Loader></Loader>
              </Dimmer>
            </Dimmer.Dimmable>
          ) : (
            <>
              <div className={css.container}>
                <div className={css.sendMessage}>
                  {/* <div className={css.iconBorderInput}>
                    <Image src={smileIcon} width={26} height={24} />
                  </div> */}
                  <Input
                    loading={isLoadingSendMessage}
                    id="InputMessageChatPopup"
                    value={messageValue}
                    onChange={handleChangeMessageValue}
                    onKeyDown={hanldeKeyDownMesseage}
                    fluid
                    placeholder={_l`Type your message here`}
                    icon={<Icon id="iconSendMessage" onClick={sendMessage} name="send" link />}
                  />
                </div>
                <p className={css.history}>{_l`History`}</p>
                {messages && messages.msTeamChannelMessageDTOList.length > 0 ? (
                  messages.msTeamChannelMessageDTOList.map((mess, index) => {
                    return (
                      <div key={`mess-${index}`}>
                        <div className={css.comment}>
                          <div className={css.wrapAvatar}>
                            <div>
                              <AvatarMSTeam message={mess} accessToken={accessToken} />
                              {/* <Image className={css.avartar} size="mini" src={noneAvatar} circular />{' '} */}
                            </div>
                            <div className={css.time}>{moment(mess.createdDateTime).format('HH:mm DD MMM, YYYY')}</div>
                          </div>
                          <div className={css.content}>
                            <Label
                              pointing="left"
                              className={`${css.bubbles} ${
                                mess && mess.from && mess.from.user.userLogin ? '' : css.notuserLogin
                              }`}
                            >
                              {/* <span className={css.name}>
                                {mess.from && mess.from.user && mess.from.user.displayName}
                              </span> */}
                              <p dangerouslySetInnerHTML={{ __html: mess && mess.body && mess.body.content }}></p>
                            </Label>
                            <a className={css.btnReply} onClick={() => handleReply(mess.id)}>{_l`Reply`}</a>
                            <div style={{ padding: '10px 0', display: replyId === mess.id ? 'block' : 'none' }}>
                              <Input
                                placeholder={_l`Type your message here`}
                                fluid
                                value={replyValue}
                                onChange={handleChangeValue}
                                onKeyDown={hanldeKeyDownReply}
                                icon={<Icon id="iconSendMessage" onClick={sendReply} name="send" link />}
                              />
                            </div>
                            {mess && mess.from && mess.from.user.userLogin == false && (
                              <AddMenuItemChat messeage={mess} />
                            )}
                          </div>
                        </div>
                        {replies[mess.id] &&
                        replies[mess.id].msTeamChannelMessageDTOList &&
                        replies[mess.id].msTeamChannelMessageDTOList.length > 0 ? (
                          <div className={css.childComment}>
                            {replies[mess.id].msTeamChannelMessageDTOList.map((rep, indexChild) => {
                              return (
                                <div className={css.comment} key={`mess-child-${indexChild}`}>
                                  <div className={css.wrapAvatar}>
                                    <div>
                                      <AvatarMSTeam message={rep} accessToken={accessToken} />
                                      {/* <Image className={css.avartar} size="mini" src={noneAvatar} circular />{' '} */}
                                    </div>
                                    <div className={css.time}>
                                      {moment(rep.createdDateTime).format('HH:mm DD MMM, YYYY')}
                                    </div>
                                  </div>
                                  <div className={css.content}>
                                    <Label
                                      pointing="left"
                                      className={`${css.bubbles} ${
                                        rep && rep.from && rep.from.user.userLogin ? '': css.notuserLogin
                                      }`}
                                    >
                                      {/* <span className={css.name}>
                                        {rep.from && rep.from.user && rep.from.user.displayName}
                                      </span> */}
                                      <p dangerouslySetInnerHTML={{ __html: rep.body.content }} />
                                    </Label>
                                    {rep && rep.from && rep.from.user.userLogin == false && (
                                      <AddMenuItemChat messeage={rep} />
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                            {replies[mess.id].lastPage ? null : (
                              <div
                                className={css.btnLoadmore}
                                onClick={() => {
                                  getMoreReply(mess, index);
                                }}
                              >
                                <a>Load more</a>
                              </div>
                            )}
                          </div>
                        ) : null}
                      </div>
                    );
                  })
                ) : isLoading ? null : (
                  <p>{_l`No message`}</p>
                )}
              </div>
              {(messages && messages.lastPage) || isLoading ? null : (
                <div className={css.btnLoadmore} onClick={getMoreMessage}>
                  <a>Load more</a>
                </div>
              )}
            </>
          )}
        </ModalContent>
      </ModalCommon>
    </>
  );
};

const mapStateToProps = (state) => ({
  currentUser: getUser(state),
  contactDetail: state.entities.contact.__DETAIL,
  notificationMsTeamsMessage: state.common.notificationMsTeamsMessage,
});

const mapDispatchToProps = {
  addLatestCommunication,
};
export default connect(mapStateToProps, mapDispatchToProps)(ChatPopup);
