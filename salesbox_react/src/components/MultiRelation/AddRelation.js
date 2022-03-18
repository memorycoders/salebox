//@flow
import React, { useState } from 'react';
import _l from 'lib/i18n';
import { compose, withHandlers, pure, withState } from 'recompose';
import { connect } from 'react-redux';
import OrganisationDropdown from '../Organisation/OrganisationDropdown';
import { Menu } from 'semantic-ui-react';
import ModalCommon from '../ModalCommon/ModalCommon';
import { FormPair } from 'components';
import * as OverviewActions from 'components/Overview/overview.actions';
import { Form } from 'semantic-ui-react';
import { isHighlightAction } from '../Overview/overview.selectors';
import AccountDropdown from './AccountDropdown/AccountDropdown';
import ContactDropdown from './ContactDropdown/ContactDropdown';
import RelationTypeDropdown from './RelationType/RelationTypeDropdown';
import { requestFetch } from './multi-relation.actions';
import css from './MultiRelation.css';
import api from 'lib/apiClient';

type PropsT = {
  visible: boolean,
  onClose: () => void,
  onSave?: () => void,
};

addTranslations({
  'en-US': {
    'Add a relation': 'Add a relation',
    Account: 'Account',
    Contact: 'Contact',
    Relation: 'Relation',
    'Relation is required': 'Relation is required',
  },
});

const AddRelation = ({
  isContact,
  objectType,
  onSave,
  visible,
  onClose,
  errorAccount,
  errorRelation,
  setErrorAccount,
  setErrorRelation,
}) => {
  const [accountId, setAccountId] = useState(null);
  const [relation, setRelation] = useState(null);
  const [tab, setTab] = useState('account');

  return (
    <ModalCommon
      className={css.addRelationModal}
      title={_l`Add a relation`}
      visible={visible}
      onDone={() => onSave(accountId, relation, tab === 'account' ? 'ACCOUNT' : 'CONTACT')}
      onClose={onClose}
      contenStyle={css.contentModal}
      paddingAsHeader={false}
      scrolling={false}
      description={false}
    >
      {isContact && (
        <Menu className={css.tabContainer} pointing secondary className={css.menu}>
          <Menu.Item
            className={css.tab}
            active={tab === 'account'}
            onClick={() => {
              setTab('account');
              setAccountId(null);
              setErrorAccount('');
            }}
          >
            <p>{_l`Company`}</p>
          </Menu.Item>
          <Menu.Item
            className={css.tab}
            active={tab === 'contact'}
            onClick={() => {
              setTab('contact');
              setAccountId(null);
              setErrorAccount('');
            }}
          >
            <p>{_l`Contact`}</p>
          </Menu.Item>
        </Menu>
      )}
      <div className="qualified-add-form">
        <Form>
          <Form.Group style={{ display: tab === 'account' ? 'flex' : 'none' }} className="unqualified-fields">
            <div className="unqualified-label">
              {_l`Company`}
              <span className="required">*</span>
            </div>
            <div className="dropdown-wrapper" width={8}>
              <AccountDropdown
                setAccountForForm={(uuid) => {
                  setAccountId(uuid);
                  setErrorAccount('');
                }}
              />

              <span className="form-errors">{errorAccount}</span>
            </div>
          </Form.Group>
          <Form.Group style={{ display: tab !== 'account' ? 'flex' : 'none' }} className="unqualified-fields">
            <div className="unqualified-label">
              {_l`Contact`}
              <span className="required">*</span>
            </div>
            <div className="dropdown-wrapper" width={8}>
              <ContactDropdown
                setContactForForm={(uuid) => {
                  setAccountId(uuid);
                  setErrorAccount('');
                }}
              />
              <span className="form-errors">{errorAccount}</span>
            </div>
          </Form.Group>

          <Form.Group className="unqualified-fields">
            <div className="unqualified-label">
              {_l`Position`} <span className="required">*</span>
            </div>
            <div className="dropdown-wrapper" width={8}>
              <RelationTypeDropdown
                setRelationForForm={(item) => {
                  setRelation(item);
                  setErrorRelation('');
                }}
                objectType={objectType}
              />
              <span className="form-errors">{errorRelation}</span>
            </div>
          </Form.Group>
        </Form>
      </div>
    </ModalCommon>
  );
};

export default compose(
  connect(
    (state, { overviewType }) => {
      const visible = isHighlightAction(state, overviewType, 'add_relation');
      return {
        visible,
      };
    },

    {
      clearHighlightAction: OverviewActions.clearHighlightAction,
      requestFetch,
    }
  ),
  withState('errorAccount', 'setErrorAccount', ''),
  withState('errorRelation', 'setErrorRelation', ''),
  withHandlers({
    onClose: ({ clearHighlightAction, overviewType }) => () => {
      clearHighlightAction(overviewType);
    },
    onSave: ({
      objectType,
      requestFetch,
      overviewType,
      clearHighlightAction,
      setErrorAccount,
      setErrorRelation,
    }) => async (accountId, relation, targetType) => {
      try {
        if (!accountId) {
          return setErrorAccount(_l`Company is required`);
        }
        if (!relation) {
          return setErrorRelation(_l`Relation is required`);
        }
        const patchNameSplit = location.pathname.split('/');
        if (patchNameSplit.length > 0) {
          const objectId = patchNameSplit[patchNameSplit.length - 1];
          const data = await api.post({
            resource: `administration-v3.0/multiRelationDetail/addOrEdit`,
            data: { multiRelationDTO: relation, objectId, targetId: accountId, targetType: targetType },
          });
          requestFetch(objectType, objectId);
          clearHighlightAction(overviewType);
        }
      } catch (error) {}
    },
  })
)(AddRelation);
