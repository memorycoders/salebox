import React from 'react';
import SettingPane from '../../SettingPane/SettingPane';
import _l from 'lib/i18n';

addTranslations({
  'en-US': {
    'Relation mode': 'Relation mode',
  },
});

const RelationMode = (props) => {
  return (
    <SettingPane padded title={_l`Relation mode`}>
      Relation mode
    </SettingPane>
  );
};
export default RelationMode;
