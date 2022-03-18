//@flow
import React, { useState, useEffect } from 'react';
import AddNoteForm from './AddNoteForm';
import _l from 'lib/i18n';
import css from './AddNoteModal.css';
import ModalCommon from '../ModalCommon/ModalCommon';

type PropsT = {
  note: string,
  visible: boolean,
  onClose: () => void,
  onAdd?: () => void,
  onChange?: (string) => void,
  size: ?string
};

addTranslations({
  'en-US': {
    'Add note': 'Add note',
    Cancel: 'Cancel',
    Save: 'Save',
  },
});

const AddNoteModal = ({ visible, note, onChange, onClose, size }: PropsT) => {
  const [noteState, setNoteState] = useState(note ? note : '');

  useEffect(() => {
    setNoteState('');
  }, [visible]);

  const onAdd = () => {
    //api call
    onChange(noteState);
    setNoteState('');
  };

  return (
    <ModalCommon
      title={_l`Add note`}
      className={css.noteModalContainer}
      visible={visible}
      onDone={onAdd}
      onClose={onClose}
      size={size ? size : 'small'}
    >
      <AddNoteForm note={noteState} onChange={(e) => setNoteState(e.length >= 2000 ? e.slice(0, 2000) : e)} />
    </ModalCommon>
  );
};

export default AddNoteModal;
