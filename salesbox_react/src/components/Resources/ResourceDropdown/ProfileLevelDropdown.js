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
                <p style={{ margin: 0 }}>{_l`Competence level 1`}</p>
                <p style={{ margin: 0 }}>
                  <span style={{ fontWeight: 600, wordBreak: 'normal' }}>{_l`Knowledge`}</span> -{' '}
                  {_l`recently completed training in the current role`}
                </p>
                <p style={{ margin: 0 }}>
                  <span style={{ fontWeight: 600, wordBreak: 'normal' }}>Experience</span> -{' '}
                  {_l`shorter work experience or new to the role of consultant`}
                </p>
                <p style={{ margin: 0 }}>
                  <span style={{ fontWeight: 600, wordBreak: 'normal' }}>{_l`Management`}</span> -{' '}
                  {_l`requires management`}
                </p>
                <p style={{ margin: 0 }}>
                  <span style={{ fontWeight: 600, wordBreak: 'normal' }}>{_l`Independence`}</span> -{' '}
                  {_l`can independently perform simple tasks`}
                </p>
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
                <p style={{ margin: 0 }}>{_l`Competence level 2`}</p>
                <p style={{ margin: 0 }}>
                  <span style={{ fontWeight: 600, wordBreak: 'normal' }}>{_l`Knowledge`}</span> -{' '}
                  {_l`has training in the current role, some degree of difficulty`}
                </p>
                <p style={{ margin: 0 }}>
                  <span style={{ fontWeight: 600, wordBreak: 'normal' }}>{_l`Experience`}</span> -{' '}
                  {_l`has participated in the execution of several similar assignments. The level is normally reached after 1-3 years in the current role`}
                </p>
                <p style={{ margin: 0 }}>
                  <span style={{ fontWeight: 600, wordBreak: 'normal' }}>{_l`Management`}</span> -{' '}
                  {_l`requires management`}
                </p>
                <p style={{ margin: 0 }}>
                  <span style={{ fontWeight: 600, wordBreak: 'normal' }}>{_l`Independence`}</span> -{' '}
                  {_l`can independently perform limited tasks`}
                </p>
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
                <p style={{ margin: 0 }}>{_l`Competence level 3`}</p>
                <p style={{ margin: 0 }}>
                  <span style={{ fontWeight: 600, wordBreak: 'normal' }}>{_l`Knowledge`}</span> -{' '}
                  {_l`high competence in the current role`}
                </p>
                <p style={{ margin: 0 }}>
                  <span style={{ fontWeight: 600, wordBreak: 'normal' }}>{_l`Experience`}</span> -{' '}
                  {_l`worked 4-8 years in the current role, is a role model for other Consultants at lower levels`}
                </p>
                <p style={{ margin: 0 }}>
                  <span style={{ fontWeight: 600, wordBreak: 'normal' }}>{_l`Management`}</span> -{' '}
                  {_l`takes responsibility for sub-area, can lead and small group`}
                </p>
                <p style={{ margin: 0 }}>
                  <span style={{ fontWeight: 600, wordBreak: 'normal' }}>{_l`Independence`}</span> -{' '}
                  {_l`can work independently`}
                </p>
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
                <p style={{ margin: 0 }}>{_l`Competence level 4`}</p>
                <p style={{ margin: 0 }}>
                  <span style={{ fontWeight: 600, wordBreak: 'normal' }}>{_l`Knowledge`}</span> -{' '}
                  {_l`high generalist competence, or very high competence in the current role`}
                </p>
                <p style={{ margin: 0 }}>
                  <span style={{ fontWeight: 600, wordBreak: 'normal' }}>{_l`Experience`}</span> -{' '}
                  {_l`has participated in large assignments within the current role and completed Consultancy Services with very high quality. The level is normally reached at the earliest after 9–12 years in the current role`}
                </p>
                <p style={{ margin: 0 }}>
                  <span style={{ fontWeight: 600, wordBreak: 'normal' }}>{_l`Management`}</span> -{' '}
                  {_l`takes main responsibility for the management of a larger group`}
                </p>
                <p style={{ margin: 0 }}>
                  <span style={{ fontWeight: 600, wordBreak: 'normal' }}>{_l`Independence`}</span> -{' '}
                  {_l`very independent`}
                </p>
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
                <p style={{ margin: 0 }}>{_l`Competence level 5`}</p>
                <p style={{ margin: 0 }}>
                  <span style={{ fontWeight: 600, wordBreak: 'normal' }}>{_l`Knowledge`}</span> -{' '}
                  {_l`competence of the highest rank in the current role, perceived as an expert in the market`}
                </p>
                <p style={{ margin: 0 }}>
                  <span style={{ fontWeight: 600, wordBreak: 'normal' }}>{_l`Experience`}</span> -{' '}
                  {_l`has participated in large assignments within the current role and completed Consultancy Services with very high quality. The level is normally reached at the earliest after 9–12 years in the current role`}
                </p>
                <p style={{ margin: 0 }}>
                  <span style={{ fontWeight: 600, wordBreak: 'normal' }}>{_l`Management`}</span> -{' '}
                  {_l`has great experience and experience to work in a leading position`}
                </p>
                <p style={{ margin: 0 }}>
                  <span style={{ fontWeight: 600, wordBreak: 'normal' }}>{_l`Independence`}</span> -{' '}
                  {_l`very independent`}
                </p>
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
