// @flow
import * as React from 'react';
import { boolean, text } from '@storybook/addon-knobs/react';
import { action } from '@storybook/addon-actions';
import { Form, Container } from 'semantic-ui-react';
import FormTextArea from './FormTextArea';

type StoryT = {
  add(string, () => React.Node): void,
};

const stories = (storybook: StoryT) => {
  storybook.add('default', () => {
    const inputGroup = 'input';
    const metaGroup = 'meta';
    const rootProp = 'root';
    const input = {
      value: text('value', 'Hello world', inputGroup),
    };
    const meta = {
      error: text('error', null, metaGroup),
      pristine: boolean('pristine', false, metaGroup),
      active: boolean('active', false, metaGroup),
      touched: boolean('touched', false, metaGroup),
    };
    const label = text('label', 'Form text area', rootProp);
    const onFocus = action('onFocus');
    const onBlur = action('onBlur');
    return (
      <Container text>
        <Form>
          <FormTextArea label={label} input={input} meta={meta} onFocus={onFocus} onBlur={onBlur} />
        </Form>
      </Container>
    );
  });
};

export default {
  name: 'Form/FormTextArea',
  stories,
};
