//@flow
import * as React from 'react';
import _l from 'lib/i18n';
import { compose, pure, branch, renderNothing } from 'recompose';
import { FormPair, Collapsible } from 'components';

type PropsType = {
  contact: {},
};

addTranslations({
  'en-US': {
    '{0}': '{0}',
    Pipeline: 'Pipeline',
    'Gross pipe': 'Gross pipe',
  },
});

const isPipelineEmpty = (contact) => {
  return (
    contact.grossPipeline === 0 &&
    contact.netPipeline === 0 &&
    contact.grossPipeline === 0 &&
    contact.grossPipeline === 0
  );
};

const PipelinePane = ({ contact }: PropsType) => {
  const open = !isPipelineEmpty(contact);
  return (
    <Collapsible padded title={_l`Pipeline`} open={open}>
      <FormPair left mini label={_l`Gross pipe`}>
        {_l`${contact.grossPipeline}`}
      </FormPair>
      <FormPair left mini label={_l`Net pipe`}>
        {_l`${contact.netPipeline}`}
      </FormPair>
      {/* <FormPair left mini label={_l`Pipe profit`}>
        {_l`${contact.grossPipeline}`}
      </FormPair>
      <FormPair left mini label={_l`Pipe margin`}>
        {_l`${contact.grossPipeline}:p`}
      </FormPair> */}
    </Collapsible>
  );
};

export default compose(
  branch(({ contact }) => !contact || Object.keys(contact).length < 1, renderNothing),
  pure
)(PipelinePane);
