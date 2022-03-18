import config from './index';

const AppConfig = {
  google_client_id: '307733726193-vig543i7robg90rit9acadmim07a3dqf.apps.googleusercontent.com',
  google_drive_scope: [
    'https://www.googleapis.com/auth/drive',
    'https://www.googleapis.com/auth/plus.me',
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/script.external_request',
    'https://www.googleapis.com/auth/drive',
    'https://www.googleapis.com/auth/drive.apps.readonly',
    'https://www.googleapis.com/auth/drive.readonly'
  ],
  dropbox_id: 'oizsu5g85dou7wp',
  client_id_mailChimp: '541884726006',
  onedrive_for_business_app_id: '83ccf2e0-b29a-4cdb-834b-282afb49e705',
  google_drive_developerKey: 'AIzaSyCZuTl1CIjl5of3UZO10_OlCq7cZOYGCKg',
  gmap_api_key: 'AIzaSyBDCyUn1T6Gq9ODyPzuuePPbxHQI2oYIw0',
  google_drive_clientId: '307733726193-vig543i7robg90rit9acadmim07a3dqf.apps.googleusercontent.com',
  redirect_uri_google: `${process.browser && window.location.origin}/googleRedirect`,
  office365_client_id: 'e38054b3-e0d7-4325-8ca1-660af0f2ac00',
  redirect_uri_office365: `${process.browser && window.location.origin}/officeRedirect`,
  msteam_client_id_admin_existed: 'fcfbe839-0ca5-4da7-9213-ae337854e706',
  msteam_client_id_no_admin: 'e8dd4a4d-a972-4e88-9547-2896b9030524',
  redirect_url_msTeam: `${process.browser && window.location.origin}/msTeamRedirect`,
  // notificationServerUrl: 'https://notification-test.salesbox.com/ws', //qa
  // notificationServerUrl: 'https://notification.salesbox.com/ws', //production
  notificationServerUrl: config.envVal.notificationServerUrl,
  redirect_uri: `${process.browser && window.location.origin}/redirect`,


};
export default AppConfig;
