//@flow
import * as React from 'react';
import { useState } from 'react';
import _l from 'lib/i18n';
import { connect } from 'react-redux';
import { compose, pure } from 'recompose';
import Collapsible from 'components/Collapsible/Collapsible';
import * as delegationActions from 'components/Delegation/delegation.actions';
import css from './CreateNotePane.css';
import AddNoteModal from 'components/Note/AddNoteModal';
import { WIDTH_DEFINE } from '../../../Constants';

type PropsT = {
  note: {},
  showAddNoteForm: () => void,
  hideAddNoteForm: () => void,
  onChange: (string) => void,
  addNoteFormShown: boolean,
};

addTranslations({
  'en-US': {
    '{0}': '{0}',
    Note: 'Note',
    'Add note': 'Add note',
  },
});

const NotePane = ({ note, onChange, showAddNoteForm, hideAddNoteForm, addNoteFormShown }: PropsT) => {
  const [collapseNote, setCollapseNote] = useState(true);

  const MAX_LENGTH = 100;
  const shortenNote = (value) => {
    if (value && value.length > MAX_LENGTH) {
      return value.slice(0, MAX_LENGTH);
    }
    return value;
  };
  return (
    <Collapsible hasDragable width={WIDTH_DEFINE.DETAIL_WIDTH_CONTENT} padded title={_l`Note`}>
      {note && note.length > MAX_LENGTH ? (
        collapseNote ? (
          <>
            <p style={{ whiteSpace: 'pre-line' }}>{`${shortenNote(note)} `}</p>
            <span style={{ color: 'black', cursor: 'pointer',fontSize: 13,paddingRight: 15,paddingBottom: 10,fontWeight: 'bold' }} className={css.showMoreTextIcon} onClick={() => setCollapseNote(!collapseNote)}>
              ...
            </span>
          </>
        ) : (
          <>
            <p style={{ whiteSpace: 'pre-line' }}>{`${note} `}</p>
            <span style={{ color: 'black', cursor: 'pointer' }} className={css.showMoreTextIcon} onClick={() => setCollapseNote(!collapseNote)}>
              ^
            </span>
          </>
        )
      ) : (
        <p style={{ whiteSpace: 'pre-line' }}>{note}</p>
      )}
      {!note && <div className={css.addNoteButton} size="small" onClick={showAddNoteForm} fluid>{_l`Add note`}</div>}
      <AddNoteModal onChange={onChange} note={note} visible={addNoteFormShown} onClose={hideAddNoteForm} />
    </Collapsible>
  );
};

export default compose(
  connect(
    (state) => ({
      addNoteFormShown: state.ui.delegation.addNoteFormShown,
    }),
    {
      showAddNoteForm: delegationActions.showAddNoteForm,
      hideAddNoteForm: delegationActions.hideAddNoteForm,
    }
  ),
  pure
)(NotePane);
