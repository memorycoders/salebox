/* eslint-disable react/prop-types */
import React, { useRef } from 'react';
import _l from 'lib/i18n';
import cx from 'classnames';
import ModalCommon from '../../ModalCommon/ModalCommon';
import css from '../ImportContacts/importContact.css';

import setup1 from '../../../../public/setup1.png';
import setup2 from '../../../../public/setup2.png';
import setup3 from '../../../../public/setup3.png';
import setup4 from '../../../../public/setup4.png';
import setup5 from '../../../../public/setup5.png';
import setup6 from '../../../../public/setup6.png';

const OutLookModal = (props) => {
  const textAreaRef = useRef(null);
  const copyToClipboard = () => {
    textAreaRef.current.select();
    document.execCommand('copy');
  };

  return (
    <ModalCommon
      title={_l`Outlook add-in`}
      visible={props.visible}
      okLabel={_l`Save`}
      scrolling={true}
      size={'large'}
      onClose={props.onClose}
      onDone={props.onDone}
      paddingAsHeader
      okHidden={true}
    >
      <p>{_l`You install the Salesbox Outlook add-in through your Outlook online. Once it is installed it will be displayed also in your desktop version of Outlook.`}</p>
      <strong>{_l`Step 1`}</strong>
      <p>
  {_l`Open any email in your Outlook inbox online`}{` `}(<a href="https://outlook.office.com/mail/inbox">https://outlook.office.com/mail/inbox</a>){' '}{_l`and click on the`}{` `}
        <strong>{_l`three dots in the upper right corner`}</strong>
      </p>
      <img
        style={{
          display: 'block',
          maxWidth: '100%',
          width: '100%',
          height: 'auto',
        }}
        src={setup1}
      />
      <p></p>
      <strong>{_l`Step 2`}</strong>
      <p>{_l`Click in the option`} <strong>{' '}{_l`Get Add-ins`}</strong></p>
      <img
        style={{
          display: 'block',
          maxWidth: '100%',
          width: '100%',
          height: 'auto',
        }}
        src={setup2}
      />
      <p></p>
      <strong>{_l`Step 3`}</strong>
      <p>{_l`Click in the option`} <strong>{' '}{_l`My Add-ins`}</strong></p>
      {/* <p>
        <a style={{ marginRight: '20px' }} href="https://go.salesbox.com/outlookplugin/manifest.xml" ref={textAreaRef}>
          https://go.salesbox.com/outlookplugin/manifest.xml
        </a>
        <a className={cx(css.btn, css.btnDefault, css.btnPrimary)} onClick={() =>  navigator.clipboard.writeText('https://go.salesbox.com/outlookplugin/manifest.xml')}>{_l`Copy`}</a>
      </p> */}
      <img
        style={{
          display: 'block',
          maxWidth: '100%',
          width: '100%',
          height: 'auto',
        }}
        src={setup3}
      />
      <p></p>
      <strong>{_l`Step 4`}</strong>
      <p>{_l`Scroll down in the page and click on`}{' '}<strong>"{_l`add a custom add-in`}{' '}"</strong>{_l`click on`}{' '}"<span>{_l`Add from URL`}</span>"</p>
      <img
        style={{
          display: 'block',
          maxWidth: '100%',
          width: '100%',
          height: 'auto',
        }}
        src={setup4}
      />
      <p></p>
      <strong>{_l`Step 5`}</strong>
      <p>{_l`Copy and paste the following link as shown below.`}</p>
      <p><a style={{ marginRight: '20px' }} href="https://go.salesbox.com/outlookplugin/manifest.xml" ref={textAreaRef}>
          https://go.salesbox.com/outlookplugin/manifest.xml
        </a>
        <a className={cx(css.btn, css.btnDefault, css.btnSucces)} onClick={() =>  navigator.clipboard.writeText('https://go.salesbox.com/outlookplugin/manifest.xml')}>{_l`Copy`}</a>
      </p>
      <img
        style={{
          display: 'block',
          maxWidth: '100%',
          width: '100%',
          height: 'auto',
        }}
        src={setup5}
      />
      <p></p>
      <strong>{_l`Step 6`}</strong>
      <p>{_l`Click Install`}</p>
      <img
        style={{
          display: 'block',
          maxWidth: '100%',
          width: '100%',
          height: 'auto',
        }}
        src={setup6}
      />
    </ModalCommon>
  );
};
export default OutLookModal;
