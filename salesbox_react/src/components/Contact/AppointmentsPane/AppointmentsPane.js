//@flow
import * as React from 'react';
import _l from 'lib/i18n';
import { compose, pure } from 'recompose';
import { Collapsible } from 'components';

type PropsType = {
  contact: {},
};

addTranslations({
  'en-US': {
    '{0}': '{0}',
  },
});
const AppointmentsPane = ({ contact }: PropsType) => {
  return (
    <Collapsible padded title={_l`Meetings`}>
      TODO: Meetings will be here
    </Collapsible>
  );
};

export default compose(pure)(AppointmentsPane);
