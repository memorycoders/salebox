import React, { useState, useEffect } from 'react';
import IntergrationPane from '../IntergrationPane';
import css from '../ImportContacts/importContact.css';
import iconDropbox from  '../../../../public/icon_Dropbox-2x.png';
import iconGoogleDrive from '../../../../public/icon_Googledrive-2x.png';
import iconOneDrive from '../../../../public/icon_Onedrive-2x.png';
import iconMailChimp from '../../../../public/icon_Mailchimp2-2x.png';
import iconFortNox from '../../../../public/fort_nox.png';
import fortNoxStep1 from '../../../../public/fortnox/step1.png';
import fortNoxStep2 from '../../../../public/fortnox/step2.png';
import fortNoxStep3 from '../../../../public/fortnox/step3.png';
import fortNoxStep4 from '../../../../public/fortnox/step4.png';
import _l from 'lib/i18n';
import cx from 'classnames';
import { Grid, Icon, Input, ModalContent, Popup } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { forEach, co, values } from 'lodash';
import { Endpoints, popupWindow } from '../../../Constants';
import AppConfig from '../../../../config/app.config';
import api from '../../../lib/apiClient';
import ConfirmModal from '../../Common/Modal/ConfirmModal';
import * as NotificationActions from 'components/Notification/notification.actions';
import ModalCommon from '../../ModalCommon/ModalCommon';
import ToggleSwitch from '../../CompanySettings/DefaultValues/SaleProcess/Detail/ToggleSwitch';
import { setStatusConnectStorage } from '../../Common/common.actions';
import signInGoogle from '../../../../public/btnSignInGoogledark.png';

