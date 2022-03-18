// @flow
import { storiesOf } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs/react';
import { setOptions } from '@storybook/addon-options';
import stories from 'components/stories';
import 'style/theme.less';

setOptions({
  addonPanelInRight: true,
});

const storybook = storiesOf('Drawer', module);
storybook.addDecorator(withKnobs);

const load = (stories) => {
  stories.forEach((story) => {
    const storybook = storiesOf(story.name, module);
    storybook.addDecorator(withKnobs);
    story.stories(storybook);
  });
};

load(stories);
