/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react';
import { Grid } from 'semantic-ui-react';
import _l from 'lib/i18n';
import { connect } from 'react-redux';
import cx from 'classnames';
import * as NotificationActions from 'components/Notification/notification.actions';
import IntergrationPane from '../IntergrationPane';
import css from '../ImportContacts/importContact.css';
import OutLookModal from './outlookModal';

import chromeLinkedin from '../../../../public/chrome_linkedin.png';
import iconOutlook from '../../../../public/icon_Outlook.png';
import gmailPluginLogo from '../../../../public/gmail-plugin-logo.png';
import wordpressLogo from '../../../../public/wordpressLogo.png';

const Addons = (props) => {
  const [showModal, setShowModal] = useState(false);
  const installChromePlugin = () => {
    const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
    if (!isChrome) {
      return props.putError(_l`Plugin is supported only on Chrome browser`);
    }
    window.open('https://chrome.google.com/webstore/detail/salesbox-crm/fikoabpflobfkghjpokjbbilajcbdpmc');
  };

  const redirectToGmailPlugin = () => {
    const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
    if (!isChrome) {
      return props.putError(_l`Plugin is supported only on Chrome browser`);
    }
    window.open('https://chrome.google.com/webstore/detail/salesbox-crm/egmicciljibbhfmndknakpfilmopgjik');
  };

  const redirectWordpressPlugin = () => {
    window.open('https://wordpress.org/plugins/salesbox-forms/');
  }
  const installOutLookPlugin = () => {
    setShowModal(true);
  };

  return (
    <>
      <IntergrationPane padded title={_l`Add-ons`}>
        <Grid>
          <Grid.Row>
            <Grid.Column width={10}>
              <Grid>
                <Grid.Row>
                  <Grid.Column width={3}>
                    <img src={chromeLinkedin} />
                  </Grid.Column>
                  <Grid.Column width={13}>
                    <span className={css.txtTitle}>{_l`Lead clipper`}</span>
                    <p
                      className={css.txtContent}
                    >{_l`Import or enrich unqualified deals, contacts and companies from LinkedIn.`}</p>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Grid.Column>
            <Grid.Column width={6}>
              <a
                onClick={installChromePlugin}
                className={cx(css.btn, css.btnDefault, css.btnBlock, css.btnPrimary)}
              >{_l`Install`}</a>
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column width={10}>
              <Grid>
                <Grid.Row>
                  <Grid.Column width={3}>
                    <img src={iconOutlook} />
                  </Grid.Column>
                  <Grid.Column width={13}>
                    <span className={css.txtTitle}>{_l`Outlook add-in`}</span>
                    <p
                      className={css.txtContent}
                      style={{ marginBottom: '2px' }}
                    >{_l`Add Tasks, Notes, Appointments and Unqualified deals to Salesbox CRM directly from Outlook.`}</p>
                    {/* <p className={css.txtContent}>
                      {_l`Track inbound and outbound emails and get notified when the receiver opens your emails.`}
                    </p> */}
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Grid.Column>
            <Grid.Column width={6}>
              <a
                onClick={installOutLookPlugin}
                className={cx(css.btn, css.btnDefault, css.btnBlock, css.btnPrimary)}
              >{_l`Install`}</a>
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column width={10}>
              <Grid>
                <Grid.Row>
                  <Grid.Column width={3}>
                    <img src={gmailPluginLogo} />
                  </Grid.Column>
                  <Grid.Column width={13}>
                    <span className={css.txtTitle}>{_l`Gmail add-in`}</span>
                    <p
                      className={css.txtContent}
                      style={{ marginBottom: '2px' }}
                    >{_l`Add Tasks, Notes, Appointments and Unqualified deals to Salesbox CRM directly from Gmail.`}</p>
                    {/* <p className={css.txtContent}>
                      {_l`Track inbound and outbound emails and get notified when the receiver opens your emails.`}
                    </p> */}
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Grid.Column>
            <Grid.Column width={6}>
              <a
                onClick={redirectToGmailPlugin}
                className={cx(css.btn, css.btnDefault, css.btnBlock, css.btnPrimary)}
              >{_l`Install`}</a>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={10}>
              <Grid>
                <Grid.Row>
                  <Grid.Column width={3}>
                    <img src={wordpressLogo} />
                  </Grid.Column>
                  <Grid.Column width={13}>
                    <span className={css.txtTitle}>{_l`Wordpress form`}</span>
                    <p
                      className={css.txtContent}
                      style={{ marginBottom: '2px' }}
                    >{_l`Configure your own lead generation forms to catch leads from Wordpress and get them added automatically to your Salesbox account.`}</p>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Grid.Column>
            <Grid.Column width={6}>
              <a
                onClick={redirectWordpressPlugin}
                className={cx(css.btn, css.btnDefault, css.btnBlock, css.btnPrimary)}
              >{_l`Install`}</a>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </IntergrationPane>
      <OutLookModal visible={showModal} onClose={() => setShowModal(false)} onDone={() => setShowModal(false)} />
    </>
  );
};
export default connect(null, {
  putError: NotificationActions.error,
  putSuccess: NotificationActions.success,
})(Addons);
