/* eslint-disable react/jsx-no-bind */
import React, { useEffect, useState } from 'react';
import { Accordion, Icon, Table, Menu } from 'semantic-ui-react';
import api from '../../../../lib/apiClient';
import SettingPane from '../../SettingPane/SettingPane';
import _l from 'lib/i18n';
import MoreMenu from 'components/MoreMenu/MoreMenu';
import css from './account.css';
import style from '../SaleProcess/SaleProcess.css';
import editBtn from '../../../../../public/Edit.svg';

addTranslations({
  'en-US': {
    Account: 'Account',
    'Company & contact - Type': 'Company & contact - Type',
    'Contact - Positions': 'Contact - Positions',
  },
});

const Account = (props) => {
  const [activeIndex, setActiveIndex] = useState(-1);
  const [organisations, setOrganisations] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get({
          resource: 'administration-v3.0/workData/organisations',
        });
        if (res && res.workDataOrganisationDTOList) {
          setOrganisations(res.workDataOrganisationDTOList);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const handleClick = (e, titleProps) => {
    const { index } = titleProps;
    const newIndex = activeIndex === index ? -1 : index;
    setActiveIndex(newIndex);
  };
  const contactTypes = organisations.filter((o) => o.type === 'TYPE');
  const contactRelationship = organisations.filter((o) => o.type === 'CONTACT_RELATIONSHIP');
  const renderContent = (data) => {
    return (
      <Table striped singleLine style={{ border: 'none' }}>
        <Table.Body>
          {data.map((v) => {
            return (
              <Table.Row key={v.uuid}>
                <Table.Cell>{v.name}</Table.Cell>
                <Table.Cell>
                  <MoreMenu className={style.bgMore} color="task">
                    <Menu.Item icon>
                      <div className={style.actionIcon}>
                        {_l`Update`}
                        <img style={{ height: '13px', width: '20px' }} src={editBtn} />
                      </div>
                    </Menu.Item>
                    <Menu.Item icon>
                      <div className={style.actionIcon}>
                        {_l`Delete`}
                        <Icon name="trash alternate" color="grey" />
                      </div>
                    </Menu.Item>
                  </MoreMenu>
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
    );
  };

  console.log('contactTypes', contactTypes);
  return (
    <SettingPane padded title={_l`Account`}>
      <Accordion fluid className={css.account}>
        <Accordion.Title active={activeIndex === 0} index={0} onClick={handleClick} className={css.title}>
          {_l`Company & contact - Type`}
          <Icon name="dropdown" />
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 0}>{renderContent(contactTypes)}</Accordion.Content>
        <Accordion.Title active={activeIndex === 1} index={1} onClick={handleClick} className={css.title}>
          {_l`Contact - Positions`}
          <Icon name="dropdown" />
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 1}>{renderContent(contactRelationship)}</Accordion.Content>
      </Accordion>
    </SettingPane>
  );
};
export default Account;
