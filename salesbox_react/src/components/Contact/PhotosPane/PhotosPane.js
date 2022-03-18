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
    Photos: 'Photos',
  },
});
const PhotosPane = ({ contact }: PropsType) => {
  return (
    <Collapsible padded title={_l`Photos`}>
      TODO: Photos will be here
    </Collapsible>
  );
};

export default compose(pure)(PhotosPane);
