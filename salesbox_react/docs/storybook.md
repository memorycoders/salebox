# Getting going with storybook

[Storybook](https://github.com/storybooks/storybook) is a development environment for UI components. It allows you to browse a component library, view the different states of each component, and interactively develop and test components. It can be used with different libraries like React, React-Native, Angular, Vue

To get going you can simply do this:

  1. `npm run storybook`
  2. ...
  3. profit?

Once you have started the watching process, you can see your stories by navigating to [http://localhost:9001](http://localhost:9001) and play/test with the components you have written stories for.


# Example story

```javascript
// @flow
import * as React from 'react';
import { boolean, text } from '@storybook/addon-knobs/react';
import { action } from '@storybook/addon-actions';
import { Form, Container } from 'semantic-ui-react';
import FormInput from './FormInput';

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
    const label = text('label', 'Form input', rootProp);
    const onFocus = action('onFocus');
    const onBlur = action('onBlur');
    return (
      <Container text>
        <Form>
          <FormInput label={label} input={input} meta={meta} onFocus={onFocus} onBlur={onBlur} />
        </Form>
      </Container>
    );
  });
};

export default {
  name: 'Form/FormInput',
  stories,
};
```
# Including in storybook

Once you have written a story, all you have to do is include it in [src/components/stories.js](../src/components/stories.js) which at the moment of writing this looks like next:

```javascript
// @flow
import FormInput from 'components/Form/FormInput.stories';
import FormPassword from 'components/Form/FormPassword.stories';
import FormTextArea from 'components/Form/FormTextArea.stories';

export default [FormInput, FormPassword, FormTextArea];
```