const CompanyIntegrations = (props) => {
  const INTEGRATIONS = {
    DROP_BOX: 'DROP_BOX',
    GOOGLE_DRIVE: 'GOOGLE_DRIVE',
    ONE_DRIVE_FOR_BUSINESS: "ONE_DRIVE_FOR_BUSINESS",
    MAIL_CHIMP_WEB: 'MAIL_CHIMP_WEB',
    FORTNOX_API_KEY: 'FORTNOX_API_KEY',
    FORTNOX_COMPANY_NAME: 'FORTNOX_COMPANY_NAME'
  }
  const {integrations, listPersonalStorage, userStorageIntegrationDTOList, putError} = props;
  const [isLinkedGoogle, setLinkedGoogle] = useState(false);
  const [isLinkedDropbox, setLinkedDropbox] = useState(false);
  const [isLinkedOnedrive, setLinkedOnedrive] = useState(false);
  const [isLinkedMailChimp, setLinkedMailChimp] = useState(false);
  const [isLinkedFortnox, setLinkedFortnox] = useState(false)

  const [usingStorage, setUsingStorage] = useState('');
  const [canLinkStorage, setCanLinkStorage] = useState(true);
  const [confirmModal, setConfirmModal] = useState({status: false, title: '', fnOk: null, fnCancel: null})
  const [googleDriveStorage, setGoogleDriveStorage] = useState(null);
  const [onedriveStorage, setOnedriveStorage] = useState(null);
  const [mailChimpStorage, setMailChimpStorage] = useState(null)
  const [dropboxStorage, setDropboxStorage] = useState(null)
  const [listDropboxStorage, setListDropboxStorage] = useState([])
  const [fortnoxStorage, setFortnoxStorage] = useState(null)

  const [isAddGoogleStorage, addGoogleStorage] = useState(false)
  const [isAddOnedriveStorage, addOnedriveStorage] = useState(false)
  const [isAddDropbox, addDropbox] = useState(false)

  const [isShowGuideFortnox, showGuideFortnox] = useState(false)
  const [isShowAddKeyFortnox, showAddKeyFortnox] = useState(false)

  const [keyFortnox, setKeyFortnox] = useState('')

  const [fortnoxConfig, setFortnoxConfig] = useState({})
  const [isShowFortnoxConfig, showFortnoxConfig] = useState(false)
  const [fortNoxCompanyName, setFortnoxCompanyName] = useState(null);

  useEffect(() => {
    checkStorage(userStorageIntegrationDTOList);
  }, [userStorageIntegrationDTOList])

  useEffect(() => {
    fetchStorage();
  }, [])


  const fetchStorage = async () => {
    try {
      const res = await api.get({
        resource: `${Endpoints.Enterprise}/storage/list`,
      });
      if(res) {
        const integrations = res.storageDTOList;
        console.log("fetchStorage -> integrations", integrations)
        let _canLinkStorage = true;
        forEach(integrations, (item) => {
          switch(item.type) {
            case INTEGRATIONS.DROP_BOX :
              setLinkedDropbox(true);
              setUsingStorage(INTEGRATIONS.DROP_BOX);
              setDropboxStorage(item)
              _canLinkStorage = false;
              break;
          case INTEGRATIONS.GOOGLE_DRIVE :
              setLinkedGoogle(true);
              setUsingStorage(INTEGRATIONS.GOOGLE_DRIVE);
              setGoogleDriveStorage(item);
              _canLinkStorage = false;
              break;
          case INTEGRATIONS.ONE_DRIVE_FOR_BUSINESS:

            setLinkedOnedrive(true);
            setUsingStorage(INTEGRATIONS.ONE_DRIVE_FOR_BUSINESS);
            setOnedriveStorage(item);
            _canLinkStorage = false;
            break;
          case INTEGRATIONS.MAIL_CHIMP_WEB:
            setLinkedMailChimp(true);
            setMailChimpStorage(item);
            break;
          case INTEGRATIONS.FORTNOX_API_KEY:
            setFortnoxStorage(item);
            setLinkedFortnox(true);
            break;
          case INTEGRATIONS.FORTNOX_COMPANY_NAME:
            setFortnoxCompanyName(item);
            break;
          }
        })
        setCanLinkStorage(_canLinkStorage);
        props.setStatusConnectStorage(!_canLinkStorage);

      }
    }catch(ex){}

  }

  const checkStorage = (userStorageIntegrationDTOList) =>  {
    let dropboxs = []
    userStorageIntegrationDTOList.forEach((iter) => {
      if (['GOOGLE_WEB', 'GOOGLE_DRIVE', 'GOOGLE_IOS', 'GOOGLE_DIVER'].indexOf(iter.type) > -1) {
        if(isAddGoogleStorage) {
          addGoogleStorage(false)
          let dto = {
            displayName: iter.name,
            value: iter.userIdentifier,
            type: INTEGRATIONS.GOOGLE_DRIVE,
            accessToken: iter.accessToken,
            salesBoxFolderId: '',
            salesBoxFolderUrl: ''
          };
          addStorage(INTEGRATIONS.GOOGLE_DRIVE, dto);
        }
      }

      if(iter.type === INTEGRATIONS.ONE_DRIVE_FOR_BUSINESS) {
        if(isAddOnedriveStorage) {
          addOnedriveStorage(false)
          let dto = {
            displayName: iter.name,
            value: iter.userIdentifier,
            type: INTEGRATIONS.ONE_DRIVE_FOR_BUSINESS,
            accessToken: iter.accessToken,
            salesBoxFolderId: '',
            salesBoxFolderUrl: ''
          };
          addStorage(INTEGRATIONS.ONE_DRIVE_FOR_BUSINESS, dto);
        }
      }
      if(iter.type === INTEGRATIONS.DROP_BOX) {
        dropboxs.push(iter)
        // if(isAddDropbox) {
        //   addDropbox(false)
        //   let dto = {
        //     displayName: iter.name,
        //     value: iter.userIdentifier,
        //     type: INTEGRATIONS.DROP_BOX,
        //     accessToken: iter.accessToken,
        //     salesBoxFolderId: '',
        //     salesBoxFolderUrl: ''
        //   };
        //   addStorage(INTEGRATIONS.DROP_BOX, dto);
        // }
      }
    })
    setListDropboxStorage(dropboxs)
  }

  const addStorage = async (type, dto) => {
    try {
      const res = await api.post({
        resource: `${Endpoints.Enterprise}/storage/add`,
        data: dto
      });
      if(res) {
        switch(type) {
          case INTEGRATIONS.GOOGLE_DRIVE:
            setGoogleDriveStorage(res);
            setLinkedGoogle(true);
            setCanLinkStorage(false);
            getSalesboxFolder()
            props.setStatusConnectStorage(true);
            break;
          case INTEGRATIONS.ONE_DRIVE_FOR_BUSINESS:
            setOnedriveStorage(res);
            setLinkedOnedrive(true);
            setCanLinkStorage(false);
            getSalesboxFolder();
            props.setStatusConnectStorage(true);
            break;
          case INTEGRATIONS.DROP_BOX:
            setDropboxStorage(res);
            setLinkedDropbox(true);
            setCanLinkStorage(false)
            props.setStatusConnectStorage(true);
            break;
          case INTEGRATIONS.FORTNOX_API_KEY:
            setFortnoxStorage(res);
            setLinkedFortnox(true)
            break;
        }
      }
    }catch(ex){}
  }
  const linkGoogle = () => {
    if(canLinkStorage) {
      const popup = popupWindow('https://accounts.google.com/o/oauth2/auth?response_type=code&client_id=' + AppConfig.google_client_id + '&redirect_uri=' + encodeURIComponent(AppConfig.redirect_uri) + "&access_type=offline&approval_prompt=force" +
      "&state=googleDriver&scope=profile " + AppConfig.google_drive_scope.join(' '), 'Google', 600, 600);
      let timer = setInterval(() => {
      if (!popup || popup.closed) {
        addGoogleStorage(true)
        clearInterval(timer);
        listPersonalStorage();
      }
      }, 100);
    }
  }

  const unLinkGoogle = () => {
    const _modal = {
      status: true,
      title: _l`Do you want to unlink this account?`,
      fnOk: async () => {
        try {
          if(googleDriveStorage) {
            const rs = await api.get({
              resource: `${Endpoints.Enterprise}/storage/delete/${googleDriveStorage.uuid}`,
            });
            if (rs) {
              setLinkedGoogle(false)
              setCanLinkStorage(true)
              setGoogleDriveStorage(null)
              setConfirmModal({ status: false });
              props.setStatusConnectStorage(false);

            }
          }
        } catch (error) {
          putError('');
        }
      },
      fnCancel: () => {
        setConfirmModal({ status: false });
      },
    };
    setConfirmModal(_modal);
  }

  const linkOneDriveForBusiness = () => {
    if(canLinkStorage) {
      const popup = popupWindow('https://login.microsoftonline.com/common/oauth2/authorize?client_id=' + AppConfig.onedrive_for_business_app_id +
      '&response_type=code&redirect_uri=' + encodeURIComponent(AppConfig.redirect_uri) +
      "&state=onedriveForBusiness&scope=offline_access files.readwrite",
      'OneDrive For Business', 600, 600);
      let timer = setInterval(() => {
      if (!popup || popup.closed) {
        addOnedriveStorage(true)
        clearInterval(timer);
        listPersonalStorage();
      }
      }, 100);
    }
  }

  const unLinkOneDriveForBusiness = () => {
    const _modal = {
      status: true,
      title: _l`Do you want to unlink this account?`,
      fnOk: async () => {
        try {

          if(onedriveStorage) {
            const rs = await api.get({
              resource: `${Endpoints.Enterprise}/storage/delete/${onedriveStorage.uuid}`,
            });
            if (rs) {
              setLinkedOnedrive(false)
              setCanLinkStorage(true)
              setOnedriveStorage(null)
              setConfirmModal({ status: false });
              props.setStatusConnectStorage(false);

            }
          }
        } catch (error) {
          putError('');
        }
      },
      fnCancel: () => {
        setConfirmModal({ status: false });
      },
    };
    setConfirmModal(_modal);
  }

  const linkMailChimp = () => {
    try {
      const popup = popupWindow('https://login.mailchimp.com/oauth2/authorize?response_type=code&state=mailChimp&client_id=' + AppConfig.client_id_mailChimp + '&redirect_uri=' + encodeURIComponent(AppConfig.redirect_uri), 'MailChimp', 600, 600);
      let timer = setInterval(() => {
      if (!popup || popup.closed) {
        clearInterval(timer);
        fetchStorage()
      }
      }, 100);

    }catch(ex){
      console.log("linkMailChimp -> ex", ex)
    }
  }

  const unLinkMailChimp = () => {
    const _modal = {
      status: true,
      title: _l`Do you want to unlink this account?`,
      fnOk: async () => {
        try {
          if(mailChimpStorage) {
            const rs = await api.get({
              resource: `${Endpoints.Enterprise}/storage/delete/${mailChimpStorage.uuid}`,
            });
            if (rs) {
              setLinkedMailChimp(false)
              setConfirmModal({ status: false });
              setMailChimpStorage(null)
            }
          }
        } catch (error) {
          putError('');
        }
      },
      fnCancel: () => {
        setConfirmModal({ status: false });
      },
    };
    setConfirmModal(_modal);
  }

  const linkDropbox = async () => {
    try {
    let authUrl = `https://www.dropbox.com/oauth2/authorize?client_id=${AppConfig.dropbox_id}&state=dropbox&response_type=token&redirect_uri=${AppConfig.redirect_uri}`;
    const popup = popupWindow(authUrl, '_dropboxOauthSigninWindow', 700, 600);
    console.log("linkDropbox -> popup", popup)
    let timer = setInterval(() => {
      if (!popup || popup.closed) {
        // addDropbox(true)
        clearInterval(timer);
        fetchStorage();
        listPersonalStorage();
      }
    }, 100);
    }catch(ex){
    console.log("linkDropbox -> ex", ex)
    }
  }

  const unLinkDropbox = async () => {
    const _modal = {
      status: true,
      title: _l`Do you want to unlink this account?`,
      fnOk: async () => {
        try {
          if(dropboxStorage) {
            await api.get({
              resource: `${Endpoints.Enterprise}/storage/delete/${dropboxStorage.uuid}`,
            })
            if(listDropboxStorage.length > 0) {
              let listApi = []
              forEach(listDropboxStorage, (item) => {
                listApi.push(
                  api.get({
                    resource: `${Endpoints.Enterprise}/storage/personalStorageAccount/delete/${item.uuid}`,
                  })
                )
              })
              await Promise.all(listApi);
            }
            setLinkedDropbox(false)
            setConfirmModal({ status: false });
            setDropboxStorage(null)
            setCanLinkStorage(true);
            props.setStatusConnectStorage(false);
          }
        } catch (error) {
        console.log("unLinkDropbox -> error", error)
        }
      },
      fnCancel: () => {
        setConfirmModal({ status: false });
      },
    };
    setConfirmModal(_modal);
  }

  const linkFortnox = () => {
    // showAddKeyFortnox(true)
    window.open(`https://apps.fortnox.se/fs/fs/login.php?relay=%23%2Fmarketplace%2Fapp-details%2Fsalesbox-crm-system-ab%2Fsalesbox-crm`);
  }

  const closeGuildFortnox = () => {
    showGuideFortnox(false)
  }
  const handelShowGuideFortnox = () => {
    showGuideFortnox(true)
  }
  const closeAddKeyFortnox = () => {
    showAddKeyFortnox(false)
  }
  const addKeyFortnox = async () => {
    // type: INTEGRATIONS.FORTNOX_API_KEY,

    if(keyFortnox.length > 0) {
      let dto = {
        value: keyFortnox,
      };
      try {
        const rs = await api.post({
          resource: `${Endpoints.Enterprise}/storage/authenFortNox`,
          data: keyFortnox,
          options: {
            headers: {
              'Content-Type': 'application/json;charset=UTF-8'
            }
          }
        })
        showAddKeyFortnox(false)
        fetchStorage();
        getFortNoxConfiguration()

      }catch(ex){
        putError('Authen Fortnox Fail');
      }
      // addStorage(INTEGRATIONS.FORTNOX_API_KEY, dto)
    }
  }

  const unLinkFortnox = () => {
    const _modal = {
      status: true,
      title: _l`Do you want to unlink this account?`,
      fnOk: async () => {
        try {
          if(fortnoxStorage) {
            const rs = await api.get({
              resource: `${Endpoints.Enterprise}/storage/delete/${fortnoxStorage.uuid}`,
            });
            if (rs) {
              setLinkedFortnox(false)
              setConfirmModal({ status: false });
            }
          }
        } catch (error) {
          // putError('Authen Fortnox Fail');
        }
      },
      fnCancel: () => {
        setConfirmModal({ status: false });
      },
    };
    setConfirmModal(_modal);
  }

  const handleChangeFortnox = (e) => {
    setKeyFortnox(e.currentTarget.value)
  }

  const getFortNoxConfiguration = async () => {
    try {
      showFortnoxConfig(true)
      const rs = await api.get({
        resource: `${Endpoints.Enterprise}/company/getFortNoxConfiguration`,
      });
      if(rs && rs.fortNoxConfigurationDTOList) {
        let _fortnoxConfig = {
          account: {},
          contact: {},
          allProductConfig: {},
          productFromSalesboxConfig: {},
          automaticOrderConfig: {}
        }
        forEach(rs.fortNoxConfigurationDTOList, (item) => {
          switch(item.key) {
            case 'FORTNOX_SYNC_ACCOUNT':
              item.value = 'DISABLE'
               _fortnoxConfig.account = item
              break;
            case 'FORTNOX_SYNC_CONTACT':
              _fortnoxConfig.contact = item
              break;
            case 'FORTNOX_SYNC_ALL_PRODUCT':
                _fortnoxConfig.allProductConfig = item
              break;
            case 'FORTNOX_SYNC_PRODUCT_FROM_SALESBOX':
              _fortnoxConfig.productFromSalesboxConfig = item
              break;
            case 'FORTNOX_SYNC_AUTOMATIC_ORDER':
              _fortnoxConfig.automaticOrderConfig = item
              break;
          }
        })
        setFortnoxConfig({...fortnoxConfig, ..._fortnoxConfig})

      }

    }catch(ex){
    console.log("getFortNoxConfiguration -> ex", ex)

    }
  }

  const handleToggleChange = (type, state) => {
    setFortnoxConfig({
      ...fortnoxConfig,
      [type]: {
        ...fortnoxConfig[type],
        value: state.enabled ? 'ON' : 'OFF'
      }
    })
  }

  const closeFortnoxConfig = () => {
    showFortnoxConfig(false)
  }

  const saveFortnoxConfig = async () => {
    try {
      let dto = {
        fortNoxConfigurationDTOList: values(fortnoxConfig)
      }
      await api.post({
        resource: `${Endpoints.Enterprise}/company/updateFortNoxConfiguration`,
        data: dto
      });
      closeFortnoxConfig()
    }catch(ex) {
      console.log("saveFortnoxConfig -> ex", ex)
    }
  }

  const getSalesboxFolder = async () => {
    try {
      await api.get({
        resource: `${Endpoints.Enterprise}/storage/getSalesboxFolder`,
      });
    }catch(ex) {
      console.log("getSalesboxFolder -> ex", ex)
    }
  }



  return (
    <IntergrationPane padded title={_l`Company integrations`}>
      <Grid>

          <Grid.Row className={css.rowLink}>
            <Grid.Column width={16}>
              <Grid>
                <Grid.Row>
                  <Grid.Column width={3}>
                    <img src={iconDropbox} className={css.icon}></img>
                  </Grid.Column>
                  <Grid.Column width={7}>
                    <span className={css.txtTitle}>Dropbox</span>
                  </Grid.Column>
                  <Grid.Column width={5}>
                    <span className={css.txtTitle}>{dropboxStorage? dropboxStorage.displayName: ''}</span>
                  </Grid.Column>
                </Grid.Row>
                <div className={css.btnLink}>
                {isLinkedDropbox ? (
                  <a onClick={unLinkDropbox}
                  className={cx(css.btnSucces, css.btn, css.btnDefault, css.btnBlock, css.marginAuto)}>
                    {_l`Unlink`}
                  </a>
                ) : (
                  <a
                    onClick={linkDropbox}
                    className={cx(css.btn, css.btnDefault, css.btnBlock, css.btnPrimary, css.marginAuto,
                      { [css.btnDisable]: !canLinkStorage})}
                  >{_l`Link`}</a>
                )}
                </div>
              </Grid>
            </Grid.Column>
          </Grid.Row>

          <Grid.Row className={css.rowLink}>
            <Grid.Column width={16}>
              <Grid>
                <Grid.Row>
                  <Grid.Column width={3}>
                    <img src={iconGoogleDrive} className={css.icon}></img>
                  </Grid.Column>
                  <Grid.Column width={7}>
                    <span className={css.txtTitle}>Google Drive</span>
                  </Grid.Column>
                  <Grid.Column width={5}>
                    <span className={css.txtTitle}>{googleDriveStorage ? googleDriveStorage.displayName: ''}</span>
                  </Grid.Column>
                </Grid.Row>
                <div className={css.btnLink} style={{display:'flex', marginBottom: '15'}}>
                {isLinkedGoogle ? (
                  <a onClick={unLinkGoogle}
                  className={cx(css.btnSucces, css.btn, css.btnDefault, css.btnBlock, css.marginAuto)}>
                    {_l`Unlink`}
                  </a>
                ) : (
                  <a
                    onClick={linkGoogle}
                    className={cx(css.btn, css.btnDefault, css.btnBlock, css.btnPrimary, css.marginAuto,
                      { [css.btnDisable]: !canLinkStorage})}
                  >{_l`Link`}</a>
                  // <img onClick={linkGoogle} src={signInGoogle}  style={{margin:'auto', cursor:'pointer', width:'205px'}}/>

                )}
                </div>
              </Grid>
            </Grid.Column>
          </Grid.Row>

          <Grid.Row className={css.rowLink}>
            <Grid.Column width={16}>
              <Grid>
                <Grid.Row>
                  <Grid.Column width={3}>
                    <img style={{height: '25px'}} src={iconOneDrive} className={css.icon}></img>
                  </Grid.Column>
                  <Grid.Column width={7}>
                    <span className={css.txtTitle}>Onedrive for business</span>
                  </Grid.Column>
                  <Grid.Column width={5}>
                    <span className={css.txtTitle}>{onedriveStorage ? onedriveStorage.displayName: ''}</span>
                  </Grid.Column>
                </Grid.Row>
                <div className={css.btnLink}>
                {isLinkedOnedrive ? (
                  <a onClick={unLinkOneDriveForBusiness}
                  className={cx(css.btnSucces, css.btn, css.btnDefault, css.btnBlock, css.marginAuto)}>
                    {_l`Unlink`}
                  </a>
                ) : (
                  <a
                    onClick={linkOneDriveForBusiness}
                    className={cx(css.btn, css.btnDefault, css.btnBlock, css.btnPrimary, css.marginAuto,
                         { [css.btnDisable]: !canLinkStorage})}
                  >{_l`Link`}</a>
                )}
                </div>
              </Grid>
            </Grid.Column>
          </Grid.Row>

          <Grid.Row className={css.rowLink}>
            <Grid.Column width={16}>
              <Grid>
                <Grid.Row>
                  <Grid.Column width={3}>
                    <img src={iconMailChimp} className={css.icon}></img>
                  </Grid.Column>
                  <Grid.Column width={7}>
                    <span className={css.txtTitle}>Mailchimp</span>
                  </Grid.Column>
                  <Grid.Column width={5}>
                    <span className={css.txtTitle}>{mailChimpStorage ? mailChimpStorage.displayName: ''}</span>
                  </Grid.Column>
                </Grid.Row>
                <div className={css.btnLink}>
                {isLinkedMailChimp ? (
                  <a onClick={unLinkMailChimp}
                  className={cx(css.btnSucces, css.btn, css.btnDefault, css.btnBlock, css.marginAuto)}>
                    {_l`Unlink`}
                  </a>
                ) : (
                  <a
                    onClick={linkMailChimp}
                    className={cx(css.btn, css.btnDefault, css.btnBlock, css.btnPrimary, css.marginAuto)}
                  >{_l`Link`}</a>
                )}
                </div>
              </Grid>
            </Grid.Column>
          </Grid.Row>

          <Grid.Row className={css.rowLink}>
            <Grid.Column width={16}>
              <Grid>
                <Grid.Row>
                  <Grid.Column width={3}>
                    <img style={{height: '25px'}} src={iconFortNox} className={css.icon}></img>
                  </Grid.Column>
                  <Grid.Column width={7}>
                    <span className={css.txtTitle}>Fortnox</span>
                  </Grid.Column>
                  <Grid.Column width={6}>
                    <span className={css.txtTitle}>{fortNoxCompanyName?.value}</span>
                  </Grid.Column>
                </Grid.Row>
                <div className={css.btnLink}>
                {isLinkedFortnox ? (
                  <a onClick={unLinkFortnox}
                  className={cx(css.btnSucces, css.btn, css.btnDefault, css.btnBlock, css.marginAuto)}>
                    {_l`Unlink`}
                  </a>
                ) : (
                  <a
                    onClick={linkFortnox}
                    className={cx(css.btn, css.btnDefault, css.btnBlock, css.btnPrimary, css.marginAuto)}
                  >{_l`Link`}</a>
                )}
                </div>
              </Grid>
            </Grid.Column>
          </Grid.Row>


        </Grid>
        <ConfirmModal
          visible={confirmModal.status}
          fnOk={confirmModal.fnOk}
          fnCancel={confirmModal.fnCancel}
          title={confirmModal.title}
        />
        <ModalCommon
          title={_l`Link Fortnox`}
          visible={isShowAddKeyFortnox}
          size="tiny"
          onClose={closeAddKeyFortnox}
          onDone={addKeyFortnox}
          >
            <p onClick={handelShowGuideFortnox}>{_l`How To get API Key?`}</p>
            <Grid columns='equal'>
            <Grid.Column width={3} verticalAlign="middle">
              <label>{_l`Api Key`}</label>
            </Grid.Column>
            <Grid.Column width={13}>
              <Input value={keyFortnox} onChange={handleChangeFortnox} fluid></Input>
            </Grid.Column>
          </Grid>
        </ModalCommon>
        <ModalCommon
         title={_l`How To get API Key?`}
         visible={isShowGuideFortnox}
         size="lange"
         onClose={closeGuildFortnox}
         onDone={closeGuildFortnox}
         cancelHidden={true}
         >
           <ModalContent>
              <b>Step 1</b>
              <p>Open Fortnox and click on Manage users</p>
              <div>
                <img style={{width: "100%"}} src={fortNoxStep1}></img>
              </div>
              <b>Step 2</b>
              <p>Click on Add Integration</p>
              <div>
                <img style={{width: "100%"}} src={fortNoxStep2}></img>
              </div>
              <b>Step 3</b>
              <p>Entry : Salesbox</p>
              <div>
                <img style={{width: "100%"}} src={fortNoxStep3}></img>
              </div>
              <b>Step 4</b>
              <p>Get the API Key</p>
              <div>
              <img style={{width: "100%"}} src={fortNoxStep4}></img>
              </div>
           </ModalContent>
         </ModalCommon>

         <ModalCommon
          visible={isShowFortnoxConfig}
          title={_l`Fortnox configuration`}
          size="tiny"
          onDone={saveFortnoxConfig}
          onClose={closeFortnoxConfig}
         >
            <Grid >
              <Grid.Row>
                <Grid.Column width={10} verticalAlign="middle">
                  Account <Popup content={_l`1 way sync of Accounts with won qualified deals from Salesbox to Fortnox. When Fortnox support webhooks the sync will be 2-way`} position='top center' trigger={<Icon name="question circle outline"></Icon>} />
                </Grid.Column>
                <Grid.Column width={6} textAlign="right" verticalAlign="middle">
                  <ToggleSwitch
                    theme="graphite-small"
                    className="d-flex"
                    disable={fortnoxConfig.account && fortnoxConfig.account.value === 'DISABLE' ? true : false}
                    enabled={fortnoxConfig.account && fortnoxConfig.account.value === 'ON' ? true : false}
                    onStateChanged={(state) => {handleToggleChange('account', state)}}
                    id='ci_account'
                  />
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column width={10} verticalAlign="middle">
                Contacts <Popup content={_l`1 way sync of Contacts with won qualified deals from Salesbox to Fortnox. When Fortnox support webhooks the sync will be 2-way`} position='top center' trigger={<Icon name="question circle outline"></Icon>} />
                </Grid.Column>
                <Grid.Column width={6} textAlign="right" verticalAlign="middle">
                  <ToggleSwitch
                    theme="graphite-small"
                    className="d-flex"
                    disable={fortnoxConfig.contact && fortnoxConfig.contact.value === 'DISABLE' ? true : false}
                    enabled={fortnoxConfig.contact && fortnoxConfig.contact.value === 'ON' ? true : false}
                    onStateChanged={(state) => {handleToggleChange('contact', state)}}
                    id='ci_contact'
                  />
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column width={10} verticalAlign="middle">
                All products <Popup content={_l`2 way sync of Product group, Product type and Products`} position='top center' trigger={<Icon name="question circle outline"></Icon>} />
                </Grid.Column>
                <Grid.Column width={6} textAlign="right" verticalAlign="middle">
                  <ToggleSwitch
                    theme="graphite-small"
                    className="d-flex"
                    disable={fortnoxConfig.allProductConfig && fortnoxConfig.allProductConfig.value === 'DISABLE' ? true : false}
                    enabled={fortnoxConfig.allProductConfig && fortnoxConfig.allProductConfig.value === 'ON' ? true : false}
                    onStateChanged={(state) => {handleToggleChange('allProductConfig', state)}}
                    id='ci_product'
                  />
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column width={10} verticalAlign="middle">
                Products from Salesbox <Popup content={_l`1 way sync of Product group, Product type and Products from Salesbox to Fortnox`} position='top center' trigger={<Icon name="question circle outline"></Icon>} />
                </Grid.Column>
                <Grid.Column width={6} textAlign="right" verticalAlign="middle">
                  <ToggleSwitch
                    theme="graphite-small"
                    className="d-flex"
                    disable={fortnoxConfig.productFromSalesboxConfig && fortnoxConfig.productFromSalesboxConfig.value === 'DISABLE' ? true : false}
                    enabled={fortnoxConfig.productFromSalesboxConfig && fortnoxConfig.productFromSalesboxConfig.value === 'ON' ? true : false}
                    onStateChanged={(state) => {handleToggleChange('productFromSalesboxConfig', state)}}
                    id='ci_product_from_salesbox'
                  />
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column width={10} verticalAlign="middle">
                Create invoice from Salesbox <Popup content={_l`Automatic creation of invoice in Fortnox for won qualified deals (orders) in Salesbox`} position='top center' trigger={<Icon name="question circle outline"></Icon>} />
                </Grid.Column>
                <Grid.Column width={6} textAlign="right" verticalAlign="middle">
                  <ToggleSwitch
                    theme="graphite-small"
                    className="d-flex"
                    disable={fortnoxConfig.automaticOrderConfig && fortnoxConfig.automaticOrderConfig.value === 'DISABLE' ? true : false}
                    enabled={fortnoxConfig.automaticOrderConfig && fortnoxConfig.automaticOrderConfig.value === 'ON' ? true : false}
                    onStateChanged={(state) => {handleToggleChange('automaticOrderConfig', state)}}
                    id='ci_create_invoice'
                  />
                </Grid.Column>
              </Grid.Row>
            </Grid>
         </ModalCommon>

        {/* <ModalCommon
        title={_l`Fortnox configuration`}
        visible={false}
        size="tiny"
        >
          <p>{_l`Connecting data`}</p>
          <Progress percent={20} indicating />
        </ModalCommon> */}
    </IntergrationPane>
  )
}
export default connect(null, {
  putError: NotificationActions.error,
  setStatusConnectStorage,
})(CompanyIntegrations);

          {/* <Grid.Row>
            <Grid.Column width={16}>
              <Grid>
                <Grid.Row>
                  <Grid.Column width={2}>
                    <img src={iconDropbox}></img>
                  </Grid.Column>
                  <Grid.Column width={10}>
                    <span className={css.txtTitle}>{_l`Dropbox`}</span>
                  </Grid.Column>
                  <Grid.Column width={4}>
                    <span className={css.txtTitle}>{}</span>
                  </Grid.Column>
                </Grid.Row>
                <a
                  className={cx(css.btn, css.btnDefault, css.btnBlock, css.btnPrimary, css.marginAuto)}
                >{_l`Link`}</a>
              </Grid>
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column width={16}>
              <Grid>
                <Grid.Row>
                  <Grid.Column width={2}>
                    <img src={iconGoogleDrive}></img>
                  </Grid.Column>
                  <Grid.Column width={10}>
                    <span className={css.txtTitle}>{_l`Google Drive`}</span>
                  </Grid.Column>
                  <Grid.Column width={4}>
                    <span className={css.txtTitle}>{}</span>
                  </Grid.Column>
                </Grid.Row>
                <a
                  className={cx(css.btn, css.btnDefault, css.btnBlock, css.btnPrimary, css.marginAuto)}
                >{_l`Link`}</a>
              </Grid>
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column width={16}>
              <Grid>
                <Grid.Row>
                  <Grid.Column width={2}>
                    <img src={iconOneDrive}></img>
                  </Grid.Column>
                  <Grid.Column width={10}>
                    <span className={css.txtTitle}>{_l`Onedrive`}</span>
                  </Grid.Column>
                  <Grid.Column width={4}>
                    <span className={css.txtTitle}>{}</span>
                  </Grid.Column>
                </Grid.Row>
                <a
                  className={cx(css.btn, css.btnDefault, css.btnBlock, css.btnPrimary, css.marginAuto)}
                >{_l`Link`}</a>
              </Grid>
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column width={16}>
              <Grid>
                <Grid.Row>
                  <Grid.Column width={2}>
                    <img src={iconOneDrive}></img>
                  </Grid.Column>
                  <Grid.Column width={10}>
                    <span className={css.txtTitle}>{_l`Onedrive for business`}</span>
                  </Grid.Column>
                  <Grid.Column width={4}>
                    <span className={css.txtTitle}>{}</span>
                  </Grid.Column>
                </Grid.Row>
                <a
                  className={cx(css.btn, css.btnDefault, css.btnBlock, css.btnPrimary, css.marginAuto)}
                >{_l`Link`}</a>
              </Grid>
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column width={16}>
              <Grid>
                <Grid.Row>
                  <Grid.Column width={2}>
                    <img src={iconMailChimp}></img>
                  </Grid.Column>
                  <Grid.Column width={10}>
                    <span className={css.txtTitle}>{_l`Mailchimp`}</span>
                  </Grid.Column>
                  <Grid.Column width={4}>
                    <span className={css.txtTitle}>{}</span>
                  </Grid.Column>
                </Grid.Row>
                <a
                  className={cx(css.btn, css.btnDefault, css.btnBlock, css.btnPrimary, css.marginAuto)}
                >{_l`Link`}</a>
              </Grid>
            </Grid.Column>
          </Grid.Row>

          <Grid.Row> }
            <Grid.Column width={16}>
              <Grid>
                <Grid.Row>
                  <Grid.Column width={2}>
                    <img src={iconFortNox} ></img>
                  </Grid.Column>
                  <Grid.Column width={10}>
                    <span className={css.txtTitle}>{_l`Fortnox`}</span>
                  </Grid.Column>
                  <Grid.Column width={4}>
                    <span className={css.txtTitle}>{}</span>
                  </Grid.Column>
                </Grid.Row>
                <a
                  className={cx(css.btn, css.btnDefault, css.btnBlock, css.btnPrimary, css.marginAuto)}
                >{_l`Link`}</a>
              </Grid>
            </Grid.Column>
          </Grid.Row>
          */}
