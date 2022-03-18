//@flow
import * as React from 'react';
import { Form, Ref, TextArea } from 'semantic-ui-react';
import { lifecycle, withHandlers, compose } from 'recompose';
import _l from 'lib/i18n';
import css from './AddNoteForm.css';

type PropsT = {
  note: string,
  handleRef: (any) => void,
  onChange: (event: Event, { value: string }) => void,
};

addTranslations({
  'en-US': {
    'Note...': 'Note...',
  },
});

const AddNoteForm = ({ note, handleRef, onChange }: PropsT) => {
  return (
    <Form>
      <Form.Input className={css.noteContainerInput} autoFocus>
        <Ref innerRef={handleRef}>
          <TextArea
            className={css.noteInput}
            placeholder={_l`Note...`}
            rows={5}
            autoHeight
            value={note ? note : ''}
            onChange={onChange}
          />
        </Ref>
      </Form.Input>
      <div className={css.noteMaxLength}>{note ? 2000 - note.length : 2000}</div>
    </Form>
  );
};

export default compose(
  withHandlers(() => {
    let textarea;
    return {
      handleRef: () => (ref) => (textarea = ref),
      onChange: ({ onChange }) => (event, { value }) => onChange(value),
      focus: () => () => {
        textarea.focus();
      },
    };
  }),
  lifecycle({
    componentDidMount() {
      this.props.focus();
    },
  })
)(AddNoteForm);
