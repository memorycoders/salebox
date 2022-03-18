/* eslint-disable indent */
/* eslint-disable prettier/prettier */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/prop-types */
import * as React from 'react';
import { Icon, Menu, Popup } from 'semantic-ui-react';
import _l from 'lib/i18n';
import { connect } from 'react-redux';
import { OverviewTypes } from 'Constants';
import add from '../../../../public/Add.svg';
import googleDocs from '../../../../public/google-docs.svg';
import googleSheets from '../../../../public/google-sheets.svg';
import googleSlides from '../../../../public/google-slides.svg';
import googleDrive from '../../../../public/google-drive.svg';
import uoloadDocument from '../../../../public/upload-document.svg';
import css from '../../CreateMenu/CreateMenu.css';

import * as OverviewActions from '../../../components/Overview/overview.actions';
import AppConfig from '../../../../config/app.config';
import { getUserIdentifier } from './document.selector';
import * as NotificationActions from 'components/Notification/notification.actions';

import api from '../../../lib/apiClient';
import googleDriveCustomService from './service/googleDriveCustomService';
import { fetchDocumentsByFileIdSuccess, fetchDocumentsByFileId } from '../common.actions';
import { STORAGES } from '../../../Constants';
import { updateNumberDocumentDetail } from '../../PipeLineQualifiedDeals/qualifiedDeal.actions';

addTranslations({
  'en-US': {
    '{0}': '{0}',
    'New Folder': 'New Folder',
    'Import from Google Drive': 'Import from Google Drive',
    'Upload to Google Drive': 'Upload to Google Drive',
    "This account doesn't match your linked Google account. Please try again!":
      "This account doesn't match your linked Google account. Please try again!",
    'Import from Dropbox': 'Import from Dropbox',
    'Upload to OneDrive': 'Upload to OneDrive',
  },
});

const iconStyle = {
  height: 16,
  width: 16,
};

const menuStyle = {
  width: '25% !important',
};

const popupStyle = {
  padding: 0,
};

class CreateMenu extends React.Component {
  constructor(props) {
    super(props);
    this.oauthToken = '';
    this.state = {
      open: false,
    };
  }

  componentDidMount() {
    this.initGapi();
  }

  loadClientWhenGapiReady = (script) => {
    if (script.getAttribute('gapi_processed')) {
      if (window.location.hostname === 'localhost') {
        gapi.client.load('http://localhost:8080/_ah/api/discovery/v1/apis/metafields/v1/rest').then(
          (response) => {
            console.log('Connected to metafields API locally.');
          },
          function(err) {
            console.log('Error connecting to metafields API locally.');
          }
        );
      }
    } else {
      console.log('Client wasnt ready, trying again in 100ms');
      setTimeout(() => {
        this.loadClientWhenGapiReady(script);
      }, 100);
    }
  };

  initGapi() {
    const script = document.createElement('script');
    script.onload = () => {
      console.log('Loaded script, now loading our api...');
      // Gapi isn't available immediately so we have to wait until it is to use gapi.
      this.loadClientWhenGapiReady(script);
    };
    script.src = 'https://apis.google.com/js/client.js';
    document.body.appendChild(script);
  }

  onOpen = () => {
    this.setState({ open: true });
  };

  onClose = () => {
    this.setState({ open: false });
  };

  _handleNewFolder = () => {
    this.props.setActionForHighlight(this.props.overviewTypes, 'add_folder');
  };

  checkAuth = (immediateCheck, lib, ver, callbackCheckAuth) => {
    const gapi = window && window.gapi;
    gapi.auth.authorize(
      {
        client_id: AppConfig.google_client_id,
        scope: AppConfig.google_drive_scope.join(' '),
        immediate: immediateCheck,
        cookie_policy: 'single_host_origin',
        ux_mode: 'popup',
      },
      (authResult) => {
        if (!lib) lib = 'drive';
        if (authResult && !authResult.error) {
          gapi.client.load('oauth2', 'v2', () => {
            gapi.client.oauth2.userinfo.get().execute((resp) => {
              if (resp.id !== this.props.userIdentifier) {
                this.props.putError(_l`This account doesn't match your linked Google account. Please try again!`);
              } else {
                this.oauthToken = authResult.access_token;
                if (lib !== 'picker') {
                  gapi.client.load(lib, ver, callbackCheckAuth);
                } else {
                  gapi.client.load('drive', ver, () => {
                    gapi.load(lib, { callback: callbackCheckAuth });
                  });
                }
              }
            });
          });
        } else {
          this.checkAuth(false, lib, ver, callbackCheckAuth);
        }
      }
    );
  };

  _handleDoc = async () => {
    // this.checkAuth(true, 'drive', 'v3', () => {
    //   this.props.setActionForHighlight(this.props.overviewTypes, 'add_google_doc');
    // });
    this.props.setActionForHighlight(this.props.overviewTypes, 'add_google_doc');
  };

