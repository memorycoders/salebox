import React, { useState, useEffect } from 'react';
import ModalCommon from '../../ModalCommon/ModalCommon';
import { Input } from 'semantic-ui-react';
import _l from 'lib/i18n';
import isEmail from 'lib/isEmail';
import css from './ConnectGoogleModal.css';

function ConnectGoogleModal({ onDone, onClose, visible }) {
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
    if (!email || email === '') {
      setError(_l`Email is required`);
      return;
    }
    if (email && !isEmail(email)) {
      setError(_l`Email is invalid`);
      return;
    }
    onDone(email);
  };

  return (
    <ModalCommon
      title={_l`Verify Google account`}
      visible={visible}
      onDone={handleOnDone}
      onClose={onClose}
      size="tiny"
    >
      <div className={css.formRow}>
        <div className={css.labelDiv}>
          <p className={css.formLabel}>{_l`Email`}</p>
          <span className={css.required}>*</span>
        </div>
        <div className={css.inputDiv}>
          <Input type="text" name="email" onChange={handleChangeEmail} error={error} value={email} fluid />
          {error && <p className={css.errorMessage}>{error}</p>}
        </div>
      </div>
    </ModalCommon>
  );
}

export default ConnectGoogleModal;
