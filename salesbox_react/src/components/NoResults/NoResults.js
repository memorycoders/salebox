// @flow
import * as React from 'react';
import { compose, withProps } from 'recompose';
import { Container, Message, Icon } from 'semantic-ui-react';
import _l from 'lib/i18n';
import css from './NoResults.css';

type PropsT = {
  title: string,
  message: string,
};

addTranslations({
  'en-US': {
    'No results': 'No results',
  },
});

const NoResults = ({ title, message }: PropsT) => {
  return (
    <Container text className={css.noResults}>
      <Message error icon>
        <Icon name="search" />
        <Message.Content>
          <Message.Header>{title}</Message.Header>
          {message}
        </Message.Content>
      </Message>
    </Container>
  );
};

export default compose(
  withProps(({ title, message }) => ({
    title: title || _l`No results`,
    message:
      message || _l`Your search/filtering yielded no results, please try again with a different search term or filter`,
  }))
)(NoResults);
