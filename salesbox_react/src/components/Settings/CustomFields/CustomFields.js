import React, { useState, memo, useEffect } from 'react';
import { Button, Menu } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import classnames from 'classnames';

import ViewResult from './ViewResult';
import * as SettingsActions from 'components/Settings/settings.actions';
import css from './customFields.css';
import _l from 'lib/i18n';


const CustomFields = ({ fetchCustomFieldsSettings, updateObjectTypeCustomFieldsSettings }: any) => {
  const [valueField, setValueField] = useState('ACCOUNT');
  const BUTTON = [
    { id: 1, name: _l`Companies`, value: 'ACCOUNT' },
    { id: 2, name: _l`Contacts`, value: 'CONTACT' },
    { id: 3, name: _l`Deals`, value: 'OPPORTUNITY' },
    { id: 4, name: _l`Prospects`, value: 'LEAD' },
    { id: 5, name: _l`Reminders`, value: 'TASK' },
    { id: 6, name: _l`Meetings`, value: 'APPOINTMENT' },
    { id: 7, name: _l`Users`, value: 'USER' },
    { id: 8, name: _l`Products`, value: 'PRODUCT_REGISTER' },
  ];

  useEffect(() => {
    fetchCustomFieldsSettings(valueField);
    updateObjectTypeCustomFieldsSettings(valueField);
  }, [fetchCustomFieldsSettings, valueField, updateObjectTypeCustomFieldsSettings]);

  return (
    <div style={{ height: '100%', paddingTop: 10, paddingLeft: 5 }}>
      {/* <Menu id="period" secondary borderless className={css.secondary}>
        <span className={css.title}>Rights</span>
      </Menu> */}

      <div style={{ padding: '0px 10px' }}>
        {BUTTON.map((item, index) => (
          <Button
            key={index}
            onClick={() => setValueField(item.value)}
            className={classnames(css.buttonItem, valueField === item.value ? css.buttonGroup : css.buttonGroupClicked)}
          >
            {item.name}
          </Button>
        ))}

        <ViewResult />
      </div>
    </div>
  );
};

export default compose(
  memo,
  connect(null, {
    fetchCustomFieldsSettings: SettingsActions.fetchCustomFieldsSettings,
    updateObjectTypeCustomFieldsSettings: SettingsActions.updateObjectTypeCustomFieldsSettings,
  })
)(CustomFields);
