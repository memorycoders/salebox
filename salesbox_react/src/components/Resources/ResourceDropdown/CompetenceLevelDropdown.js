import React from 'react';
import { Dropdown, Popup } from 'semantic-ui-react';
import _l from 'lib/i18n';

function ProfileLevelDropdown({ _class, onChange, value, colId, calculatingPositionMenuDropdown, ...other }) {
  const levelOptions = [
    {
      key: 1,
      text: (
        <Popup
          hoverable
          content={{
            content: (
              <div>
                <p style={{ margin: 0, fontWeight: 600 }}>{_l`Level 1 - Awareness`}</p>
                <p style={{ margin: 0, wordBreak: 'normal' }}>
                  - {_l`Applies the competency in the simplest situations`}
                </p>
                <p style={{ margin: 0, wordBreak: 'normal' }}>- {_l`Requires close and extensive guidance`}</p>
              </div>
            ),
          }}
          style={{ fontSize: 11 }}
          trigger={<p>1</p>}
        />
      ),
      des: 'test 1',
      value: 1,
    },
    {
      key: 2,
      text: (
        <Popup
          hoverable
          content={{
            content: (
              <div>
                <p style={{ margin: 0, fontWeight: 600 }}>{_l`Level 2 - Basic`}</p>
                <p style={{ margin: 0, wordBreak: 'normal' }}>
                  - {_l`Applies the competency in somewhat difficult situations`}
                </p>
                <p style={{ margin: 0, wordBreak: 'normal' }}>- {_l`Requires frequent guidance`}</p>
              </div>
            ),
          }}
          style={{ fontSize: 11 }}
          trigger={<p>2</p>}
        />
      ),
      des: 'test 2',
      value: 2,
    },
    {
      key: 3,
      text: (
        <Popup
          hoverable
          content={{
            content: (
              <div>
                <p style={{ margin: 0, fontWeight: 600 }}>{_l`Level 3 - Intermediate`}</p>
                <p style={{ margin: 0, wordBreak: 'normal' }}>- {_l`Applies the competency in difficult situations`}</p>
                <p style={{ margin: 0, wordBreak: 'normal' }}>- {_l`Requires occasional guidance`}</p>
              </div>
            ),
          }}
          style={{ fontSize: 11 }}
          trigger={<p>3</p>}
        />
      ),
      des: 'test 3',
      value: 3,
    },
    {
      key: 4,
      text: (
        <Popup
          hoverable
          content={{
            content: (
              <div>
                <p style={{ margin: 0, fontWeight: 600 }}>{_l`Level 4 - Advanced`}</p>
                <p style={{ margin: 0, wordBreak: 'normal' }}>
                  - {_l`Applies the competency in considerably difficult situations`}
                </p>
                <p style={{ margin: 0, wordBreak: 'normal' }}>- {_l`Generally requires little or no guidance`}</p>
              </div>
            ),
          }}
          style={{ fontSize: 11 }}
          trigger={<p>4</p>}
        />
      ),
      des: 'test 4',
      value: 4,
    },
    {
      key: 5,
      text: (
        <Popup
          hoverable
          content={{
            content: (
              <div>
                <p style={{ margin: 0, fontWeight: 600 }}>{_l`Level 5 - Expert`}</p>
                <p style={{ margin: 0, wordBreak: 'normal' }}>
                  - {_l`Applies the competency in exceptionally difficult situations`}
                </p>
                <p style={{ margin: 0, wordBreak: 'normal' }}>- {_l`Serves as a key resource and advises others`}</p>
              </div>
            ),
          }}
          style={{ fontSize: 11 }}
          trigger={<p>5</p>}
        />
      ),
      des: 'test 5',
      value: 5,
    },
  ];
  return (
    <Dropdown
      id={colId}
      className={_class}
      options={levelOptions}
      onChange={onChange}
      value={value}
      fluid
      selection
      search
      onClick={() => {
        calculatingPositionMenuDropdown && calculatingPositionMenuDropdown(colId);
      }}
      {...other}
    />
  );
}

export default ProfileLevelDropdown;
