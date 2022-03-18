// @flow
import * as React from 'react';
import { compose, withHandlers } from 'recompose';
import { connect } from 'react-redux';

import { Button, Divider } from 'semantic-ui-react';

import _l from 'lib/i18n';

import * as wizardActions from 'components/Wizard/wizard.actions';
import css from "../../Corporation/Sub/FinishPage.css";
import cssModal from "../../../../ModalCommon/ModalCommon.css";
import cx from 'classnames';

type PropsT = {
  handleWelcomePersonalFinish: (event: Event, {}) => void,
};

const clipperLink = 'https://chrome.google.com/webstore/detail/salesbox-crm/fikoabpflobfkghjpokjbbilajcbdpmc?hl=en';

addTranslations({
  'en-US': {
    'LinkedIn with Salesbox LeadClipper': 'LinkedIn with Salesbox LeadClipper',
    "click from your potential customer's LinkedIn profile": "click from your potential customer's LinkedIn profile",
    'With the Lead Clipper, you can add unqualified deals with one ':
      'With the Lead Clipper, you can add unqualified deals with one ',
    'Install LeadClipper': 'Install LeadClipper',
  },
});

const InstallLeadClipperInstruction = ({ handleWelcomePersonalFinish }: PropsT) => {
  return (
    <div style={{ textAlign: 'center' }}>
      <br></br>
      <br></br>
      <p>{_l`Add companies, contacts or prospects to Salesbox from`}</p>
      <p>{_l`LinkedIn with Salesbox LeadClipper`}</p>
      <br></br>
      <br></br>
{/*
      <p>{_l`With the Salesbox LeadClipper for LinkedIn, you can add deals with one`}</p>
      <p>{_l`click from your contact's LinkedIn profile`}</p>
*/}
      <br></br>
      <br></br>
      <Button
        // basic color="blue"
        primary
        className={cx(css.button, cssModal.commonButton)}
        onClick={() => window.open(clipperLink, '_blank')}>{_l`Install LeadClipper`}</Button>
      <br></br>
      {/*<Divider />*/}
      {/*<Button primary onClick={handleWelcomePersonalFinish}>{_l`Next`}</Button>*/}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {};
};
const mapDispatchToProps = {
  welcomePersonalFinish: wizardActions.welcomePersonalFinish,
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withHandlers({
    handleWelcomePersonalFinish: ({ welcomePersonalFinish }) => (event, {}) => {
      welcomePersonalFinish();
    },
  })
)(InstallLeadClipperInstruction);