  _handleSpreadsheet = async () => {
    // this.checkAuth(true, 'drive', 'v3', () => {
    //   this.props.setActionForHighlight(this.props.overviewTypes, 'add_google_spreadsheet');
    // });
    this.props.setActionForHighlight(this.props.overviewTypes, 'add_google_spreadsheet');
  };

  _handleGoogleSlide = async () => {
    // this.checkAuth(true, 'drive', 'v3', () => {
    //   this.props.setActionForHighlight(this.props.overviewTypes, 'add_google_presentation');
    // });
    this.props.setActionForHighlight(this.props.overviewTypes, 'add_google_presentation');
  };

  _handlePicker = () => {
    this.checkAuth(true, 'picker', 'v3', () => {
      this.createPicker();
    });
  };

  createPicker = () => {
    const picker = new window.google.picker.PickerBuilder()
      .addView(window.google.picker.ViewId.DOCS)
      .addView(window.google.picker.ViewId.FOLDERS)
      .setOAuthToken(this.oauthToken)
      .setDeveloperKey(AppConfig.google_drive_developerKey)
      .setCallback(this.pickerCallback)
      .build();
    picker.setVisible(true);
  };

  pickerCallback = async (data) => {
    if (data[window.google.picker.Response.ACTION] === window.google.picker.Action.PICKED) {
      const doc = data[window.google.picker.Response.DOCUMENTS][0];
      const { selected, rootFolder } = this.props;
      const cloudParentFolderId = rootFolder.fileId;
      googleDriveCustomService.copyFile(doc.id, cloudParentFolderId).then(async (res) => {
        const documentDTO = {
          name: res.result.name,
          isFolder: false,
          authorId: rootFolder.authorId,
          sourceType: rootFolder.sourceType,
          prospectId: rootFolder.prospectId,
          fileURL: res.result.webViewLink,
          fileId: res.result.id,
        };
        try {
          const res = await api.post({
            resource: 'document-v3.0/document/add',
            data: documentDTO,
          });
          if (res) {
            this.props.fetchDocumentsByFileId(this.props.item.uuid, cloudParentFolderId);
            // this.props.fetchDocumentsByFileIdSuccess({ documentDTOList: [res] }, cloudParentFolderId);
          }
        } catch (error) {
          this.props.putError(error.message);
        }
      });
    }
  };

  _handeUpload = async () => {
    const _this = this;
    document.getElementById('file-google').click();
    document.getElementById('file-google').onchange = function() {
      if (this.files && this.files.length) {
        _this.putFileToCloud(this.files[0]);
        // if (!googleDriveCustomService.checkValidFileGoogleDrive(_this.getExtension(this.files[0].name)[0], null)) {
        //   _this.props.putError("Invalid file: " + this.files[0].name);
        //   return;
        // }
        // // Authen
        // const gapi = window && window.gapi;
        // gapi.auth.authorize(
        //   {
        //     client_id: AppConfig.google_drive_clientId,
        //     scope: AppConfig.google_drive_scope,
        //     immediate: false
        //   },
        //   (authResult) => {
        //     console.log('authResult', authResult);
        //     //Check xem co phai la google drive lam sao
        //     if (authResult && !authResult.error) {
        //       gapi.client.load('oauth2', 'v2', () => {
        //         gapi.client.oauth2.userinfo.get().execute((resp) => {
        //           if (resp.id !== _this.props.userIdentifier) {
        //             this.props.putError(_l`This account doesn't match your linked Google account. Please try again!`);
        //           } else {
        //             const { selected, rootFolder } = _this.props;
        //             const cloudParentFolderId = rootFolder.fileId;
        //             googleDriveCustomService.insertFile(this.files[0], cloudParentFolderId, async(createdFile) => {
        //               const documentDTO = {
        //                 name: createdFile.title,
        //                 isFolder: false,
        //                 authorId: rootFolder.authorId,
        //                 sourceType: rootFolder.sourceType,
        //                 prospectId: rootFolder.prospectId,
        //                 fileURL: createdFile.alternateLink,
        //                 fileId: createdFile.id,
        //                 folderId: selected.uuid ? selected.uuid : rootFolder.uuid,
        //               }
        //               try {
        //                 const res = await api.post({
        //                   resource: 'document-v3.0/document/add',
        //                   data: documentDTO,
        //                 });
        //                 if (res) {
        //                   _this.props.fetchDocumentsByFileId(_this.props.item.uuid, cloudParentFolderId);
        //                   // _this.props.fetchDocumentsByFileIdSuccess({ documentDTOList: [res] }, cloudParentFolderId);
        //                 }
        //               } catch (error) {
        //                 _this.props.putError(error.message);
        //               }
        //             });
        //           }
        //         });
        //       });
        //     }
        //   }
        // );
      }
    };
  };

  _handleImportDropbox() {}

  getExtension = (filename) => {
    filename = filename.toLowerCase();
    return /[.]/.exec(filename) ? /[^.]+$/.exec(filename) : undefined;
  };

