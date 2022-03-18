import React, { useState, useEffect } from 'react';
import ModalCommon from '../../ModalCommon/ModalCommon';
import { Input } from 'semantic-ui-react';
import _l from 'lib/i18n';
import css from './ConnectGoogleModal.css';

function ConnectDomainModal({ onDone, onClose, visible }) {
  const [error, setError] = useState(null);
  const [email, setEmail] = useState('');

  useEffect(() => {
    setEmail('');
    setError(null);
  }, [visible]);

  const handleChangeEmail = (e) => {
    setEmail(e.target.value);
    setError(null);
  };
  const handleOnDone = () => {
    if (!email || email?.trim() === '') {
      setError(_l`Domain is required`);
      return;
    }
    onDone(email);
  };

  return (
    <ModalCommon
      title={_l`Connect your domain`}
      visible={visible}
      onDone={handleOnDone}
      onClose={onClose}
      size="tiny"
    >
      <div className={css.formRow}>
        <div className={css.labelDiv}>
          <p className={css.formLabel}>{_l`Domain`}</p>
          <span className={css.required}>*</span>
        </div>
        <div className={css.inputDiv}>
          <Input type="text" name="domain" onChange={handleChangeEmail} error={error} value={email} fluid />
          {error && <p className={css.errorMessage}>{error}</p>}
        </div>
      </div>
    </ModalCommon>
  );
}

export default ConnectDomainModal;
