import React, { memo } from 'react';
import { Modal, Button } from 'semantic-ui-react';
import classnames from 'classnames';

import css from './customFields.css';
import _l from 'lib/i18n';

const ModalCustom = ({
  size = 'small',
  onClose,
  open,
  children,
  setOpenModal,
  onDone,
  title,
  labelCacel = _l`Cancel`,
  labeSave = _l`Save`,
}) => {
  return (
    <Modal size={size} onClose={onClose} open={open}>
      <Modal.Header>
        <span className={css.commonModaltitle}>{title}</span>
      </Modal.Header>
      <Modal.Content>{children}</Modal.Content>
      <Modal.Actions>
        <Button
          className={classnames(css.commonCloseButton, css.commonButton)}
          tabIndex={0}
          onClick={() => setOpenModal(false)}
        >
          {labelCacel}
        </Button>
        <Button className={classnames(css.commonButton, css.commonDoneButton)} tabIndex={0} onClick={onDone}>
          {labeSave}
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default memo(ModalCustom);