  putFileToCloud = async (file) => {
    const { rootFolder, currentOverviewType } = this.props;
    let objectType = 'ACCOUNT';
    switch (currentOverviewType) {
      case OverviewTypes.Account:
        objectType = 'ACCOUNT';
        break;
      case OverviewTypes.Contact:
        objectType = 'CONTACT';
        break;
      case OverviewTypes.Pipeline.Qualified:
        objectType = 'OPPORTUNITY';
        break;
      case OverviewTypes.Pipeline.Order:
        objectType = 'OPPORTUNITY';
        break;
    }
    try {
      let formData = new FormData();
      formData.append('uploadFile', file);
      const res = await api.post({
        resource: 'document-v3.0/document/putFileToCloud',
        query: {
          objectType: objectType,
          objectId: this.props.objectId,
          folderId: rootFolder.fileId,
        },
        data: formData,
        options: {
          headers: {
            'content-type': 'multipart/form-data;',
          },
        },
      });
      if (res) {
        this.props.fetchDocumentsByFileId(this.props.objectId, rootFolder.fileId);
      }

      const resNumberDocument = await api.get({
        resource: 'document-v3.0/document/countByObject',
        query: {
          objectType: objectType,
          objectId: this.props.objectId,
        },
      });
      if (resNumberDocument) {
        this.props.updateNumberDocumentDetail(resNumberDocument);
      }
    } catch (error) {
      this.props.putError(error.message);
    }
  };

  renderMenu() {
    switch (this.props.storageType) {
      case STORAGES.DROP_BOX:
        return (
          <Menu vertical color="teal">
            <Menu.Item onClick={() => this._handleImportDropbox()}>
              <div className={css.actionIcon}>
                {_l`Import from Dropbox`}
                <Icon name="download" color="greyDocument" />
              </div>
            </Menu.Item>
            <Menu.Item onClick={() => this._handleUploadToDropbox()}>
              <div className={css.actionIcon}>
                {_l`Upload to Dropbox`}
                <Icon name="upload" color="greyDocument" />
              </div>
            </Menu.Item>
          </Menu>
        );
      default:
        // GOOGLE_DRIVE
        return (
          <Menu vertical color="teal">
            {/* <Menu.Item onClick={() => this._handleNewFolder()}>
          <div className={css.actionIcon}>
            {_l`New Folder`}
            <Icon name="folder" color="greyDocument" />
          </div>
        </Menu.Item> */}
            {/* <Menu.Item onClick={() => this._handleDoc()}>
              <div className={css.actionIcon}>
                {_l`Create Google Doc`}   => dùng lại thì khai báo lại trong message.json
                <img src={googleDocs} style={{ height: '13px', width: '20px' }} />
              </div>
            </Menu.Item>
            <Menu.Item onClick={() => this._handleSpreadsheet()}>
              <div className={css.actionIcon}>
                {_l`Create Google Sheet`}
                <img src={googleSheets} style={{ height: '13px', width: '20px' }} />
              </div>
            </Menu.Item>
            <Menu.Item>
              <div className={css.actionIcon} onClick={() => this._handleGoogleSlide()}>
                {_l`Create Google Slide`}
                <img src={googleSlides} style={{ height: '13px', width: '20px' }} />
              </div>
            </Menu.Item> */}
            {/* <Menu.Item>
          <div className={css.actionIcon} onClick={this._handlePicker}>
            {_l`Import from Google Drive`}
            <img src={googleDrive} style={{ height: '13px', width: '20px' }} />
          </div>
        </Menu.Item> */}
            <Menu.Item>
              <div className={css.actionIcon} onClick={this._handeUpload}>
                {_l`Upload to Google Drive`}
                <img src={uoloadDocument} style={{ height: '13px', width: '20px' }} />
              </div>
            </Menu.Item>
          </Menu>
        );
    }
  }
  render() {
    const profileMenuItem = <img style={iconStyle} src={add} />;
    return (
      <Popup
        hoverable
        trigger={profileMenuItem}
        onOpen={this.onOpen}
        onClose={this.onClose}
        onClick={this.onClose}
        open={this.state.open}
        style={popupStyle}
        flowing
        position="bottom right"
        keepInViewPort
        hideOnScroll
      >
        {this.renderMenu()}
      </Popup>
    );
  }
}

const mapStateToProps = (state) => {
  const userIdentifier = getUserIdentifier(state, 'GOOGLE_DRIVE');
  return {
    userIdentifier,
    selected: state.common.__DOCUMENTS.selected ? state.common.__DOCUMENTS.selected : {},
    rootFolder: state.common.__DOCUMENTS.rootFolder ? state.common.__DOCUMENTS.rootFolder : {},
    storageType: state.common.__DOCUMENTS.storageType,
    objectId: state.common.__DOCUMENTS.objectId,
    currentOverviewType: state.common.currentOverviewType,
  };
};

export default connect(mapStateToProps, {
  setActionForHighlight: OverviewActions.setActionForHighlight,
  putError: NotificationActions.error,
  fetchDocumentsByFileIdSuccess,
  fetchDocumentsByFileId,
  updateNumberDocumentDetail
})(CreateMenu);
