// @flow
/* eslint-disable react/jsx-no-bind */
import * as React from 'react';
import { boolean, text } from '@storybook/addon-knobs/react';
import { action } from '@storybook/addon-actions';
import { Form, Container } from 'semantic-ui-react';
import FormPassword from './FormPassword';
import { withState } from '@dump247/storybook-state';

type StoryT = {
  add(string, () => React.Node): void,
};

const stories = (storybook: StoryT) => {
  storybook.add(
    'default',
    withState({ password: '' })(({ store }) => {
      const metaGroup = 'meta';
      const rootProp = 'root';
      const input = {
        value: store.state.password,
      };
      const meta = {
        error: text('error', null, metaGroup),
        pristine: boolean('pristine', false, metaGroup),
        active: boolean('active', false, metaGroup),
        touched: boolean('touched', false, metaGroup),
      };
      const label = text('label', 'Password', rootProp);
      const onFocus = action('onFocus');
      const onBlur = action('onBlur');
      return (
        <Container text>
          <Form>
            <FormPassword
              label={label}
              input={input}
              meta={meta}
              onChange={(event, { value }) => store.set({ password: value })}
              onFocus={onFocus}
              onBlur={onBlur}
            />
          </Form>
        </Container>
      );
    })
  );
};

export default {
  name: 'Form/FormPassword',
  stories,
};
