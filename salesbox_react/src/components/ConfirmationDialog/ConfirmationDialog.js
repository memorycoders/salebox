//@flow
import * as React from 'react';
import { Transition, Modal, Button } from 'semantic-ui-react';
import _l from 'lib/i18n';
import { compose, defaultProps } from 'recompose';
import { UIDefaults } from 'Constants';

type PropsT = {
  visible: boolean,
  onClose: () => void,
  onSave?: () => void,
  title: string,
  color: string,
  yesLabel: string,
  noLabel: string,
  children: React.Node,
  yesEnabled: boolean,
};

addTranslations({
  'en-US': {
    'Delete this object?': 'Delete this object?',
    'No, keep object': 'No, keep object',
  },
});

const ConfirmationDialog = ({
  color,
  children,
  yesEnabled,
  yesLabel,
  noLabel,
  title,
  visible,
  onClose,
  onSave,
}: PropsT) => {
  return (
    <Transition unmountOnHide visible={visible} animation="fade down" duration={UIDefaults.AnimationDuration}>
      <Modal open onClose={onClose} size="small" closeIcon={false}>
        <Modal.Header className={color}>{title}</Modal.Header>
        <Modal.Content>{children}</Modal.Content>
        <Modal.Actions>
          <Button basic onClick={onClose}>
            {noLabel}
          </Button>
          <Button disabled={!yesEnabled} primary onClick={onSave}>
            {yesLabel}
          </Button>
        </Modal.Actions>
      </Modal>
    </Transition>
  );
};
export default compose(
  defaultProps({
    yesEnabled: true,
    color: 'purple',
    title: _l`Are you sure you want to delete?`,
    noLabel: _l`No, keep object`,
  })
)(ConfirmationDialog);
