import { configure } from '@storybook/react';

function loadStories() {
  require('../src/story-loader');
}

configure(loadStories, module);
