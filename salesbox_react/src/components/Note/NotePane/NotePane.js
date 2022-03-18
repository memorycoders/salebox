//@flow
import * as React from 'react';
import _l from 'lib/i18n';
import { compose, pure, branch, renderNothing } from 'recompose';
import { Collapsible } from 'components';

type PropsType = {
  note: string,
};

addTranslations({
  'en-US': {
    '{0}': '{0}',
    Notes: 'Notes',
  },
});
const NotesPane = ({ note }: PropsType) => {
  const [collapseNote, setCollapseNote] = useState(true);

  const MAX_LENGTH = 50;
  const shortenNote = (value) => {
    if (value && value.length > MAX_LENGTH) {
      return value.slice(0, MAX_LENGTH);
    }
    return value;
  };
  return (
    <Collapsible padded title={_l`Note`}>
      {note && note.length > MAX_LENGTH
        ? collapseNote
          ? `${shortenNote(note)} ${(<a onClick={() => setCollapseNote(!collapseNote)}>...</a>)}`
          : `${note} ${(<a onClick={() => setCollapseNote(!collapseNote)}>^</a>)}`
        : note}
    </Collapsible>
  );
};

export default compose(
  branch(({ note }) => !note, renderNothing),
  pure
)(NotesPane);
